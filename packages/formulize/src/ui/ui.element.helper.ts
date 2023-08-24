import { FormulizeTokenHelper } from "../token.helper";

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

  public static getDragElement(id: string) {
    return this.createElement("div", [`${id}-drag`]);
  }

  public static getCursorElement(id: string) {
    return this.createElement("div", [`${id}-cursor`]);
  }

  public static getUnitElement(id: string, value?: string): HTMLElement {
    const unitElem = this.createElement("div", [`${id}-item`, `${id}-unit`]);

    this.setUnitValue(id, unitElem, value);

    return unitElem;
  }

  public static getUnitDecimalElement(
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

  public static getOperatorElement(id: string, value?: string) {
    return this.createElement(
      "div",
      [`${id}-item`, `${id}-operator`],
      undefined,
      (value ?? "").toLowerCase(),
    );
  }

  public static getTextBoxElement(id: string) {
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
      const prefix = this.getUnitDecimalElement(id, "prefix", left);
      elem.appendChild(prefix);
    }

    if (right !== undefined) {
      const suffix = this.getUnitDecimalElement(id, "suffix", `.${right}`);
      elem.appendChild(suffix);
    }
  }

  public static isElementType(
    id: string,
    type: string,
    elem?: HTMLElement,
  ): boolean {
    return elem ? elem.classList.contains(`${id}-${type}`) : false;
  }

  public static isDrag(id: string, elem: HTMLElement): boolean {
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
