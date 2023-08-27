import { FormulizeKeyHelper } from "../key.helper";
import { UIBase } from "./ui.base";
import type { Behavior } from "./ui.interface";
import { UIEvent } from "./ui.event";

export class UI extends UIBase {
  protected analyzeKey(
    key: string,
    ctrl: boolean,
    shift: boolean,
    meta: boolean,
  ): boolean {
    const behaviors: Behavior[] = [
      {
        predicate: FormulizeKeyHelper.isReload,
        doBehavior: FormulizeKeyHelper.doReload,
      },
      {
        predicate: FormulizeKeyHelper.isSelectAll,
        doBehavior: FormulizeKeyHelper.doAction(() => this.selectAll()),
      },
      {
        predicate: FormulizeKeyHelper.isBackspace,
        doBehavior: FormulizeKeyHelper.doAction(() => this.removeBefore()),
      },
      {
        predicate: FormulizeKeyHelper.isDelete,
        doBehavior: FormulizeKeyHelper.doAction(() => this.removeAfter()),
      },
      {
        predicate: FormulizeKeyHelper.isLeft,
        doBehavior: FormulizeKeyHelper.doAction(() =>
          this.moveLeftCursor(shift),
        ),
      },
      {
        predicate: FormulizeKeyHelper.isUp,
        doBehavior: FormulizeKeyHelper.doAction(() => this.moveUpCursor()),
      },
      {
        predicate: FormulizeKeyHelper.isRight,
        doBehavior: FormulizeKeyHelper.doAction(() =>
          this.moveRightCursor(shift),
        ),
      },
      {
        predicate: FormulizeKeyHelper.isDown,
        doBehavior: FormulizeKeyHelper.doAction(() => this.moveDownCursor()),
      },
      {
        predicate: FormulizeKeyHelper.isHome,
        doBehavior: FormulizeKeyHelper.doAction(() =>
          this.moveFirstCursor(shift),
        ),
      },
      {
        predicate: FormulizeKeyHelper.isEnd,
        doBehavior: FormulizeKeyHelper.doAction(() =>
          this.moveLastCursor(shift),
        ),
      },
    ];

    const behavior = behaviors.find((behavior) =>
      behavior.predicate(key, ctrl, shift, meta),
    );

    if (!behavior) {
      return false;
    }

    behavior.doBehavior();
    return true;
  }

  protected attachEvents(): void {
    const blur = () => this.blur();
    const selectAll = () => this.selectAll();

    const mouseDown = (e: MouseEvent) =>
      this.startDrag({ x: e.offsetX, y: e.offsetY });

    const mouseUp = (e: MouseEvent) =>
      this.endDrag({ x: e.offsetX, y: e.offsetY });

    const mouseMove = (e: MouseEvent) =>
      this.moveDrag({ x: e.offsetX, y: e.offsetY });

    const keyDown = (event: KeyboardEvent) => {
      this.hookKeyDown(event);
    };

    UIEvent.on(this.textBox, "blur", blur);
    UIEvent.on(this.textBox, "dblclick", selectAll);
    UIEvent.on(this.textBox, "mousedown", mouseDown);
    UIEvent.on(this.textBox, "mouseup", mouseUp);
    UIEvent.on(this.textBox, "mousemove", mouseMove);
    UIEvent.on(this.textBox, "keydown", keyDown);
  }
}