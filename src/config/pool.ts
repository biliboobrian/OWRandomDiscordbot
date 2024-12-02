import { CharType } from "../enums/charType.enum";
import { CHARS } from "./chars";
import { Stats } from "./stats";

export class Pool {
  herosUsed: string[] = [];

  constructor(private type: CharType) {}

  pickRandom(): string | null {
    const herosLeft = this.herosLeft();

    if (herosLeft.length === 0) {
      return null;
    } else {
      const chosen = herosLeft[Math.floor(Math.random() * herosLeft.length)];
      this.herosUsed.push(chosen);
      return chosen;
    }
  }

  herosLeft(): string[] {
    return CHARS[this.type.name].filter(
      (hero) => !this.herosUsed.includes(hero)
    );
  }
}
