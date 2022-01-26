import { NextRouter } from "next/router";
import { IconType } from "react-icons";

export abstract class Tabs {
  protected constructor(
    public readonly name: string,
    public readonly publicName: string,
    public readonly icon: IconType,
  ) {}

  public abstract getPushRoute(router: NextRouter): string;

  public isSelected(url: string): boolean {
    return url.includes("/" + this.name);
  }

  toString() {
    return this.publicName;
  }
}
