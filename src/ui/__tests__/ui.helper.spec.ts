import { UIHelper } from "../ui.helper";
import { expect, describe, it } from "vitest";

describe("test method: UIHelper.isOverDistance()", () => {
  it("should return false with diff bigger than 5", () => {
    expect(
      UIHelper.isOverDistance({ x: 1, y: 1 }, { x: 1, y: 4 }, 5),
    ).toBeFalsy();

    expect(
      UIHelper.isOverDistance({ x: -2, y: 0 }, { x: 3, y: 5 }, 5),
    ).toBeFalsy();

    expect(
      UIHelper.isOverDistance({ x: 2, y: 4 }, { x: 0, y: 0 }, 5),
    ).toBeFalsy();
  });
});
