import { formatNaverAddress } from "./getNaverAddress";

const region = (area3: string) => ({
  area0: { name: "kr" },
  area1: { name: "서울특별시", alias: "서울" },
  area2: { name: "성동구" },
  area3: { name: area3 },
  area4: { name: "" },
});

const land = (type: string, name: string | null, number1: string, number2 = "") => ({
  type,
  name,
  number1,
  number2,
});

// 네이버 역지오코딩 실제 응답(성수동 일대)에서 필요한 필드만 옮긴 값이다.
const result = (name: string, area3: string, landValue?: ReturnType<typeof land>) =>
  ({ name, region: region(area3), land: landValue }) as any;

describe("formatNaverAddress", () => {
  it("도로명 주소가 있으면 시도 전체 이름으로 도로명 주소를 만든다", () => {
    const results = [
      result("legalcode", "성수동2가"),
      result("roadaddr", "성수동2가", land("", "성수이로", "147")),
      result("addr", "성수동2가", land("1", null, "289", "319")),
    ];

    expect(formatNaverAddress(results)).toEqual({
      address: "성수동2가",
      fullAddress: "서울특별시 성동구 성수이로 147",
    });
  });

  it("도로명 주소의 부번이 있으면 본번-부번으로 붙인다", () => {
    const results = [
      result("legalcode", "성수동1가"),
      result("roadaddr", "성수동1가", land("", "뚝섬로1가길", "19", "12")),
    ];

    expect(formatNaverAddress(results).fullAddress).toBe("서울특별시 성동구 뚝섬로1가길 19-12");
  });

  it("도로명 주소가 없으면 시도 약칭으로 지번 주소를 만든다", () => {
    const results = [
      result("legalcode", "성수동2가"),
      result("addr", "성수동2가", land("1", null, "315", "73")),
    ];

    expect(formatNaverAddress(results)).toEqual({
      address: "성수동2가",
      fullAddress: "서울 성동구 성수동2가 315-73",
    });
  });

  it("지번의 부번이 없으면 본번만 쓴다", () => {
    const results = [
      result("legalcode", "성수동1가"),
      result("addr", "성수동1가", land("1", null, "720")),
    ];

    expect(formatNaverAddress(results).fullAddress).toBe("서울 성동구 성수동1가 720");
  });

  it("산 번지이면 번지 앞에 산을 붙인다", () => {
    const results = [result("legalcode", "응봉동"), result("addr", "응봉동", land("2", null, "1"))];

    expect(formatNaverAddress(results).fullAddress).toBe("서울 성동구 응봉동 산 1");
  });

  it("주소 결과가 없으면 fullAddress는 null이다", () => {
    expect(formatNaverAddress([result("legalcode", "성수동2가")])).toEqual({
      address: "성수동2가",
      fullAddress: null,
    });
  });

  it("결과가 비어 있으면 둘 다 null이다", () => {
    expect(formatNaverAddress([])).toEqual({ address: null, fullAddress: null });
  });
});
