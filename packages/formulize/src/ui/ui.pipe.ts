import type { FormulizeData, FormulizeEvent } from "./ui.interface";
import { UIHelper } from "./ui.helper";
import { UIDom } from "./ui.dom";

export class UIPipe extends UIDom {
  protected pipeInsert(data: FormulizeData): any {
    if (!this.options.pipe?.insert) {
      return data;
    }

    const insertData = UIHelper.isDOM(data) ? UIHelper.getDOM(data) : data;

    return this.options.pipe.insert(insertData);
  }

  protected pipeParse(elem: HTMLElement): any {
    if (!this.options.pipe?.parse) {
      return UIHelper.getDataValue(elem);
    }

    return this.options.pipe.parse(elem);
  }

  protected pipeTrigger(name: FormulizeEvent, value: any): void {
    $(this.elem).triggerHandler(`${this.options.id}.${name}`, value);
    const eventPipe: Function = (this.options as any)[name];
    if (eventPipe) {
      eventPipe(value);
    }
  }
}
