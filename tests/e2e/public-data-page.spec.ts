import { test, expect, Page } from "@playwright/test";

const MOCK_LOST_ITEMS = {
  items: {
    item: [
      {
        atcId: "L2024001",
        depPlace: "서울 중부경찰서",
        fdFilePathImg: "",
        fdPrdtNm: "갤럭시 스마트폰",
        fdSbjt: "강남구 역삼동에서 분실",
        fdYmd: "20240115",
        prdtClNm: "전자기기",
        rnum: "1",
      },
      {
        atcId: "L2024002",
        depPlace: "경기 수원남부경찰서",
        fdFilePathImg: "",
        fdPrdtNm: "검정 가죽 지갑",
        fdSbjt: "수원역 근처에서 분실",
        fdYmd: "20240114",
        prdtClNm: "지갑",
        rnum: "2",
      },
    ],
  },
  numOfRows: 10,
  pageNo: 1,
  totalCount: 2,
};

const MOCK_FOUND_ITEMS = {
  items: {
    item: [
      {
        atcId: "F2024001",
        depPlace: "부산 해운대경찰서",
        fdFilePathImg: "",
        fdPrdtNm: "애플 노트북",
        fdSbjt: "해운대 해수욕장 인근에서 습득",
        fdYmd: "20240116",
        prdtClNm: "전자기기",
        rnum: "1",
      },
    ],
  },
  numOfRows: 10,
  pageNo: 1,
  totalCount: 1,
};

const MOCK_EMPTY_ITEMS = {
  items: { item: [] },
  numOfRows: 10,
  pageNo: 1,
  totalCount: 0,
};

const MOCK_LOST_DETAIL = {
  items: {
    item: {
      atcId: "L2024001",
      depPlace: "서울 중부경찰서",
      fdFilePathImg: "",
      fdPrdtNm: "갤럭시 스마트폰",
      fdSbjt: "강남구 역삼동에서 분실",
      fdYmd: "20240115",
      prdtClNm: "전자기기",
      rnum: "1",
      tel: "02-1234-5678",
    },
  },
};

async function setupListPageMocks(
  page: Page,
  options: { type?: "lost" | "found" | "both"; empty?: boolean } = {}
) {
  const { type = "both", empty = false } = options;

  if (type === "lost" || type === "both") {
    await page.route("**/api/public/lost**", (route) => {
      if (route.request().url().includes("atcId")) return route.continue();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(empty ? MOCK_EMPTY_ITEMS : MOCK_LOST_ITEMS),
      });
    });
  }

  if (type === "found" || type === "both") {
    await page.route("**/api/public/found**", (route) => {
      if (route.request().url().includes("atcId")) return route.continue();
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_FOUND_ITEMS),
      });
    });
  }
}

async function setupDetailPageMocks(page: Page, options: { status?: number } = {}) {
  const { status = 200 } = options;

  await page.route("**/api/public/lost**", (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body:
        status === 200 ? JSON.stringify(MOCK_LOST_DETAIL) : JSON.stringify({ error: "Not Found" }),
    })
  );
}

test.describe("공공 데이터 목록 페이지", () => {
  test("분실 탭이 기본으로 활성화되어 있다", async ({ page }) => {
    await setupListPageMocks(page);
    await page.goto("/public-data");

    await expect(page.getByRole("button", { name: "분실" })).toBeVisible();
    await expect(page.getByText("갤럭시 스마트폰")).toBeVisible();
  });

  test("분실 목록 아이템이 정상적으로 렌더링된다", async ({ page }) => {
    await setupListPageMocks(page);
    await page.goto("/public-data");

    await expect(page.getByText("갤럭시 스마트폰")).toBeVisible();
    await expect(page.getByText("검정 가죽 지갑")).toBeVisible();

    await expect(page.getByText("서울 중부경찰서")).toBeVisible();
    await expect(page.getByText("경기 수원남부경찰서")).toBeVisible();

    const chips = page.getByText("경찰청");
    await expect(chips.first()).toBeVisible();
  });

  test("습득 탭 클릭 시 습득 목록이 표시된다", async ({ page }) => {
    await setupListPageMocks(page);
    await page.goto("/public-data");

    await page.getByRole("button", { name: "습득" }).click();

    await expect(page.getByText("애플 노트북")).toBeVisible();
    await expect(page.getByText("부산 해운대경찰서")).toBeVisible();
  });

  test("조회된 데이터가 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await setupListPageMocks(page, { empty: true });
    await page.goto("/public-data");

    await expect(page.getByText("조회된 데이터가 없습니다.")).toBeVisible();
  });

  test("목록 아이템 클릭 시 상세 페이지로 이동한다", async ({ page }) => {
    await setupListPageMocks(page);
    await page.goto("/public-data");

    await page.getByText("갤럭시 스마트폰").click();

    await page.waitForURL("**/public-data/lost/L2024001");
  });

  test("지역 선택 필터 버튼 클릭 시 필터 바텀시트가 열린다", async ({ page }) => {
    await setupListPageMocks(page);
    await page.goto("/public-data");

    await page.getByRole("button", { name: "지역 선택 필터" }).click();

    await expect(page.getByRole("heading", { name: "필터" })).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole("radiogroup", { name: "지역 선택" })).toBeVisible();
  });

  test("카테고리 필터 버튼 클릭 시 필터 바텀시트가 열린다", async ({ page }) => {
    await setupListPageMocks(page);
    await page.goto("/public-data");

    await page.getByRole("button", { name: "카테고리 필터" }).click();

    await expect(page.getByRole("heading", { name: "필터" })).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole("radiogroup", { name: "카테고리 선택" })).toBeVisible();
  });

  test("지역 필터 선택 후 적용 시 URL에 region 파라미터가 추가된다", async ({ page }) => {
    await setupListPageMocks(page);
    await page.goto("/public-data");

    await page.getByRole("button", { name: "지역 선택 필터" }).click();
    await expect(page.getByRole("heading", { name: "필터" })).toBeVisible({ timeout: 3000 });

    await page.getByRole("radio", { name: "서울특별시" }).click();
    await page.getByRole("button", { name: "필터 적용" }).click();

    await expect(page).toHaveURL(/region=LCA000/, { timeout: 10000 });
  });

  test("카테고리 필터 선택 후 적용 시 URL에 category 파라미터가 추가된다", async ({ page }) => {
    await setupListPageMocks(page);
    await page.goto("/public-data");

    await page.getByRole("button", { name: "카테고리 필터" }).click();
    await expect(page.getByRole("heading", { name: "필터" })).toBeVisible({ timeout: 3000 });

    await page.getByRole("radio", { name: "가방" }).click();
    await page.getByRole("button", { name: "필터 적용" }).click();

    await expect(page).toHaveURL(/category=PRA000/, { timeout: 10000 });
  });
});

test.describe("공공 데이터 상세 페이지", () => {
  test("분실물 상세 정보가 정상적으로 렌더링된다", async ({ page }) => {
    await setupDetailPageMocks(page);
    await page.goto("/public-data/lost/L2024001");

    await expect(page.getByRole("heading", { name: "갤럭시 스마트폰", level: 1 })).toBeVisible();
    await expect(page.getByText("강남구 역삼동에서 분실")).toBeVisible();
    await expect(page.getByText("분실 정보")).toBeVisible();
    await expect(page.getByText("전자기기")).toBeVisible();
  });

  test("API 에러 시 에러 토스트가 표시된다", async ({ page }) => {
    await setupDetailPageMocks(page, { status: 500 });
    await page.goto("/public-data/lost/L2024001");

    await expect(page.getByText("게시글 불러오기에 실패했어요")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("공공 데이터 검색 페이지", () => {
  test("검색 입력창이 표시된다", async ({ page }) => {
    await page.goto("/public-data/lost/search");

    await expect(page.getByPlaceholder("검색어를 입력해주세요.")).toBeVisible();
  });

  test("최근 검색 기록이 없을 때 빈 상태 메시지가 표시된다", async ({ page }) => {
    await page.goto("/public-data/lost/search");

    await expect(page.getByText("최근 검색한 기록이 없어요.")).toBeVisible();
  });

  test("검색어 입력 후 검색 시 결과 탭이 표시된다", async ({ page }) => {
    await page.route("**/api/public/lost**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_LOST_ITEMS),
      })
    );

    await page.goto("/public-data/lost/search");

    const searchInput = page.getByPlaceholder("검색어를 입력해주세요.");
    await searchInput.fill("갤럭시");
    await searchInput.press("Enter");

    await expect(page.getByRole("button", { name: "분실" })).toBeVisible();
    await expect(page.getByRole("button", { name: "습득" })).toBeVisible();
  });
});
