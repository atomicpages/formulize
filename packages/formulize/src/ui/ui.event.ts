type Handler<K extends keyof HTMLElementEventMap> = (
  this: HTMLElement,
  ev: HTMLElementEventMap[K],
) => any;

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

  public static once<
    K extends keyof HTMLElementEventMap,
    E extends HTMLElement = HTMLElement,
  >(element: E, type: K, handler: Handler<K>, opts?: AddEventListenerOptions) {
    // skip adding the event if it fires once since it is automatically removed
    // while not complete, it allows us to avoid having to track the event
    // via something like RxJs in order to remove it from the map
    element.addEventListener(type, handler, { ...opts, once: true });
    return this;
  }

  public static trigger<
    K extends keyof HTMLElementEventMap,
    E extends HTMLElement = HTMLElement,
  >(element: E, type: K) {
    element.dispatchEvent(new Event(type));
    return this;
  }
}
