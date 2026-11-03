import { NextRequest, NextResponse } from "next/server";

/** 주소 검색어의 최대 길이입니다. 과도하게 긴 쿼리로 VWorld 호출을 남용하지 못하도록 막습니다. */
const MAX_QUERY_LENGTH = 100;

/** 동일 주소 검색 결과를 재사용하는 캐시 유효 기간(초)입니다. 주소는 거의 바뀌지 않으므로 하루로 둡니다. */
const SEARCH_REVALIDATE_SECONDS = 86400;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: "Query is too long" }, { status: 400 });
  }

  const apiKey = process.env.VWORLD_API_KEY;
  const vworldUrl = `https://api.vworld.kr/req/search?service=search&request=search&key=${apiKey}&query=${encodeURIComponent(query)}&type=address&category=road`;

  try {
    const response = await fetch(vworldUrl, { next: { revalidate: SEARCH_REVALIDATE_SECONDS } });
    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}
