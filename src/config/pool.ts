import { CharType } from "../enums/charType.enum";
import { CHARS } from "./chars";

export class Pool {
  herosUsed: string[] = [];
  type: CharType;

  constructor(type: CharType) {
    this.type = type;
  }

  pickRandom(): string | null {
    const herosLeft = this.herosLeft();

    if (herosLeft.length === 0) {
      return null;
    }
    const chosen = herosLeft[Math.floor(Math.random() * herosLeft.length)];
    this.herosUsed.push(chosen);
    return chosen;
  }

  herosLeft(): string[] {
    return CHARS[this.type].filter((hero) => !this.herosUsed.includes(hero));
  }
}
