import { UIPipe } from "./ui.pipe";
import deepmerge from "deepmerge";

type UIDataOptions = {
  strategy: "shallow" | "deep" | "replace";
};

/**
 * A class that manages the data of the node
 * like jQuery's data method.
 */
export class UIData extends UIPipe {
  private readonly nodeData = new Map<HTMLElement, Record<string, any>>();
  private mergeStrategy: UIDataOptions["strategy"];

  constructor(opts?: UIDataOptions) {
    super();
    this.mergeStrategy = opts?.strategy ?? "shallow";
  }

  public getNodeData() {
    return this.nodeData;
  }

  protected setNodeData(node: HTMLElement, data: Record<string, any>) {
    const prevData = this.nodeData.get(node) ?? {};

    if (this.mergeStrategy === "shallow") {
      this.nodeData.set(node, { ...prevData, ...data });
    } else if (this.mergeStrategy === "deep") {
      this.nodeData.set(node, deepmerge(prevData, data));
    } else {
      this.nodeData.set(node, data);
    }

    return this;
  }
}
