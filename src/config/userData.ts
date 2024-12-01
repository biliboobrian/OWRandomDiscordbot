import { CharType } from "../enums/charType.enum";
import { Pool } from "./pool";

export class UserData {
  public healers: Pool = new Pool(CharType.Healer);
  public dps: Pool = new Pool(CharType.Dps);
  public tanks: Pool = new Pool(CharType.Tank);

  getPool(type: CharType): Pool {
    switch (type) {
      case CharType.Healer:
        return this.healers;
      case CharType.Dps:
        return this.dps;
      case CharType.Tank:
        return this.tanks;
    }
  }
}

export const userDatas: Record<string, UserData> = {};
