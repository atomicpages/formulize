/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { KeyCodes } from "./key.enum";
import { specialCharacters, supportedCharacters } from "./values";

const numberRe = /^[0-9]+/;

export class FormulizeKeyHelper {
  private static isMacOS() {
    return navigator.userAgent.includes("Mac OS X");
  }

  public static isReload(
    key: string,
    ctrl: boolean,
    shift?: boolean,
    meta?: boolean,
  ): boolean {
    if (FormulizeKeyHelper.isMacOS()) {
      return Boolean(shift && meta && key === "r");
    }

    return key === "F5" || (ctrl && key === "r");
  }

  public static isSelectAll(
    key: string,
    ctrl: boolean,
    shift?: boolean,
    meta?: boolean,
  ): boolean {
    return Boolean(
      FormulizeKeyHelper.isMacOS() ? meta && key === "a" : key === "a" && ctrl,
    );
  }

  public static isBackspace(key: string): boolean {
    return key === KeyCodes.Backspace;
  }

  public static isDelete(key: string): boolean {
    return key === KeyCodes.Delete;
  }

  public static isLeft(key: string): boolean {
    return key === KeyCodes.LeftArrow;
  }

  public static isUp(key: string): boolean {
    return key === KeyCodes.UpArrow;
  }

  public static isRight(key: string): boolean {
    return key === KeyCodes.RightArrow;
  }

  public static isDown(key: string): boolean {
    return key === KeyCodes.DownArrow;
  }

  public static isHome(
    key: string,
    ctrl: boolean,
    shift: boolean,
    meta: boolean,
  ): boolean {
    // macOS meta + left arrow
    // full keyboards on macOS have the "home" key
    return (
      key === KeyCodes.Home ||
      (FormulizeKeyHelper.isMacOS() && meta && key === KeyCodes.LeftArrow)
    );
  }

  public static isEnd(
    key: string,
    ctrl: boolean,
    shift: boolean,
    meta: boolean,
  ): boolean {
    // macOS meta + right arrow
    // full keyboards on macOS have the "end" key
    return (
      key === KeyCodes.End ||
      (FormulizeKeyHelper.isMacOS() && meta && key === KeyCodes.RightArrow)
    );
  }

  public static doReload(): void {
    location.reload();
  }

  public static doAction<T>(action: () => T): () => T {
    return action;
  }

  public static getValue(key: string, shift = false): string | undefined {
    if (key === KeyCodes.Asterik) {
      return "x";
    }

    if (
      ((key === KeyCodes.PlusMinus || key === KeyCodes.Equals) && shift) ||
      key === KeyCodes.Plus
    ) {
      return "+";
    }

    if (key === KeyCodes.Subtract || key === KeyCodes.LongMinus) {
      return "-";
    }

    if (key === KeyCodes.Period) {
      return ".";
    }

    if (key === KeyCodes.Divide || key === KeyCodes.DivideAlt) {
      return "/";
    }

    const isNumber = numberRe.test(key);

    if (isNumber || supportedCharacters.includes(key)) {
      if (isNumber && shift) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, security/detect-object-injection
        return specialCharacters[key];
      }

      return key;
    }

    return undefined;
  }
}
