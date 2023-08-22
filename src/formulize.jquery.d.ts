import type { Tree } from "metric-parser/dist/types/tree/simple.tree/type";
import type { UI } from "./ui/ui";
import type { Position } from "./ui/ui.interface";
import type { FormulizeFunction } from "./formulize.interface";

export type $formulize = "$formulize";

export type FormulizePlugin = object & FormulizeFunction;

export type FormulizePluginMethods = {
  pick(position: Position): void;
  setData(data: Tree): void;
  getData<T extends Tree>(extractor?: (data: T) => void): T;
  selectRange(start: number, end: number): void;
  selectAll(): void;
  clear(): void;
  blur(): void;
  removeDrag(): void;
  insert(
    obj: string | number | HTMLElement | JQuery,
    position?: Position,
  ): void;
  insertValue(value: string): void;
  insertData(data: string | string[] | any[]): void;
  validate(extractor?: (valid: boolean) => void): boolean;
};

declare global {
  interface JQuery extends FormulizePluginMethods {
    formulize: FormulizePlugin;
    data(key: $formulize): UI;
  }
}
