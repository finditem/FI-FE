import { MOCK_ALERT_NOTIFICATION_REVIEW_ITEM } from "@/mock/data";
import { alertRouteUrl } from "./alertRouteUrl";

const {
  resolvePushNotificationPathFromPayload,
} = require("../../../../../../public/normalizePushNotificationUrl");

it("리뷰 참조 ID로 후기 상세 경로를 만든다", () => {
  const notification = MOCK_ALERT_NOTIFICATION_REVIEW_ITEM;
  expect(alertRouteUrl(notification.referenceType, notification.referenceId)).toBe(
    `/mypage/reviews/${notification.referenceId}`
  );
});

it("웹 푸시에서도 REVIEW 참조로 동일한 후기 상세를 연다", () => {
  expect(resolvePushNotificationPathFromPayload(MOCK_ALERT_NOTIFICATION_REVIEW_ITEM)).toBe(
    `/mypage/reviews/${MOCK_ALERT_NOTIFICATION_REVIEW_ITEM.referenceId}`
  );
});
