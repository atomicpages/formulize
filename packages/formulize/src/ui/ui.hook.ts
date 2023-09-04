import { UIManager } from "./ui.manager";
import { FormulizeKeyHelper } from "../key.helper";

export abstract class UIHook extends UIManager {
  protected hookKeyDown(e: KeyboardEvent): void {
    e.preventDefault();

    if (!this.cursor) {
      return;
    }

    this.analyzeKey(e.key, e.ctrlKey, e.shiftKey, e.metaKey);
    const key = FormulizeKeyHelper.getValue(e.key, e.shiftKey);

    if (key === undefined) {
      return;
    }

    this.insertValue(key);
    this.validate();
  }
}
