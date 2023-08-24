import type { FormulizeOptions } from "../formulize.interface";
import type { Nullable } from "../types";
import { UIElementHelper } from "./ui.element.helper";

export abstract class UIDom {
  public options: Readonly<Required<FormulizeOptions>>;
  protected wrapper: HTMLElement;
  protected container: HTMLDivElement;
  protected statusBox: HTMLDivElement;
  protected textBox: HTMLTextAreaElement;
  protected cursor: HTMLDivElement;
  protected elem: HTMLElement;
  private initialized = false;

  protected get cursorIndex(): number {
    return this.cursor ? this.cursor.index() : 0;
  }

  protected get dragElem() {
    return this.container.querySelector(`.${this.options.id}-drag`);
  }

  protected initializeDOM() {
    this.wrapper = this.elem;
    this.wrapper.classList.add(`${this.options.id}-wrapper`);

    this.container = UIElementHelper.createElement("div", [
      `${this.options.id}-container`,
    ]);

    this.statusBox = UIElementHelper.createElement("div", [
      `${this.options.id}-alert`,
    ]);

    this.statusBox.textContent = this.options?.text?.formula ?? "";
    this.container.prepend(this.statusBox);

    this.textBox = UIElementHelper.getTextBoxElement(this.options.id);
    this.container.insertAdjacentElement("afterend", this.textBox);
    this.textBox.focus();
    this.initialized = true;
  }

  protected bindingDOM() {
    this.wrapper = this.elem;

    this.container = this.wrapper.querySelector(
      `.${this.options.id}-container`,
    );

    this.statusBox = this.wrapper.querySelector(`.${this.options.id}-alert`);
    this.textBox = this.wrapper.querySelector(`.${this.options.id}-text`);
  }

  protected isAlreadyInitialized(): boolean {
    if (this.initialized === true) {
      return this.initialized;
    }

    return this.elem.classList.contains(`${this.options.id}-wrapper`);
  }

  protected attachEvents() {
    throw new Error("method not implemented");
  }

  protected getPrevUnit(elem: HTMLElement): Nullable<Element> {
    const prevElement = elem.previousElementSibling as HTMLElement;

    if (prevElement?.children.length === 0) {
      return null;
    }

    return UIElementHelper.isCursor(
      this.options.id,
      prevElement.children.item(0) as HTMLElement,
    )
      ? prevElement.previousElementSibling?.children.item(0)
      : prevElement.children.item(0);
  }

  protected getNextUnit(elem: HTMLElement): HTMLElement {
    const nextElem = elem.nextElementSibling as HTMLElement;
    return UIElementHelper.isCursor(this.options.id, nextElem.get(0))
      ? nextElem.next().get(0)
      : nextElem.get(0);
  }

  protected mergeUnit(baseElem: HTMLElement): void {
    const prevElem = $(this.getPrevUnit(baseElem));
    const nextElem = $(this.getNextUnit(baseElem));

    const unitElem = [prevElem, nextElem].find((elem) =>
      UIElementHelper.isUnit(this.options.id, elem.get(0)),
    );

    if (!unitElem) {
      return;
    }

    if (unitElem === prevElem) {
      prevElem.prependTo(baseElem);
      this.cursor.insertAfter(baseElem);
    } else if (unitElem === nextElem) {
      nextElem.appendTo(baseElem);
      this.cursor.insertBefore(baseElem);
    }

    const text = $(baseElem).text();
    UIElementHelper.setUnitValue(this.options.id, baseElem, text);
  }

  protected removeCursor(): void {
    this.container.find(`.${this.options.id}-cursor`).remove();
  }

  protected removeUnit(): void {
    this.container.find(`:not(".${this.options.id}-cursor")`).remove();
  }

  protected updateStatus(valid = false): void {
    const statusText = valid ? this.options.text.pass : this.options.text.error;

    const statusBaseClasses = ["good", "error"];
    const statusClasses = valid
      ? statusBaseClasses
      : statusBaseClasses.reverse();

    this.statusBox
      .text(statusText)
      .addClass(`${this.options.id}-alert-${statusClasses[0]}`)
      .removeClass(`${this.options.id}-alert-${statusClasses[1]}`);
  }
}
