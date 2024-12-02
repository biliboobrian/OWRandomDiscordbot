export enum CharTypeName {
  Healer = "HEALER",
  Dps = "DPS",
  Tank = "TANK",
}

export class CharType {
  static Healer = new CharType(CharTypeName.Healer, "Soigneur", "Soigneurs");
  static Dps = new CharType(CharTypeName.Dps, "Dps", "Dps");
  static Tank = new CharType(CharTypeName.Tank, "Tanks", "Tanks");

  constructor(
    public name: CharTypeName,
    public singular: string,
    public plurial: string
  ) {}
}
