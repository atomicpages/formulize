import { expect, describe, it, beforeEach } from "vitest";
import { UIElementHelper } from "../ui.element.helper";

describe("test class: UIElementHelper", () => {
  const id = "formulize";

  describe("test method: UIElementHelper.createElement()", () => {
    it("should create elements", () => {
      const el = UIElementHelper.createElement(
        "div",
        ["a", "b"],
        {
          "data-testid": "foo",
        },
        "<p>Bar</p>",
      );

      expect(el.classList.contains("a")).toBeTruthy();
      expect(el.classList.contains("b")).toBeTruthy();
      expect(el.classList.contains("c")).toBeFalsy();
      expect(el.getAttribute("data-testid")).toBe("foo");
      expect(el.textContent).toBe("<p>Bar</p>");
    });
  });

  describe("test method: UIElementHelper.createDragElement()", () => {
    it("should return a valid HTMLElement", () => {
      const elem = UIElementHelper.createDragElement(id);
      expect(elem.classList.contains(`${id}-drag`)).toBeTruthy();
    });
  });

  describe("test method: UIElementHelper.prevAll()", () => {
    it("should get all previous elements of the specified element", () => {
      const parent = document.createElement("div");
      parent.innerHTML = `<ul>
      <li class="a">a</li>
      <li class="b">b</li>
      <li class="c">c</li>
      <li class="d">d</li>
      <li class="e">e</li>
      </ul>`;

      expect(UIElementHelper.prevAll(parent.querySelector(".b")!)).toHaveLength(
        1,
      );

      expect(UIElementHelper.prevAll(parent.querySelector(".e")!)).toHaveLength(
        4,
      );

      expect(UIElementHelper.prevAll(parent.querySelector(".a")!)).toHaveLength(
        0,
      );
    });
  });

  describe("test method: UIElementHelper.index()", () => {
    it("should get the index of the specified element", () => {
      const parent = document.createElement("div");

      parent.innerHTML = `<ul>
      <li class="a">a</li>
      <li class="b">b</li>
      <li class="c">c</li>
      <li class="d">d</li>
      <li class="e">e</li>
      </ul>`;

      expect(UIElementHelper.index(parent.querySelector(".b"))).toBe(1);
      expect(UIElementHelper.index(parent.querySelector(".d"))).toBe(3);
      expect(UIElementHelper.index(parent.querySelector(".f"))).toBe(-1);
    });
  });

  describe("test method: UIElementHelper.createCursorElement()", () => {
    it("should return a valid HTMLElement", () => {
      const elem = UIElementHelper.createCursorElement(id);
      expect(elem.classList.contains(`${id}-cursor`)).toBeTruthy();
    });
  });

  describe("test method: UIElementHelper.createUnitElement()", () => {
    it("should return an HTMLElement contained an empty child with empty value", () => {
      const elem = UIElementHelper.createUnitElement(id, undefined);

      expect(elem.classList.contains(`${id}-item`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-unit`)).toBeTruthy();
      expect(elem.children).toHaveLength(0);
    });

    it("should return an HTMLElement contained an child what contained empty child with +", () => {
      const elem = UIElementHelper.createUnitElement(id, "+");

      expect(elem.classList.contains(`${id}-item`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-unit`)).toBeTruthy();
      expect(elem.children).toHaveLength(1);

      expect(elem.children[0].classList.contains(`${id}-prefix`)).toBeTruthy();

      expect(
        elem.children[0].classList.contains(`${id}-decimal-highlight`),
      ).toBeTruthy();

      expect(elem.children[0].textContent).toBe("");
    });

    it("should return an HTMLElement contained a prefix child child with 1", () => {
      const elem = UIElementHelper.createUnitElement(id, "1");

      expect(elem.classList.contains(`${id}-item`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-unit`)).toBeTruthy();
      expect(elem.children).toHaveLength(1);

      expect(elem.children[0].classList.contains(`${id}-prefix`)).toBeTruthy();

      expect(
        elem.children[0].classList.contains(`${id}-decimal-highlight`),
      ).toBeTruthy();

      expect(elem.children[0].textContent).toBe("1");
    });

    it("should return an HTMLElement contained a prefix child child with 1000", () => {
      const elem = UIElementHelper.createUnitElement(id, "1000");

      expect(elem.classList.contains(`${id}-item`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-unit`)).toBeTruthy();
      expect(elem.children).toHaveLength(1);

      expect(elem.children[0].classList.contains(`${id}-prefix`)).toBeTruthy();

      expect(
        elem.children[0].classList.contains(`${id}-decimal-highlight`),
      ).toBeTruthy();

      expect(elem.children[0].textContent).toBe("1,000");
    });

    it("should return an HTMLElement contained a prefix child child with 1000.1", () => {
      const elem = UIElementHelper.createUnitElement(id, "1000.1");

      expect(elem.classList.contains(`${id}-item`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-unit`)).toBeTruthy();
      expect(elem.children).toHaveLength(2);

      expect(elem.children[0].classList.contains(`${id}-prefix`)).toBeTruthy();

      expect(
        elem.children[0].classList.contains(`${id}-decimal-highlight`),
      ).toBeTruthy();

      expect(elem.children[0].textContent).toBe("1,000");
      expect(elem.children[1].classList.contains(`${id}-suffix`)).toBeTruthy();

      expect(
        elem.children[1].classList.contains(`${id}-decimal-highlight`),
      ).toBeTruthy();

      expect(elem.children[1].textContent).toBe(".1");
    });
  });

  describe("test method: UIElementHelper.createUnitDecimalElement()", () => {
    it("should return a valid HTMLElement with empty value", () => {
      const elem = UIElementHelper.createUnitDecimalElement(id, "prefix");

      expect(elem.classList.contains(`${id}-prefix`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-decimal-highlight`)).toBeTruthy();
      expect(elem.textContent).toBe("");
    });

    it("should return a valid HTMLElement with prefix side and value 1", () => {
      const elem = UIElementHelper.createUnitDecimalElement(id, "prefix", "1");
      expect(elem.classList.contains(`${id}-prefix`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-decimal-highlight`)).toBeTruthy();
      expect(elem.textContent).toBe("1");
    });

    it("should return a valid HTMLElement with suffix side and value 1", () => {
      const elem = UIElementHelper.createUnitDecimalElement(id, "suffix", "1");
      expect(elem.classList.contains(`${id}-suffix`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-decimal-highlight`)).toBeTruthy();
      expect(elem.textContent).toBe("1");
    });
  });

  describe("test method: UIElementHelper.createOperatorElement()", () => {
    it("should return a valid HTMLElement with undefined", () => {
      const elem = UIElementHelper.createOperatorElement(id, undefined);
      expect(elem.classList.contains(`${id}-item`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-operator`)).toBeTruthy();
      expect(elem.textContent).toBe("");
    });

    it("should return a valid HTMLElement with +", () => {
      const elem = UIElementHelper.createOperatorElement(id, "+");
      expect(elem.classList.contains(`${id}-item`)).toBeTruthy();
      expect(elem.classList.contains(`${id}-operator`)).toBeTruthy();
      expect(elem.textContent).toBe("+");
    });
  });

  describe("test method: UIElementHelper.createTextBoxElement()", () => {
    it("should return a valid HTMLElement", () => {
      const elem = UIElementHelper.createTextBoxElement(id);
      expect(elem.id).toBe(`${id}-text`);
      expect(elem.getAttribute("name")).toBe(`${id}-text`);
      expect(elem.classList.contains(`${id}-text`)).toBeTruthy();
      expect(elem.children).toHaveLength(0);
    });
  });

  describe("test method: UIElementHelper.setUnitValue()", () => {
    let elem: HTMLElement;

    beforeEach(() => {
      elem = document.createElement("div");
    });

    it("should have no children when the value is undefined", () => {
      UIElementHelper.setUnitValue(id, elem, undefined);
      expect(elem.children).toHaveLength(0);
    });

    it.each([
      ["a", "", 1],
      ["100", "100", 1],
      ["6000000", "6,000,000", 1],
      ["100000.02140", "100,000.02140", 2],
    ] as [string, string, number][])(
      "should format %s as %s",
      (value, content, length) => {
        UIElementHelper.setUnitValue(id, elem, value);
        expect(elem.children).toHaveLength(length);

        expect(
          elem.children[0].classList.contains(`${id}-prefix`),
        ).toBeTruthy();

        expect(
          elem.children[0].classList.contains(`${id}-decimal-highlight`),
        ).toBeTruthy();

        expect(elem.textContent).toBe(content);
      },
    );
  });

  describe("test method: UIElementHelper.isElementType()", () => {
    let elem: HTMLElement;

    beforeEach(() => {
      elem = document.createElement("div");
    });

    it("should return false with elem undefined", () => {
      expect(
        UIElementHelper.isElementType(id, "some-type", undefined),
      ).toBeFalsy();
    });

    it("should return true with matched type apple", () => {
      elem.classList.add(`${id}-apple`);
      expect(UIElementHelper.isElementType(id, "apple", elem)).toBeTruthy();
    });

    it("should return false with unmatched type apple", () => {
      elem.classList.add(`${id}-banana`);
      expect(UIElementHelper.isElementType(id, "apple", elem)).toBeFalsy();
    });
  });

  describe("test method: UIElementHelper.isDrag()", () => {
    let elem: HTMLElement;

    beforeEach(() => {
      elem = document.createElement("div");
    });

    it.each([
      [`${id}-drag`, true],
      [`${id}-apple`, false],
    ])("UIElementHelper.isDrag('%s') === %s", (cls, result) => {
      elem.classList.add(cls);
      expect(UIElementHelper.isDrag(id, elem)).toBe(result);
    });
  });

  describe("test method: UIElementHelper.isCursor()", () => {
    let elem: HTMLElement;

    beforeEach(() => {
      elem = document.createElement("div");
    });

    it.each([
      [`${id}-cursor`, true],
      [`${id}-apple`, false],
    ])("UIElementHelper.isCursor('%s') === %s", (cls, result) => {
      elem.classList.add(cls);
      expect(UIElementHelper.isCursor(id, elem)).toBe(result);
    });
  });

  describe("test method: UIElementHelper.isUnit()", () => {
    let elem: HTMLElement;

    beforeEach(() => {
      elem = document.createElement("div");
    });

    it.each([
      [`${id}-unit`, true],
      [`${id}-apple`, false],
    ])("UIElementHelper.isUnit('%s') === %s", (cls, result) => {
      elem.classList.add(cls);
      expect(UIElementHelper.isUnit(id, elem)).toBe(result);
    });
  });

  describe("test method: UIElementHelper.isOperator()", () => {
    let elem: HTMLElement;

    beforeEach(() => {
      elem = document.createElement("div");
    });

    it.each([
      [`${id}-operator`, true],
      [`${id}-apple`, false],
    ])("UIElementHelper.isOperator('%s') === %s", (cls, result) => {
      elem.classList.add(cls);
      expect(UIElementHelper.isOperator(id, elem)).toBe(result);
    });
  });
});
