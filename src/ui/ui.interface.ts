export type Position = {
  x: number;
  y: number;
};

export type ElementPosition = {
  elem: HTMLElement;
  diff?: {
    x: number;
    y: number;
  };
} & Position;

export type Behavior = {
  predicate: (...args: any[]) => boolean;
  doBehavior: () => any;
};

export type FormulizeData = string | number | HTMLElement | JQuery | any;

export type FormulizeEvent = "input";
