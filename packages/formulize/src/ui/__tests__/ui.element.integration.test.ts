import { describe, it, expect } from "vitest";
import $ from "jquery";
import { UIElementHelper } from "../ui.element.helper";

async function waitForReady() {
  await new Promise((resolve) => {
    $(resolve);
  });
}

describe("UIElementHelper validation", () => {
  describe("createElement", () => {
    it.each([
      ["div", { class: ["test"] }, undefined, '<div class="test"></div>'],
      [
        "div",
        { class: ["test"], "data-testid": "123" },
        undefined,
        '<div class="test" data-testid="123"></div>',
      ],
      [
        "span",
        { class: ["test"] },
        "testing",
        '<span class="test">testing</span>',
      ],
    ] as [
      keyof HTMLElementTagNameMap,
      Record<string, any> & { class: string[] },
      string,
      string,
    ][])(
      "should match %s in vanilla JS and jQuery",
      async (element, attrs, text, expected) => {
        const { class: classes, ...rest } = attrs;
        await waitForReady();

        const elem = UIElementHelper.createElement(
          element,
          classes,
          rest,
          text,
        );

        const $elem = $(`<${element} />`)
          .addClass(classes)
          .text(text)
          .attr(rest);

        expect(elem.outerHTML).toBe(expected);
        expect($elem[0].outerHTML).toBe(expected);
      },
    );
  });

  describe("index", () => {
    it("should get the index of the element with respect to its parent", async () => {
      await waitForReady();

      const $parent = $("<div />");
      const $child = $("<div />");
      const $other = $("<div />");

      $parent.append($("<div />"));
      $parent.append($child);
      $parent.append($("<div />"));
      $parent.append($other);

      expect($child.index()).toBe(1);
      expect($other.index()).toBe(3);
      expect(UIElementHelper.index($child[0])).toBe(1);
      expect(UIElementHelper.index($other[0])).toBe(3);
    });
  });

  describe("prevAll", () => {
    it("should get all the previous siblings of the element", async () => {
      await waitForReady();

      const $parent = $("<div />");
      const $child = $("<div />");
      const $other = $("<div />");

      $parent.append($("<div />"));
      $parent.append($child);
      $parent.append($("<div />"));
      $parent.append($other);

      expect($child.prevAll().length).toBe(1);
      expect($other.prevAll().length).toBe(3);
      expect($parent.children().length).toBe(4);
      expect(UIElementHelper.prevAll($child[0]).length).toBe(1);
      expect(UIElementHelper.prevAll($other[0]).length).toBe(3);
    });
  });

  describe("nextAll", () => {
    it("should get all the next siblings of the element", async () => {
      await waitForReady();

      const $parent = $("<div />");
      const $child = $("<div />");
      const $other = $("<div />");

      $parent.append($("<div />"));
      $parent.append($child);
      $parent.append($("<div />"));
      $parent.append($other);

      expect($child.nextAll().length).toBe(2);
      expect($other.nextAll().length).toBe(0);
      expect($parent.children().length).toBe(4);
      expect(UIElementHelper.nextAll($child[0]).length).toBe(2);
      expect(UIElementHelper.nextAll($other[0]).length).toBe(0);
    });
  });

  describe("prependTo", () => {
    it("should prepend the element to the parent", async () => {
      await waitForReady();

      const $parent = $("<div id='parent' />");
      const $child = $("<div id='child' />");
      const $other = $("<div id='other' />");

      $("<div id='one' />").prependTo($parent);
      $child.prependTo($parent);
      $("<div id='two' />").prependTo($parent);
      $other.prependTo($parent);

      expect($parent.children().length).toBe(4);
      expect($parent.children().first().attr("id")).toBe("other");
      expect($parent.children().last().attr("id")).toBe("one");

      const parent = UIElementHelper.createElement("div", ["parent"]);
      UIElementHelper.prependTo(parent, [
        UIElementHelper.createElement("div", undefined, { id: "one" }),
        UIElementHelper.createElement("div", undefined, { id: "child" }),
        UIElementHelper.createElement("div", undefined, { id: "two" }),
        UIElementHelper.createElement("div", undefined, { id: "other" }),
      ]);

      expect(parent.children.length).toBe(4);
      expect(parent.children[0].getAttribute("id")).toBe("other");
      expect(parent.children[3].getAttribute("id")).toBe("one");
    });
  });

  describe("appendTo", () => {
    it("should append the element to the parent", async () => {
      await waitForReady();

      const $parent = $("<div id='parent' />");
      const $child = $("<div id='child' />");
      const $other = $("<div id='other' />");

      $("<div id='one' />").appendTo($parent);
      $child.appendTo($parent);
      $("<div id='two' />").appendTo($parent);
      $other.appendTo($parent);

      expect($parent.children().length).toBe(4);
      expect($parent.children().first().attr("id")).toBe("one");
      expect($parent.children().last().attr("id")).toBe("other");

      const parent = UIElementHelper.createElement("div", ["parent"]);
      UIElementHelper.appendTo(parent, [
        UIElementHelper.createElement("div", undefined, { id: "one" }),
        UIElementHelper.createElement("div", undefined, { id: "child" }),
        UIElementHelper.createElement("div", undefined, { id: "two" }),
        UIElementHelper.createElement("div", undefined, { id: "other" }),
      ]);

      expect(parent.children.length).toBe(4);
      expect(parent.children[0].getAttribute("id")).toBe("one");
      expect(parent.children[3].getAttribute("id")).toBe("other");
    });
  });

  describe("insertBefore", () => {
    it("should insert the element before the target", async () => {
      await waitForReady();

      const $parent = $("<div id='parent' />");
      const $one = $("<div id='one' />");
      const $two = $("<div id='two' />");
      const $child = $("<div id='child' />");
      const $other = $("<div id='other' />");

      $one.appendTo($parent);
      $child.appendTo($parent);
      $two.appendTo($parent);
      $other.appendTo($parent);

      const $new = $("<div id='new' />");
      $new.insertBefore($child);

      expect($parent.children().length).toBe(5);
      expect($parent.children().first().attr("id")).toBe("one");
      expect($parent.children().last().attr("id")).toBe("other");
      expect($parent.children().eq(1).attr("id")).toBe("new");

      const parent = UIElementHelper.createElement("div", ["parent"]);
      UIElementHelper.appendTo(parent, [
        UIElementHelper.createElement("div", undefined, { id: "one" }),
        UIElementHelper.createElement("div", undefined, { id: "child" }),
        UIElementHelper.createElement("div", undefined, { id: "two" }),
        UIElementHelper.createElement("div", undefined, { id: "other" }),
      ]);

      const newElem = UIElementHelper.createElement("div", undefined, {
        id: "new",
      });

      UIElementHelper.insertBefore(newElem, parent.children[1] as HTMLElement);

      expect(parent.children.length).toBe(5);
      expect(parent.children[0].getAttribute("id")).toBe("one");
      expect(parent.children[4].getAttribute("id")).toBe("other");
      expect(parent.children[1].getAttribute("id")).toBe("new");
    });
  });

  describe("insertAfter", () => {
    it("should insert the element after the target", async () => {
      await waitForReady();

      const $parent = $("<div id='parent' />");
      const $child = $("<div id='child' />");
      const $other = $("<div id='other' />");

      $("<div id='one' />").appendTo($parent);
      $child.appendTo($parent);
      $("<div id='two' />").appendTo($parent);
      $other.appendTo($parent);

      const $new = $("<div id='new' />");
      $new.insertAfter($child);

      expect($parent.children().length).toBe(5);
      expect($parent.children().first().attr("id")).toBe("one");
      expect($parent.children().last().attr("id")).toBe("other");
      expect($parent.children().eq(2).attr("id")).toBe("new");

      const parent = UIElementHelper.createElement("div", ["parent"]);
      UIElementHelper.appendTo(parent, [
        UIElementHelper.createElement("div", undefined, { id: "one" }),
        UIElementHelper.createElement("div", undefined, { id: "child" }),
        UIElementHelper.createElement("div", undefined, { id: "two" }),
        UIElementHelper.createElement("div", undefined, { id: "other" }),
      ]);

      const newElem = UIElementHelper.createElement("div", undefined, {
        id: "new",
      });

      UIElementHelper.insertAfter(newElem, parent.children[1] as HTMLElement);

      expect(parent.children.length).toBe(5);
      expect(parent.children[0].getAttribute("id")).toBe("one");
      expect(parent.children[4].getAttribute("id")).toBe("other");
      expect(parent.children[2].getAttribute("id")).toBe("new");
    });
  });
});
