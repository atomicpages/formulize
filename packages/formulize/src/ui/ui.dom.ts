import type { FormulizeOptions } from "../formulize.interface";
import type { Nullable } from "../types";
import { UIElementHelper } from "./ui.element.helper";

const statusBaseClasses = ["good", "error"];

export abstract class UIDom {
  public options: Readonly<Required<FormulizeOptions>>;
  protected wrapper: HTMLElement;
  protected container: HTMLDivElement;
  protected statusBox: HTMLDivElement;
  protected textBox: HTMLTextAreaElement;
  protected cursor: HTMLDivElement;
  protected elem: HTMLElement;
  private initialized = false;

  protected analyzeKey(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    control?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shift?: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    meta?: boolean,
  ): void {
    throw new Error("method not implemented");
  }

  protected get cursorIndex(): number {
    return this.cursor ? UIElementHelper.index(this.cursor) : 0;
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

    UIElementHelper.appendTo(this.wrapper, this.container);

    this.statusBox = UIElementHelper.createElement("div", [
      `${this.options.id}-alert`,
    ]);

    UIElementHelper.insertBefore(this.statusBox, this.container);

    this.textBox = UIElementHelper.createTextBoxElement(this.options.id);
    UIElementHelper.insertAfter(this.textBox, this.container);
    this.textBox.focus();
    this.initialized = true;
  }

  protected bindingDOM() {
    this.wrapper ??= this.elem;

    this.container ??= this.wrapper.querySelector(
      `.${this.options.id}-container`,
    )!;

    this.statusBox ??= this.wrapper.querySelector(`.${this.options.id}-alert`)!;
    this.textBox ??= this.wrapper.querySelector(`.${this.options.id}-text`)!;
  }

  protected isAlreadyInitialized(): boolean {
    return this.initialized;
  }

  protected attachEvents() {
    throw new Error("method not implemented");
  }

  protected getPrevUnit(elem: HTMLElement): Nullable<Element> {
    const prevElement = elem.previousElementSibling as Nullable<HTMLElement>;

    if (prevElement) {
      return UIElementHelper.isCursor(this.options.id, prevElement)
        ? prevElement?.previousElementSibling
        : prevElement;
    }

    return null;
  }

  protected getNextUnit(elem: HTMLElement): Nullable<Element> {
    const nextElem = elem.nextElementSibling as Nullable<HTMLElement>;

    if (nextElem) {
      const isCursor = UIElementHelper.isCursor(this.options.id, nextElem);
      return isCursor ? nextElem.nextElementSibling : nextElem;
    }

    return null;
  }

  protected mergeUnit(baseElem: HTMLElement): void {
    const prevElem = this.getPrevUnit(baseElem);
    const nextElem = this.getNextUnit(baseElem);

    const unitElem = [prevElem, nextElem].find((elem) => {
      if (elem) {
        return UIElementHelper.isUnit(this.options.id, elem as HTMLElement);
      }

      return null;
    });

    if (!unitElem) {
      return;
    }

    if (unitElem === prevElem) {
      baseElem.prepend(prevElem);
      baseElem.insertAdjacentElement("afterend", this.cursor);
    } else if (unitElem === nextElem) {
      baseElem.append(nextElem);
      baseElem.insertAdjacentElement("beforebegin", this.cursor);
    }

    const text = baseElem.textContent ?? "";
    UIElementHelper.setUnitValue(this.options.id, baseElem, text);
  }

  protected removeCursor(): void {
    this.container.querySelector(`.${this.options.id}-cursor`)?.remove();
  }

  protected removeUnit(): void {
    this.container.querySelector(`:not(.${this.options.id}-cursor)`)?.remove();
  }

  protected updateStatus(valid = false): void {
    const statusText = valid ? this.options.text.pass : this.options.text.error;

    const statusClasses = valid
      ? statusBaseClasses
      : statusBaseClasses.reverse();

    this.statusBox.textContent = statusText ?? "";

    this.statusBox.classList.add(
      `${this.options.id}-alert-${statusClasses[0]}`,
    );

    this.statusBox.classList.remove(
      `${this.options.id}-alert-${statusClasses[1]}`,
    );
  }
}
