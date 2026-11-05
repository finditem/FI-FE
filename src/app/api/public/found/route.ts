import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import { PublicFoundPortalItem } from "./PublicFoundPortalItem";

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
 * @description 공공데이터 포털(경찰청) 습득물 조회 API 프록시 라우트
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const ATC_ID = searchParams.get("atcId") || "";
  const PRDT_CL_CD_01 = searchParams.get("PRDT_CL_CD_01") || "";
  const PRDT_CL_CD_02 = searchParams.get("PRDT_CL_CD_02") || "";
  const FD_COL_CD = searchParams.get("FD_COL_CD") || "";
  const PRDT_NM = searchParams.get("PRDT_NM") || "";
  const START_YMD = searchParams.get("START_YMD") || "";
  const END_YMD = searchParams.get("END_YMD") || "";
  const N_FD_LCT_CD = searchParams.get("N_FD_LCT_CD") || "";
  const requestedPageNo = clampPageNo(searchParams.get("pageNo"));
  const requestedNumOfRows = clampNumOfRows(searchParams.get("numOfRows"));

  const apiKey = process.env.PUBLIC_DATA_PORTAL_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const baseUrl = ATC_ID
    ? "https://apis.data.go.kr/1320000/LosfundInfoInqireService/getLosfundDetailInfo"
    : "https://apis.data.go.kr/1320000/LosfundInfoInqireService/getLosfundInfoAccToClAreaPd";

  const params = new URLSearchParams();
  if (ATC_ID) params.append("ATC_ID", ATC_ID);
  if (ATC_ID) params.append("FD_SN", "1");
  if (PRDT_CL_CD_01) params.append("PRDT_CL_CD_01", PRDT_CL_CD_01);
  if (PRDT_CL_CD_02) params.append("PRDT_CL_CD_02", PRDT_CL_CD_02);
  if (FD_COL_CD) params.append("FD_COL_CD", FD_COL_CD);
  if (START_YMD) params.append("START_YMD", START_YMD);
  if (END_YMD) params.append("END_YMD", END_YMD);
  if (N_FD_LCT_CD) params.append("N_FD_LCT_CD", N_FD_LCT_CD);
  params.append("pageNo", PRDT_NM ? "1" : String(requestedPageNo));
  params.append("numOfRows", PRDT_NM ? String(PRDT_NM_FETCH_SIZE) : String(requestedNumOfRows));

  const queryPrefix = `serviceKey=${apiKey}`;
  const url = `${baseUrl}?${queryPrefix}&${params.toString()}`;

  try {
    const response = await fetch(url, {
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
      const rawItems = res.body?.items?.item || [];
      const itemList = Array.isArray(rawItems) ? rawItems : [rawItems];

      let filteredItems = itemList;
      if (PRDT_NM) {
        filteredItems = itemList.filter((item: PublicFoundPortalItem) => {
          const name = item.fdPrdtNm || "";
          const sbjt = item.fdSbjt || "";
          const place = item.fdPlace || item.depPlace || "";
          return name.includes(PRDT_NM) || sbjt.includes(PRDT_NM) || place.includes(PRDT_NM);
        });
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
