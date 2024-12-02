import { CharType, CharTypeName } from "../enums/charType.enum";
import { Pool } from "./pool";

export class UserData {
  public healers: Pool = new Pool(CharType.Healer);
  public dps: Pool = new Pool(CharType.Dps);
  public tanks: Pool = new Pool(CharType.Tank);

  getPool(type: CharTypeName): Pool {
    switch (type) {
      case CharTypeName.Healer:
        return this.healers;
      case CharTypeName.Dps:
        return this.dps;
      case CharTypeName.Tank:
        return this.tanks;
    }
  }
}

export const db: Record<string, UserData> = {};
