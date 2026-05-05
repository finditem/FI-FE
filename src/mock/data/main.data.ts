export const MOCK_AUTH_REFRESH = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, temporaryPassword: false },
};

export const MOCK_USERS_ME = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: { userId: 1, nickName: "테스트유저", profileImage: "", email: "test@test.com" },
};

export const MOCK_KAKAO_COORD2ADDRESS = {
  documents: [
    {
      address: {
        address_name: "서울특별시 중구 명동2가 1",
        region_2depth_name: "중구",
        region_3depth_name: "명동2가",
      },
      road_address: {
        address_name: "서울특별시 중구 명동길 14",
        region_3depth_name: "명동",
      },
    },
  ],
  meta: { total_count: 1 },
};

export const MOCK_MARKER = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: [],
};

export const MOCK_RECENT_FOUND_EMPTY = {
  isSuccess: true,
  code: "200",
  message: "OK",
  result: [],
};
