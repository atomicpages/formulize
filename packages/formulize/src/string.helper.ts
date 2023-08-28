const numberRe = /^-?[\d,]+\.?\d*$/;
const toNumberRe = /[^\d-.]/g;

export class StringHelper {
  public static isNumeric(value: string): boolean {
    return numberRe.test(value) && typeof value !== "object";
  }

  public static toNumber(value: string): string {
    return value.replace(toNumberRe, "");
  }
}
