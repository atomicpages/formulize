import type { Nullable } from "vitest";
import { FormulizeTokenHelper } from "../token.helper";

// TODO: move to exported functions, class feels too heavy
export class UIElementHelper {
  public static createElement<K extends keyof HTMLElementTagNameMap>(
    name: K,
    classes: string[],
    attrs?: Record<string, string>,
    content?: string,
  ) {
    const elem = document.createElement(name);

    elem.classList.add(...classes);

    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) =>
        elem.setAttribute(key, value),
      );
    }

    if (content) {
      elem.textContent = content;
    }

    return elem;
  }

  /**
   * Get the index of the element in its parent. This behaves
   * like jQuery's `index` method.
   * @param elem The element to find.
   * @example
   * UIElementHelper.index(this.cursor) // 2
   */
  public static index<E extends Element = HTMLElement>(
    elem?: Nullable<E>,
  ): number {
    if (elem) {
      const parent = elem.parentElement;

      if (parent) {
        for (let i = 0; i < parent.children.length; i++) {
          if (parent.children.item(i) === elem) {
            return i;
          }
        }
      }
    }

    return -1;
  }

  /**
   * Like jQuery's `prevAll` method, this returns all the previous
   * @param element the element to start from
   */
  public static prevAll(element?: Nullable<HTMLElement>): HTMLElement[] {
    const siblings: HTMLElement[] = [];

    if (!element) {
      return siblings;
    }

    let prevSibling = element.previousSibling;

    while (prevSibling) {
      if (prevSibling.nodeType === 1) {
        siblings.push(prevSibling as HTMLElement);
      }

      prevSibling = prevSibling.previousSibling;
    }

    return siblings;
  }

  public static nextAll(element?: Nullable<HTMLElement>): HTMLElement[] {
    const siblings: HTMLElement[] = [];

    if (!element) {
      return siblings;
    }

    let nextSibling = element.nextSibling;

    while (nextSibling) {
      if (nextSibling.nodeType === 1) {
        siblings.push(nextSibling as HTMLElement);
      }

      nextSibling = nextSibling.nextSibling;
    }

    return siblings;
  }

  /**
   * Like jQuery's `prependTo` method this prepends any
   * and all elements to the target as children of target.
   * @param target
   * @param elements
   */
  public static prependTo(
    target: Element,
    elements?: Nullable<NodeList | Element | Element[]>,
  ) {
    if (!elements) {
      return;
    }

    if (elements instanceof NodeList) {
      elements = Array.from(elements) as Element[];
    }

    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    for (let i = elements.length - 1; i >= 0; i--) {
      // eslint-disable-next-line security/detect-object-injection
      target.insertBefore(elements[i], target.firstChild);
    }
  }

  /**
   * Like jQuery's `appendTo` method this append any
   * and all elements to the target as children of target.
   * @param target
   * @param elements
   */
  public static appendTo(
    target: Element,
    elements?: Nullable<NodeList | Element | Element[]>,
  ) {
    if (!elements) {
      return;
    }

    if (elements instanceof NodeList) {
      elements = Array.from(elements) as Element[];
    }

    if (!Array.isArray(elements)) {
      elements = [elements];
    }

    for (const element of elements) {
      target.appendChild(element);
    }
  }

  public static insertBefore(newElement: Element, target: Element) {
    target.parentNode?.insertBefore(newElement, target);
  }

  public static insertAfter(newElement: HTMLElement, target: HTMLElement) {
    const parent = target.parentNode;

    if (parent) {
      if (parent.lastChild === target) {
        parent.appendChild(newElement);
      } else {
        parent.insertBefore(newElement, target.nextSibling);
      }
    }
  }

  public static createDragElement(id: string) {
    return this.createElement("div", [`${id}-drag`]);
  }

  public static createCursorElement(id: string) {
    return this.createElement("div", [`${id}-cursor`]);
  }

  public static createUnitElement(id: string, value?: string): HTMLElement {
    const unitElem = this.createElement("div", [`${id}-item`, `${id}-unit`]);

    this.setUnitValue(id, unitElem, value);

    return unitElem;
  }

  public static createUnitDecimalElement(
    id: string,
    side: "prefix" | "suffix",
    value?: string,
  ) {
    return this.createElement(
      "span",
      [`${id}-${side}`, `${id}-decimal-highlight`],
      undefined,
      value,
    );
  }

  public static createOperatorElement(id: string, value?: string) {
    return this.createElement(
      "div",
      [`${id}-item`, `${id}-operator`],
      undefined,
      (value ?? "").toLowerCase(),
    );
  }

  public static createTextBoxElement(id: string) {
    return this.createElement("textarea", [`${id}-text`], {
      id: `${id}-text`,
      name: `${id}-text`,
    });
  }

  public static setUnitValue(
    id: string,
    elem: HTMLElement,
    value?: string,
  ): void {
    if (value === undefined) {
      return;
    }

    // reset content of element
    elem.innerHTML = "";

    const decimalValue = FormulizeTokenHelper.toDecimal(value);
    const [left, right] = decimalValue.split(".");

    if (left !== undefined) {
      const prefix = this.createUnitDecimalElement(id, "prefix", left);
      elem.appendChild(prefix);
    }

    if (right !== undefined) {
      const suffix = this.createUnitDecimalElement(id, "suffix", `.${right}`);
      elem.appendChild(suffix);
    }
  }

  public static isElementType(
    id: string,
    type: string,
    elem?: Nullable<HTMLElement>,
  ): boolean {
    return Boolean(elem?.classList.contains(`${id}-${type}`));
  }

  public static isDrag(id: string, elem?: Nullable<HTMLElement>): boolean {
    return this.isElementType(id, "drag", elem);
  }

  public static isCursor(id: string, elem: HTMLElement): boolean {
    return this.isElementType(id, "cursor", elem);
  }

  public static isUnit(id: string, elem: HTMLElement): boolean {
    return this.isElementType(id, "unit", elem);
  }

  public static isOperator(id: string, elem: HTMLElement): boolean {
    return this.isElementType(id, "operator", elem);
  }
}
