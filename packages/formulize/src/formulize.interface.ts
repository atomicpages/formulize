import type { OptionText, PipeParse, PipeInsert } from "./option.interface";
import type { Tree } from "metric-parser/dist/types/tree/simple.tree/type";

export * from "metric-parser/dist/types/ast.d";
export * from "metric-parser/dist/types/tree/simple.tree/type.d";

export type FormulizeGlobal = {
  window: Window;
  document: Document;
  HTMLElement: typeof HTMLElement;

  /**
   * @deprecated
   */
  $: JQueryStatic;

  /**
   * @deprecated
   */
  jQuery: JQueryStatic;
} & NodeJS.Global;

export type FormulizeOptions = {
  id?: string;
  text?: OptionText;
  pipe?: OptionPipe;
  status?: boolean;
} & FormulizeEventOptions;

export type FormulizeEventOptions = {
  input?<T extends Tree>(value: T): void;
};

export type OptionPipe = {
  insert?: PipeInsert;
  parse?: PipeParse;
};

export type FormulizeFunction = (options?: FormulizeOptions) => JQuery;
