import { describe, it, expect } from "vitest";
import { microToUsd, shortAddr } from "./format";

describe("microToUsd", () => {
  it("converts micro-USDC to dollars", () => {
    expect(microToUsd("1000000")).toBe("$1.00");
    expect(microToUsd("2500000")).toBe("$2.50");
    expect(microToUsd("0")).toBe("$0.00");
  });
  it("handles non-numeric", () => {
    expect(microToUsd("nope")).toBe("—");
  });
});

describe("shortAddr", () => {
  it("truncates long addresses", () => {
    expect(shortAddr("b5219rl4cm2hmr8afy4kldpxz3fka4jguq0avffg09")).toBe("b5219r…fg09");
  });
  it("leaves short strings alone", () => {
    expect(shortAddr("b52short")).toBe("b52short");
  });
});
