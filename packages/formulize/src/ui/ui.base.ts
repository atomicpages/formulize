import { defaultOptions } from "../option.value";
import { UIHook } from "./ui.hook";
import merge from "deepmerge";
import type { FormulizeOptions } from "../formulize.interface";

export abstract class UIBase extends UIHook {
  public constructor(elem: HTMLElement, options: FormulizeOptions = {}) {
    super();
    this.elem = elem;
    this.options = merge(defaultOptions, options);

    if (this.isAlreadyInitialized()) {
      this.bindingDOM();
      return;
    }

    this.initializeDOM();
    this.attachEvents();
  }
}
