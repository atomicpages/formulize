import { defaultOptions } from "./option.value";
import type {
  FormulizeFunction,
  FormulizeOptions,
} from "./formulize.interface";
import { UI } from "./ui/ui";
import type { FormulizePlugin } from "./formulize.jquery";
import { MethodBase, methodBinder } from "./formulize.plugin.method";

export function pluginBinder() {
  const reflectedMethod = new MethodBase(null);
  const reflectedMethodNames = Object.getOwnPropertyNames(
    Object.getPrototypeOf(reflectedMethod),
  );

  $.fn.formulize = Object.assign<FormulizeFunction, FormulizeOptions>(
    function (this: JQuery, options: FormulizeOptions): JQuery {
      this.toArray().forEach((elem) => {
        $(elem).data("$formulize", new UI(elem, options));
      });
      return this;
    },
    { ...defaultOptions } as FormulizeOptions,
  ) as FormulizePlugin;

  reflectedMethodNames
    .filter((name) => name !== "constructor")
    .map((name) => ({
      name,
      func: function (...args: any[]) {
        methodBinder.call(this, name, ...args);
      },
    }))
    .forEach((binder) => {
      ($.fn as any)[binder.name] = binder.func;
    });
}
