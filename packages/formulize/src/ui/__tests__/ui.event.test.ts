import { UIEvent } from "../ui.event";
import { describe, it, expect, vi } from "vitest";

describe("ui.event", () => {
  it("should register and unregister events", () => {
    const el = document.createElement("div");
    const click = vi.fn();

    UIEvent.on(el, "click", click);
    UIEvent.on(el, "click", click);
    el.click();
    expect(click).toHaveBeenCalled();

    el.click();
    el.click();
    el.click();
    expect(click).toHaveBeenCalledTimes(4);

    UIEvent.off(el, "click", click);
    el.click();
    expect(click).toHaveBeenCalledTimes(4);
  });

  it("should unregister all of the event type if no handler is defined", () => {
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");

    const click1 = vi.fn();
    const click2 = vi.fn();

    UIEvent.on(el1, "click", click1);
    UIEvent.on(el1, "click", click2);
    UIEvent.on(el2, "click", click1);

    el1.click();
    el2.click();
    expect(click1).toHaveBeenCalledTimes(2);
    expect(click2).toHaveBeenCalledTimes(1);

    UIEvent.off(el1, "click");
    el1.click();
    expect(click1).toHaveBeenCalledTimes(2);
    expect(click2).toHaveBeenCalledTimes(1);

    el2.click();
    expect(click1).toHaveBeenCalledTimes(3);
  });
});
