import { KeyCodes } from "../key.enum";
import { FormulizeKeyHelper } from "../key.helper";
import { expect, describe, it } from "vitest";

// thanks https://github.com/jsdom/jsdom/issues/3325#issuecomment-1031024183
Object.defineProperties(navigator, {
  userAgent: { value: "foo", writable: true },
});

describe("test class: FormulizeKeyHelper", () => {
  describe("test method: isReload", () => {
    it.each([
      [false, "Mac OS X"],
      [true, "Windows"],
    ])("should return %s with F5 on %s", (result, platform) => {
      global.navigator.userAgent = platform;
      expect(FormulizeKeyHelper.isReload("F5", false)).toBe(result);
    });

    it.each([
      [false, "Mac OS X"],
      [true, "Windows"],
    ])("should return %s with R and control on %s", (result, platform) => {
      global.navigator.userAgent = platform;
      expect(FormulizeKeyHelper.isReload("r", true)).toBe(result);
    });

    it.each([
      [true, "Mac OS X"],
      [false, "Windows"],
    ])("should return %s with R, meta, and shift on %s", (result, platform) => {
      global.navigator.userAgent = platform;
      expect(FormulizeKeyHelper.isReload("r", false, true, true)).toBe(result);
    });
  });

  describe("test method: isSelectAll", () => {
    it.each([
      [false, "Mac OS X"],
      [true, "Windows"],
    ])("should return %s with control + a on %s", (result, platform) => {
      global.navigator.userAgent = platform;
      expect(FormulizeKeyHelper.isSelectAll("a", true)).toBe(result);
    });

    it.each([
      [true, "Mac OS X"],
      [false, "Windows"],
    ])("should return %s with command + a on %s", (result, platform) => {
      global.navigator.userAgent = platform;
      expect(FormulizeKeyHelper.isSelectAll("a", false, false, true)).toBe(
        result,
      );
    });
  });

  describe.only("test method: getValue", () => {
    it.each([
      [KeyCodes.Asterik, false, "x"],
      [KeyCodes.PlusMinus, true, "+"],
      [KeyCodes.Equals, true, "+"],
      [KeyCodes.Plus, false, "+"],
      [KeyCodes.Subtract, false, "-"],
      [KeyCodes.Subtract, false, "-"],
      [KeyCodes.LongMinus, false, "-"],
      [KeyCodes.LongMinus, true, "-"],
      [KeyCodes.Period, false, "."],
      [KeyCodes.Divide, false, "/"],
      [KeyCodes.DivideAlt, false, "/"],
      ["0", false, "0"],
      ["6", false, "6"],
      ["%", true, "%"],
      ["%", false, "%"],
      ["(", true, "("],
      ["(", false, "("],
      ["5", true, "%"],
      ["[", false, undefined],
      ["[", true, undefined],
    ])("%s with shift set to %s should be %s", (key, shift, result) => {
      expect(FormulizeKeyHelper.getValue(key, shift)).toBe(result);
    });
  });
});
