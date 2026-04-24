import { VAPID_PUBLIC_KEY_STRING_MIN_LENGTH_HEURISTIC } from "../webPushConstants/webPushConstants";
import { pickVapidPublicKey } from "./pickVapidPublicKey";

describe("pickVapidPublicKey", () => {
  it("publicKey 후보 필드를 우선한다", () => {
    expect(pickVapidPublicKey({ publicKey: "pk", other: "x" })).toBe("pk");
  });

  it("public_key 필드를 사용한다", () => {
    expect(pickVapidPublicKey({ public_key: "a", vapidPublicKey: "b" })).toBe("a");
  });

  it("필드명이 없으면 충분히 긴 값을 고른다", () => {
    const long = "x".repeat(VAPID_PUBLIC_KEY_STRING_MIN_LENGTH_HEURISTIC);
    expect(pickVapidPublicKey({ foo: long })).toBe(long);
  });

  it("키를 찾지 못하면 예외다", () => {
    expect(() => pickVapidPublicKey({})).toThrow("VAPID public key not found");
  });
});
