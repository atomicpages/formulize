type Handler<K extends keyof HTMLElementEventMap> = (
  this: HTMLElement,
  ev: HTMLElementEventMap[K],
) => any;

/**
 * A drop-in replacement for jQuery's event system.
 * This is a very simple implementation that allows
 * us to register and unregister events on elements
 * without having to worry about memory leaks.
 * @example
 * UIEvent.on(document.body, "click", (ev) => {
 *   // handle click event
 * });
 *
 * @example
 * // turns off all click handlers
 * UIEvent.off(document.body, "click");
 *
 * @example
 * // turn off a specific event handler
 * UIEvent.off(document.body, "click", handler);
 *
 * @example
 * // turn off a specific event handler with options
 * UIEvent.off(document.body, "click", handler, { once: true });
 *
 * @example
 * // trigger an event
 * UIEvent.trigger(document.body, "click");
 *
 * @example
 * // trigger an event with data
 * UIEvent.triggerHandler(document.body, "click", { foo: "bar" });
 */
export class UIEvent {
  private static events = new Map<
    keyof HTMLElementEventMap,
    {
      element: Element;
      handler: Handler<any>;
      opts?: boolean | AddEventListenerOptions;
    }[]
  >();

  /**
   * Verify handler is unique to the element
   * otherwise we can get into situations where
   * the handler can be registered multiple times.
   * @param element the element to check for
   * @param type the event type
   * @param handler the handler function
   * @returns
   */
  protected static isHandlerRegisteredOnElement<
    K extends keyof HTMLElementEventMap,
    E extends HTMLElement = HTMLElement,
  >(element: E, type: K, handler: Handler<K>) {
    if (this.events.has(type)) {
      const types = this.events.get(type) ?? [];

      return types.some(
        (event) => event.element === element && event.handler === handler,
      );
    }

    return false;
  }

  /**
   * Works like jQuery's `on` or `live` method.
   * @param element the element to attach the event to
   * @param type the event type
   * @param handler the handler function
   * @param opts the event options
   */
  public static on<
    K extends keyof HTMLElementEventMap,
    E extends HTMLElement = HTMLElement,
  >(
    element: E,
    type: K,
    handler: Handler<K>,
    opts?: boolean | AddEventListenerOptions,
  ) {
    if (!this.isHandlerRegisteredOnElement(element, type, handler)) {
      this.events.set(type, [
        ...(this.events.get(type) ?? []),
        { element, handler, opts },
      ]);

      element.addEventListener(type, handler, opts);
    }

    return this;
  }

  /**
   * Works like jQuery's `off` or `die` method. Be sure when
   * specifying handler and opts that they match the original
   * registration otherwise the event will not be removed.
   * @param element the element to remove the event from
   * @param type the event type
   * @param handler the handler function
   * @param opts the event options
   */
  public static off<
    K extends keyof HTMLElementEventMap,
    E extends HTMLElement = HTMLElement,
  >(
    element: E,
    type: K,
    handler?: Handler<K>,
    opts?: boolean | AddEventListenerOptions,
  ) {
    if (this.events.has(type)) {
      if (handler) {
        this.events.set(
          type,
          (this.events.get(type) ?? []).filter(
            (event) => event.handler !== handler,
          ),
        );

        element.removeEventListener(type, handler, opts);
      } else {
        const remove: number[] = [];
        const types = this.events.get(type) ?? [];

        types.forEach((event, idx) => {
          if (event.element === element) {
            remove.push(idx);
            element.removeEventListener(type, event.handler, event.opts);
          }
        });

        if (remove.length === types.length) {
          this.events.delete(type);
        } else {
          this.events.set(
            type,
            types.filter((_, idx) => !remove.includes(idx)),
          );
        }
      }
    }

    return this;
  }

  /**
   * Works like jQuery's `one` method. This will
   * register the event handler and then remove
   * it after the first time it's invoked. However,
   * using `UIEvent.off` will not work since the
   * handler is not added to the internal map. See
   * the example for how to remove these manually.
   * @param element the element to attach the event to
   * @param type the event type
   * @param handler the handler function
   * @param opts the event options
   * @example
   * UIEvent.once(document.body, "click", console.log, { passive: true });
   * document.body.click(); // logs click event
   *
   * // remove using DOM APIs
   * document.body.removeEventListener("click", console.log, { passive: true });
   */
  public static once<
    K extends keyof HTMLElementEventMap,
    E extends HTMLElement = HTMLElement,
  >(element: E, type: K, handler: Handler<K>, opts?: AddEventListenerOptions) {
    // skip adding when this is used since it'll be removed automatically
    // when complete.
    element.addEventListener(type, handler, { ...opts, once: true });
    return this;
  }

  /**
   * Works like jQuery's `trigger` method. This will
   * trigger the event on the element. This is a
   * very simple implementation that does not
   * support custom events. Right now only `Event`
   * is created and dispatched.
   * @param element the element to trigger the event on
   * @param type the event type
   */
  public static trigger<
    K extends keyof HTMLElementEventMap,
    E extends HTMLElement = HTMLElement,
  >(element: E, type: K) {
    // TODO: this should be more rich and map to the correct
    // event object (e.g. click -> MouseEvent)
    element.dispatchEvent(
      new Event(type, {
        bubbles: true,
        cancelable: true,
      }),
    );
    return this;
  }

  /**
   * Inspired by jQuery's triggerHandler method
   * this allows you to trigger an event with
   * extra data. Like jQuery's triggerHandler
   * this will not bubble up the DOM and wil;
   * invoke the handler directly.
   * @param element the element to trigger the event on
   * @param type the event type
   * @param detail custom data to send to the handler
   */
  public static triggerHandler<
    K extends keyof HTMLElementEventMap,
    E extends HTMLElement = HTMLElement,
    T = any,
  >(element: E, type: K, detail?: T) {
    const event = new CustomEvent<T>(type, {
      bubbles: false,
      cancelable: true,
      detail,
    });

    element.dispatchEvent(event);
  }
}
