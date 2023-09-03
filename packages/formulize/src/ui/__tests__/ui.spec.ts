import { expect, describe, it, afterEach } from "vitest";
import { UI } from "../ui";
import { UIElementHelper } from "../ui.element.helper";

describe("test class: UI", () => {
  const elem = UIElementHelper.createElement("div");

  afterEach(() => {
    elem.innerHTML = "";
  });

  describe("test method: new UI()", () => {
    it("should expected to work without exception", () => {
      expect(() => new UI(elem)).not.toThrow();
    });
  });

  describe("test method: setData()", () => {
    it("should not throw an error", () => {
      const ui = new UI(elem);

      const data = {
        operator: "+",
        operand1: {
          operator: "+",
          operand1: { value: { type: "unit", unit: 1 } },
          operand2: { value: { type: "unit", unit: 2 } },
        },
        operand2: { value: { type: "unit", unit: 3 } },
      };

      expect(() => ui.setData(data)).not.toThrow();
    });
  });

  describe("test method: getData()", () => {
    it("should returns correct data with 1 + 2 + 3", () => {
      const ui = new UI(elem);

      const data = {
        operator: "+",
        operand1: {
          operator: "+",
          operand1: { value: { type: "unit", unit: 1 } },
          operand2: { value: { type: "unit", unit: 2 } },
        },
        operand2: { value: { type: "unit", unit: 3 } },
      };

      ui.setData(data);
      expect(ui.getData()).toEqual(data);
    });
  });

  describe("test method: selectAll()", () => {
    it("should 5 items are dragged", () => {
      const ui = new UI(elem);

      const data = {
        operator: "+",
        operand1: {
          operator: "+",
          operand1: { value: { type: "unit", unit: 1 } },
          operand2: { value: { type: "unit", unit: 2 } },
        },
        operand2: { value: { type: "unit", unit: 3 } },
      };

      ui.setData(data);
      ui.selectAll();

      const selectedItems = elem.querySelectorAll(
        `.${ui.options.id}-drag .${ui.options.id}-item`,
      );

      expect(selectedItems).toHaveLength(5);
    });
  });

  describe("test method: removeDrag()", () => {
    it("should 0 items are dragged", () => {
      const ui = new UI(elem);

      const data = {
        operator: "+",
        operand1: {
          operator: "+",
          operand1: { value: { type: "unit", unit: 1 } },
          operand2: { value: { type: "unit", unit: 2 } },
        },
        operand2: { value: { type: "unit", unit: 3 } },
      };

      ui.setData(data);
      ui.selectAll();
      ui.removeDrag();

      const items = elem.querySelectorAll(`.${ui.options.id}-item`);
      const selectedItems = elem.querySelectorAll(
        `.${ui.options.id}-drag .${ui.options.id}-item`,
      );

      expect(items).toHaveLength(5);
      expect(selectedItems).toHaveLength(0);
    });
  });

  describe("test method: blur()", () => {
    it("should cursor must be removed after blur()", () => {
      const ui = new UI(elem);
      const data = {
        operator: "+",
        operand1: {
          operator: "+",
          operand1: { value: { type: "unit", unit: 1 } },
          operand2: { value: { type: "unit", unit: 2 } },
        },
        operand2: { value: { type: "unit", unit: 3 } },
      };

      const { x, y } = elem.getBoundingClientRect();

      ui.setData(data);
      ui.pick({
        x,
        y,
      });

      const cursor = elem.querySelectorAll(`.${ui.options.id}-cursor`);
      expect(cursor).toHaveLength(1);

      ui.blur();
      const afterBlurCursor = elem.querySelectorAll(`.${ui.options.id}-cursor`);
      expect(afterBlurCursor).toHaveLength(0);
    });
  });

  describe("test option: input()", () => {
    it("should returns 1 + 2 + 3 with input() function", () => {
      let streamIndex = 0;
      const data = {
        operator: "+",
        operand1: {
          operator: "+",
          operand1: { value: { type: "unit", unit: 1 } },
          operand2: { value: { type: "unit", unit: 2 } },
        },
        operand2: { value: { type: "unit", unit: 3 } },
      };

      const ui = new UI(elem, {
        input: (value) => {
          streamIndex += 1;
          if (streamIndex < 6) {
            return;
          }

          expect(value).toEqual(data);
        },
      });

      ui.setData(data);
    });

    it.skip("should returns 1 + 2 + 3 with on(`input`) function", () => {
      const ui = new UI(elem);
      const data = {
        operator: "+",
        operand1: {
          operator: "+",
          operand1: { value: { type: "unit", unit: 1 } },
          operand2: { value: { type: "unit", unit: 2 } },
        },
        operand2: { value: { type: "unit", unit: 3 } },
      };

      let streamIndex = 0;

      elem.addEventListener("input", (e) => {
        streamIndex += 1;
        if (streamIndex < 6) {
          return;
        }

        expect(e).toEqual(data);
      });

      ui.setData(data);
    });
  });
});
