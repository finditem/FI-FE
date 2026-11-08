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
