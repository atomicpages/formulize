import type { FormulizeData, Position } from "./ui.interface";
import { StringHelper } from "../string.helper";

export class UIHelper {
  public static getDataValue(data: FormulizeData): string {
    if (!UIHelper.isDOM(data)) {
      return StringHelper.isNumeric(data as string)
        ? StringHelper.toNumber(String(data))
        : (data as string);
    }

    const value = (data as Element).textContent ?? "";

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
}
