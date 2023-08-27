import type { FormulizeData, Position } from "./ui.interface";
import { StringHelper } from "../string.helper";

export class UIHelper {
  public static getDataValue(data: FormulizeData): string {
    if (!UIHelper.isDOM(data)) {
      return StringHelper.isNumeric(data)
        ? StringHelper.toNumber(String(data))
        : data;
    }

    const value =
      $(data as HTMLElement | JQuery).data("value") ||
      $(data as HTMLElement | JQuery).text();
    return StringHelper.isNumeric(value)
      ? StringHelper.toNumber(String(value))
      : value;
  }

  public static isOverDistance(
    position: Position,
    targetPosition: Position,
    distance: number,
  ): boolean {
    return (
      Math.abs(position.x - targetPosition.x) > distance ||
      Math.abs(position.y - targetPosition.y) > distance
    );
  }

  public static isDOM(data: FormulizeData): boolean {
    return data instanceof HTMLElement;
  }

  public static getDOM(elem: HTMLElement | JQuery): HTMLElement {
    return elem instanceof jQuery ? (elem as JQuery)[0] : (elem as HTMLElement);
  }
}
