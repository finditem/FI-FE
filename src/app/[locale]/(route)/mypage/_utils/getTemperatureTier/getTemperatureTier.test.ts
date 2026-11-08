import { getTemperatureTier } from "./getTemperatureTier";

describe("getTemperatureTier", () => {
  it.each([
    [0, "low"],
    [36.4, "low"],
    [36.5, "first"],
    [36.6, "rising"],
    [50, "rising"],
    [50.1, "good"],
    [69.9, "good"],
    [70, "trusted"],
    [98.9, "trusted"],
    [99, "max"],
  ])("%s도는 %s 구간이다", (temperature, tier) => {
    expect(getTemperatureTier(temperature)).toBe(tier);
  });
});
