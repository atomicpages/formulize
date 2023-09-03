import { convert, valid } from "metric-parser";
import { FormulizeTokenHelper } from "../token.helper";
import type { Tree } from "metric-parser/dist/types/tree/simple.tree/type";
import { UIElementHelper } from "./ui.element.helper";
import type { ElementPosition, FormulizeData, Position } from "./ui.interface";
import { UIHelper } from "./ui.helper";
import { UIData } from "./ui.data";

export abstract class UIManager extends UIData {
  protected prevCursorIndex = 0;
  protected prevPosition: Position = { x: 0, y: 0 };
  protected dragged: boolean;
  protected moved: boolean;

  public pick(position: Position = { x: 0, y: 0 }) {
    this.removeCursor();

    this.cursor = UIElementHelper.createCursorElement(this.options.id);
    this.container.append(this.cursor);

    const closestUnitElem = this.findClosestUnit(position);

    if (closestUnitElem) {
      closestUnitElem.append(this.cursor);
    } else {
      this.container.prepend(this.cursor);
    }

    this.removeDrag();
  }

  public setData(data: Tree): void {
    this.clear();
    const result = convert(data);

    if (!result.code) {
      this.insertData(result.data);
    }
  }

  public getData<T extends Tree>(extractor?: (data: T) => void): T {
    const expression = this.getExpression();
    const result = convert(expression);

    if (extractor) {
      extractor(result.data);
    }

    return result.data;
  }

  protected triggerUpdate(): void {
    this.validate();
    this.pipeTrigger("input", this.getData());
  }

  private getExpression(): FormulizeData[] {
    return Array.from(
      this.container.querySelectorAll(`.${this.options.id}-item`),
    ).map((elem: HTMLElement) => {
      return UIHelper.getDataValue(
        // prefer node data over the element
        this.pipeParse(this.getNodeData(elem) ?? elem),
      );
    });
  }

  protected startDrag(position: Position): void {
    this.dragged = true;
    this.moved = false;
    this.prevPosition = position;
    this.pick(position);
    this.prevCursorIndex = this.cursorIndex;
  }

  protected endDrag(position: Position): void {
    this.dragged = false;

    if (this.moved) {
      return;
    }

    this.moved = false;
    this.pick(position);
  }

  protected moveDrag(position: Position): void {
    if (!this.dragged) {
      return;
    }

    if (!this.moved) {
      this.moved = UIHelper.isOverDistance(this.prevPosition, position, 5);
      return;
    }

    this.removeDrag();
    this.pick(position);

    if (this.prevCursorIndex === this.cursorIndex) {
      return;
    }

    const positions = [this.prevCursorIndex, this.cursorIndex];
    positions.sort();

    const dragElem = UIElementHelper.createDragElement(this.options.id);

    if (this.cursorIndex >= this.prevCursorIndex) {
      this.cursor.insertAdjacentElement("afterbegin", dragElem);
    } else {
      this.cursor.insertAdjacentElement("afterend", dragElem);
    }

    this.selectRange(positions[0], positions[1]);
  }

  private findClosestUnit(position: Position): HTMLElement {
    const unitPositions: ElementPosition[] = Array.from(
      this.container.querySelectorAll(`*:not(.${this.options.id}-cursor)`),
    ).map((elem) => {
      const { left, top, width } = elem.getBoundingClientRect();

      return {
        elem,
        x: left + width,
        y: top,
      };
    });

    const closestUnitPositions = unitPositions
      .filter(
        (unitPosition) =>
          unitPosition.x <= position.x && unitPosition.y <= position.y,
      )
      .map((unitPosition) => {
        const diffX = Math.abs(position.x - unitPosition.x);
        const diffY = Math.abs(position.y - unitPosition.y);

        return {
          ...unitPosition,
          diff: { x: diffX, y: diffY },
        };
      })
      .filter((unitPosition) => unitPosition);

    const maxY = Math.max(
      ...closestUnitPositions.map((unitPosition) => unitPosition.y),
    );

    const filteredUnitPositions = closestUnitPositions.filter(
      (unitPosition) => unitPosition.y === maxY,
    ).length
      ? closestUnitPositions.filter((unitPosition) => unitPosition.y === maxY)
      : closestUnitPositions.filter(
          (unitPosition) => unitPosition.y <= position.y,
        );

    filteredUnitPositions.sort(
      (a, b) => a.diff.x - b.diff.x || a.diff.y - b.diff.y,
    );

    const closestUnitPosition = filteredUnitPositions.shift();

    return closestUnitPosition ? closestUnitPosition.elem : undefined;
  }

  public selectAll(): void {
    this.removeDrag();
    const dragElem = UIElementHelper.createDragElement(this.options.id);
    UIElementHelper.prependTo(this.container, dragElem);

    UIElementHelper.appendTo(
      dragElem,
      UIElementHelper.children(
        this.container,
        `:not(.${this.options.id}-cursor)`,
      ),
    );
  }

  public selectRange(start: number, end: number): void {
    if (!this.dragElem) {
      return;
    }

    const elements = Array.from(
      this.container.querySelectorAll(`:not(.${this.options.id}-cursor)`),
    )
      .slice(start + 1)
      .slice(0, end - start);

    Array.from(
      this.container.querySelectorAll(`:not(.${this.options.id}-cursor)`),
    )
      .filter(`:gt("${start}")`)
      .filter(`:lt("${end - start}")`)
      // FIXME: need to figure this out
      .add(
        this.container.children(`:not(".${this.options.id}-cursor")`).eq(start),
      )
      .appendTo(this.dragElem);
  }

  protected removeBefore(): void {
    if (this.dragElem) {
      this.dragElem.before(this.cursor);
      this.dragElem.remove();
      this.triggerUpdate();
      return;
    }

    const prevCursorElem = this.cursor.previousElementSibling as HTMLElement;

    if (!this.cursor || !prevCursorElem) {
      return;
    }

    if (
      prevCursorElem.classList.contains(`${this.options.id}-unit`) &&
      prevCursorElem.textContent
    ) {
      const text = prevCursorElem.textContent;

      UIElementHelper.setUnitValue(
        this.options.id,
        prevCursorElem,
        text.substring(0, text.length - 1),
      );
    } else {
      prevCursorElem.remove();
    }

    this.triggerUpdate();
  }

  protected removeAfter(): void {
    if (this.dragElem) {
      this.dragElem.after(this.cursor);
      this.dragElem.remove();
      this.triggerUpdate();
      return;
    }

    const nextCursorElem = this.cursor.nextElementSibling as HTMLElement;
    if (!this.cursor || !nextCursorElem) {
      return;
    }

    if (
      nextCursorElem.classList.contains(`${this.options.id}-unit`) &&
      nextCursorElem.textContent
    ) {
      const text = nextCursorElem.textContent;

      UIElementHelper.setUnitValue(
        this.options.id,
        nextCursorElem,
        text.substring(1, text.length),
      );
    } else {
      nextCursorElem.remove();
    }

    this.triggerUpdate();
  }

  protected dragFirst(): void {
    if (this.dragElem) {
      UIElementHelper.prependTo(
        this.dragElem as HTMLElement,
        UIElementHelper.prevAll(this.cursor),
      );

      this.cursor.after(this.dragElem);
    }
  }

  protected dragLast(): void {
    if (this.dragElem) {
      UIElementHelper.appendTo(
        this.dragElem,
        UIElementHelper.nextAll(this.cursor),
      );

      this.dragElem.before(this.cursor);
    }
  }

  protected dragLeft(): void {
    if (
      this.dragElem &&
      UIElementHelper.isDrag(
        this.options.id,
        this.cursor.previousElementSibling as HTMLElement,
      )
    ) {
      UIElementHelper.prependTo(
        this.dragElem,
        this.dragElem?.previousElementSibling,
      );

      this.moveCursorAfter(this.dragElem as HTMLElement);

      return;
    }

    if (
      UIElementHelper.isDrag(
        this.options.id,
        this.cursor.nextElementSibling as HTMLElement | null,
      )
    ) {
      const children = this.dragElem?.children;
      if (children?.length) {
        UIElementHelper.insertAfter(
          children[children.length - 1] as HTMLElement,
          this.dragElem as HTMLElement,
        );
      }

      if (!this.dragElem?.children.length) {
        this.removeDrag();
      }

      return;
    }
  }

  protected dragRight(): void {
    if (
      this.dragElem &&
      UIElementHelper.isDrag(
        this.options.id,
        this.cursor.nextElementSibling as HTMLElement,
      )
    ) {
      UIElementHelper.appendTo(
        this.dragElem,
        this.dragElem?.nextElementSibling,
      );

      this.moveCursorBefore(this.dragElem as HTMLElement);
      return;
    }

    if (
      UIElementHelper.isDrag(
        this.options.id,
        this.cursor.previousElementSibling as HTMLElement,
      )
    ) {
      const firstDraggedElem = this.dragElem?.firstElementChild;

      if (firstDraggedElem && this.dragElem) {
        UIElementHelper.insertBefore(
          firstDraggedElem as HTMLElement,
          this.dragElem,
        );
      }

      if (this.dragElem?.children.length === 0) {
        this.removeDrag();
      }

      return;
    }
  }

  private moveCursorBefore(elem: HTMLElement) {
    if (!elem) {
      return;
    }

    elem.before(this.cursor);
  }

  private moveCursorAfter(elem: HTMLElement) {
    if (!elem) {
      return;
    }

    elem.after(this.cursor);
  }

  protected moveLeftCursor(dragMode = false): void {
    const prevCursorElem = this.cursor.previousElementSibling as HTMLElement;

    if (prevCursorElem && (!this.cursor || !dragMode)) {
      this.moveCursorBefore(prevCursorElem);
      this.removeDrag();
      return;
    }

    if (!this.dragElem) {
      if (!prevCursorElem) {
        return;
      }

      const dragElem = UIElementHelper.createDragElement(this.options.id);
      this.cursor.before(dragElem);

      // TODO: fix this
      UIElementHelper.prependTo(this.dragElem, prevCursorElem);
      return;
    }

    this.dragLeft();
  }

  protected moveUpCursor(): void {
    if (!this.cursor) {
      return;
    }

    const { left, top, width, height } = this.cursor.getBoundingClientRect();

    this.pick({
      x: left + width,
      y: top - height / 2,
    });
  }

  protected moveRightCursor(dragMode = false): void {
    const nextCursorElem = this.cursor.nextElementSibling as HTMLElement;

    if (!this.cursor || !dragMode) {
      this.moveCursorAfter(nextCursorElem);
      this.removeDrag();
      return;
    }

    if (!this.dragElem) {
      if (!nextCursorElem) {
        return;
      }

      const dragElem = UIElementHelper.createDragElement(this.options.id);
      this.cursor.after(dragElem);
      UIElementHelper.appendTo(this.dragElem, nextCursorElem);
      return;
    }

    this.dragRight();
  }

  protected moveDownCursor(): void {
    if (!this.cursor) {
      return;
    }

    const { left, top, width, height } = this.cursor.getBoundingClientRect();

    this.pick({
      x: left + width,
      y: top + height * 1.5,
    });
  }

  protected moveFirstCursor(dragMode = false): void {
    const firstCursorElem = this.container.firstElementChild as HTMLElement;

    if (!this.cursor || !firstCursorElem || !dragMode) {
      this.removeDrag();
      this.moveCursorBefore(firstCursorElem);
      return;
    }

    if (!this.dragElem) {
      const dragElem = UIElementHelper.createDragElement(this.options.id);
      this.cursor.after(dragElem);
    }

    this.dragFirst();
  }

  protected moveLastCursor(dragMode = false): void {
    const lastCursorElem = this.container.lastElementChild as HTMLElement;

    if (!this.cursor || !lastCursorElem || !dragMode) {
      this.removeDrag();
      this.moveCursorAfter(lastCursorElem);
      return;
    }

    if (!this.dragElem) {
      const dragElem = UIElementHelper.createDragElement(this.options.id);
      this.cursor.before(dragElem);
    }

    this.dragLast();
  }

  public clear(): void {
    this.removeCursor();
    this.removeUnit();
    this.triggerUpdate();
  }

  public blur(): void {
    if (!this.cursor) {
      return;
    }

    this.cursor.remove();
    this.removeDrag();
  }

  public removeDrag(): void {
    if (this.dragElem) {
      UIElementHelper.insertBefore(
        Array.from(this.dragElem.children),
        this.dragElem,
      );

      this.dragElem.remove();
      this.triggerUpdate();
    }
  }

  public insert(data: FormulizeData, position?: Position): void {
    if (!data) {
      return;
    }

    const pipedData = this.pipeInsert(data);

    if (!this.cursor || position) {
      this.pick(position);
    }

    if (typeof pipedData === "string" || typeof pipedData === "number") {
      this.insertValue(String(pipedData));
      return;
    }

    if (!UIHelper.isDOM(pipedData)) {
      return;
    }

    const insertElem = $(pipedData);
    insertElem.addClass(`${this.options.id}-item`);
    insertElem.insertBefore(this.cursor);

    this.triggerUpdate();
  }

  public insertValue(value: string): void {
    if (!FormulizeTokenHelper.isValid(value)) {
      return;
    }

    if (FormulizeTokenHelper.isNumeric(value)) {
      const unitElem = UIElementHelper.createUnitElement(
        this.options.id,
        value,
      );

      if (this.dragElem) {
        this.cursor.before(this.dragElem);
        this.dragElem.remove();
      }

      if (this.cursor) {
        this.cursor.before(unitElem);
      } else {
        this.container.append(unitElem);
      }

      this.mergeUnit(unitElem);

      this.triggerUpdate();
      return;
    }

    const operatorElem = UIElementHelper.createOperatorElement(
      this.options.id,
      value,
    );

    if (this.cursor) {
      this.cursor.before(operatorElem);
    } else {
      this.container.append(operatorElem);
    }

    if (FormulizeTokenHelper.isBracket(value)) {
      operatorElem.classList.add(`${this.options.id}-bracket`);
    }
  }

  public insertData(data: string | string[] | any[]): void {
    const arrayData = typeof data === "string" ? data.split("") : data;

    arrayData.forEach((value) => this.insert(value));
    this.triggerUpdate();
  }

  public validate(extractor?: (valid: boolean) => void): boolean | undefined {
    const data = this.getData();

    if (!data) {
      return;
    }

    const isValid = valid(data);
    this.updateStatus(isValid);

    if (extractor) {
      extractor(isValid);
    }

    return isValid;
  }
}
