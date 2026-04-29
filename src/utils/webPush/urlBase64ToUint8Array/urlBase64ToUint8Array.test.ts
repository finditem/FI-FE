import { urlBase64ToUint8Array } from "./urlBase64ToUint8Array";

describe("urlBase64ToUint8Array", () => {
  it("표준 Base64와 동일한 바이트를 만든다", () => {
    const input = btoa("hello");
    const out = urlBase64ToUint8Array(input);
    expect(Array.from(out)).toEqual([104, 101, 108, 108, 111]);
  });

  it("URL-safe 문자(-_)를 처리한다", () => {
    const standard = btoa(String.fromCharCode(251, 252));
    const urlSafe = standard.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const out = urlBase64ToUint8Array(urlSafe);
    expect(Array.from(out)).toEqual([251, 252]);
  });
});
