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
        // TODO: figure out what this is supposed to do
        predicate: FormulizeKeyHelper.isUp,
        doBehavior: FormulizeKeyHelper.doAction(() => this.moveUpCursor()),
      },
      {
        // TODO: figure out what this is supposed to do
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
      {
        predicate: FormulizeKeyHelper.isLeft,
        doBehavior: FormulizeKeyHelper.doAction(() =>
          this.moveLeftCursor(shift),
        ),
      },
      {
        predicate: FormulizeKeyHelper.isRight,
        doBehavior: FormulizeKeyHelper.doAction(() =>
          this.moveRightCursor(shift),
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

    const mouseDown = (e: MouseEvent) => {
      console.log("mouseDown");
      return this.startDrag({ x: e.offsetX, y: e.offsetY });
    };

    const mouseUp = (e: MouseEvent) => {
      console.log("mouseUp");
      return this.endDrag({ x: e.offsetX, y: e.offsetY });
    };

    const mouseMove = (e: MouseEvent) => {
      console.log("mouseMove");
      return this.moveDrag({ x: e.offsetX, y: e.offsetY });
    };

    const keyDown = (event: KeyboardEvent) => {
      this.hookKeyDown(event);
    };

    UIEvent.on(this.textBox, "blur", blur);
    UIEvent.on(this.textBox, "dblclick", selectAll);
    UIEvent.on(this.textBox, "mousedown", mouseDown);

    // TODO: implement click for cursor, this required
    // us to track where mousedown and click occur
    // so we can determine if the cursor moved
    // enough for selectRange to be called instead
    // of placing the cursor
    // UIEvent.on(this.textBox, "click", console.log);
    UIEvent.on(this.textBox, "mouseup", mouseUp);
    UIEvent.on(this.textBox, "mousemove", mouseMove);
    UIEvent.on(this.textBox, "keydown", keyDown);
  }
}
