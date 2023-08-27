import { supportedCharacters } from "./values";
import { StringHelper } from "./string.helper";

const decimalRe = /\B(?=(\d{3})+(?!\d))/g;
const numberRe = /[0-9.]/;
const bracketRe = /^[()]$/;

export class FormulizeTokenHelper {
  public static toDecimal(value: string): string {
    const splitValue = StringHelper.toNumber(value).split(".");

    if (splitValue.length) {
      splitValue[0] = splitValue[0].replace(decimalRe, ",");
    }

    return splitValue.join(".");
  }

  public static isValid(value: string): boolean {
    return (
      FormulizeTokenHelper.isNumeric(value) ||
      FormulizeTokenHelper.supportValue(value)
    );
  }

  public static isNumeric(value: string): boolean {
    return numberRe.test(value);
  }

  public static isBracket(value: string): boolean {
    return bracketRe.test(value);
  }

  public static isComma(value: string): boolean {
    return value === ",";
  }

  public static supportValue(value: string): boolean {
    return supportedCharacters.includes(value);
  }
}
