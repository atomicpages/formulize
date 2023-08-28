import type { FormulizeData, FormulizeEvent } from "./ui.interface";
import { UIHelper } from "./ui.helper";
import { UIDom } from "./ui.dom";
import { UIEvent } from "./ui.event";

export class UIPipe extends UIDom {
  protected pipeInsert(data: FormulizeData): any {
    if (!this.options.pipe?.insert) {
      return data;
    }

    return this.options.pipe.insert(data);
  }

  protected pipeParse(elem: HTMLElement): any {
    if (!this.options.pipe?.parse) {
      return UIHelper.getDataValue(elem);
    }

    return this.options.pipe.parse(elem);
  }

  protected pipeTrigger(name: FormulizeEvent, value: any): void {
    UIEvent.triggerHandler(this.elem, name, value);
    const eventPipe: Function = (this.options as any)[name];

    if (eventPipe) {
      eventPipe(value);
    }
  }
}
