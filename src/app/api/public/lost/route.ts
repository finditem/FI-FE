import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import { PublicLostPortalItem } from "./PublicLostPortalItem";
import { PublicDataItem } from "@/types";

/** 호출자가 지정할 수 있는 numOfRows 상한입니다. 상한이 없으면 포털 API 키 할당량을 한 번에 소진할 수 있습니다. */
const MAX_NUM_OF_ROWS = 100;
const DEFAULT_NUM_OF_ROWS = 10;

/**
 * 검색어(PRDT_NM)가 있을 때 포털에서 받아와 메모리에서 거를 건수입니다. 포털 API가 이름 검색을 지원하지
 * 않아 서버가 넉넉히 받아 직접 필터링하므로, 호출자 입력이 아닌 서버 고정값으로 둡니다.
 */
const PRDT_NM_FETCH_SIZE = 1000;

/** 1 이상의 정수가 아니면 기본값으로, 상한을 넘으면 상한으로 자릅니다. */
const clampNumOfRows = (raw: string | null): number => {
  const parsed = Number.parseInt(raw ?? "", 10);
  if (Number.isNaN(parsed)) return DEFAULT_NUM_OF_ROWS;
  return Math.min(Math.max(parsed, 1), MAX_NUM_OF_ROWS);
};

/** 1 이상의 정수가 아니면 첫 페이지로 보정합니다. */
const clampPageNo = (raw: string | null): number => {
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

/**
 * @author jikwon
 * @description 공공데이터 포털(경찰청) 분실물 조회 API 프록시 라우트
 * @description 분실물 조회 API에서 분실물 조회 시 날짜 파라미터가 비어있거나 검색 기간이 너무 길면 500(99) 서버 에러가 발생합니다.
 * @description 최대 허용 검색 기간 제한이 있으므로 기본값은 1개월로 설정합니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const ATC_ID = searchParams.get("atcId") || "";
  const PRDT_CL_CD_01 = searchParams.get("PRDT_CL_CD_01") || "";
  const LST_LCT_CD = searchParams.get("LST_LCT_CD") || "";
  const PRDT_NM = searchParams.get("PRDT_NM") || "";

  const now = new Date();
  const defaultEnd = now.toISOString().slice(0, 10).replace(/-/g, "");
  now.setMonth(now.getMonth() - 1);
  const defaultStart = now.toISOString().slice(0, 10).replace(/-/g, "");

  const START_YMD = searchParams.get("START_YMD")?.replace(/-/g, "") || defaultStart;
  const END_YMD = searchParams.get("END_YMD")?.replace(/-/g, "") || defaultEnd;
  const requestedPageNo = clampPageNo(searchParams.get("pageNo"));
  const requestedNumOfRows = clampNumOfRows(searchParams.get("numOfRows"));

  const apiKey = process.env.PUBLIC_DATA_PORTAL_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const baseUrl = ATC_ID
    ? "https://apis.data.go.kr/1320000/LostGoodsInfoInqireService/getLostGoodsDetailInfo"
    : "https://apis.data.go.kr/1320000/LostGoodsInfoInqireService/getLostGoodsInfoAccToClAreaPd";

  const params = new URLSearchParams();

  if (ATC_ID) {
    params.append("ATC_ID", ATC_ID);
    params.append("LST_SN", "1");
  } else {
    if (PRDT_CL_CD_01) params.append("PRDT_CL_CD_01", PRDT_CL_CD_01);
    if (LST_LCT_CD) params.append("LST_LCT_CD", LST_LCT_CD);

    params.append("START_YMD", START_YMD);
    params.append("END_YMD", END_YMD);

    params.append("pageNo", PRDT_NM ? "1" : String(requestedPageNo));
    params.append("numOfRows", PRDT_NM ? String(PRDT_NM_FETCH_SIZE) : String(requestedNumOfRows));
  }

  const finalUrl = `${baseUrl}?serviceKey=${apiKey}&${params.toString()}`;

  try {
    const response = await fetch(finalUrl, {
      method: "GET",
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      // 게이트웨이 단계에서 차단되면 정상 응답과 다른 스키마가 오므로 정규식으로만 사유를 추출한다.
      const errorBody = await response.text().catch(() => "");
      const errMsg = errorBody.match(/<errMsg>([^<]*)<\/errMsg>/)?.[1];
      const reasonCode = errorBody.match(/<returnReasonCode>([^<]*)<\/returnReasonCode>/)?.[1];

      return NextResponse.json(
        { error: errMsg || "포털 서버 연결 실패", code: reasonCode },
        { status: response.status }
      );
    }

    const responseText = await response.text();

    const xmlResult = await parseStringPromise(responseText, { explicitArray: false });
    const res = xmlResult.response;

    if (res?.header?.resultCode === "00") {
      const bodyItems = res.body?.items?.item || [];
      const itemList = Array.isArray(bodyItems) ? bodyItems : [bodyItems];

      const normalizedItems = itemList.map((item: PublicLostPortalItem) => ({
        atcId: item.atcId || item.lstId || item.MANAGE_ID || "",
        depPlace: item.lstLctNm || item.lstPlace || item.LS_PLC || "",
        fdFilePathImg: item.lstFilePathImg || "",
        fdPrdtNm: item.lstPrdtNm || item.LS_THNG_DTLS || "",
        fdSbjt: item.lstSbjt || item.NOTI_CONT || "",
        fdYmd: item.lstYmd || item.LS_DE || "",
        prdtClNm: item.prdtClNm || item.THNG_CLASS_NM || "",
        rnum: item.rnum || "1",
      }));

      let filteredItems = normalizedItems;
      if (PRDT_NM) {
        filteredItems = normalizedItems.filter(
          (item: PublicDataItem) =>
            item.fdPrdtNm.includes(PRDT_NM) ||
            item.fdSbjt.includes(PRDT_NM) ||
            item.depPlace.includes(PRDT_NM)
        );
      }

      const finalItems = PRDT_NM
        ? filteredItems.slice(
            (requestedPageNo - 1) * requestedNumOfRows,
            requestedPageNo * requestedNumOfRows
          )
        : filteredItems;

      return NextResponse.json({
        items: { item: finalItems },
        numOfRows: requestedNumOfRows,
        pageNo: requestedPageNo,
        totalCount: PRDT_NM ? filteredItems.length : parseInt(res.body?.totalCount || "0"),
      });
    }

    return NextResponse.json(
      { error: res?.header?.resultMsg || "포털 서버 응답 에러", code: res?.header?.resultCode },
      { status: 400 }
    );
  } catch {
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
}
