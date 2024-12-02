import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { UserData, db } from "../config/userData";
import { CharType } from "../enums/charType.enum";
import { Pool } from "../config/pool";

export class BotCommands {
  public message: Message<true>;
  private userId: string;
  private username: string;

  constructor(message: Message<true>) {
    this.message = message;
    this.userId = this.message.author.id;
    this.username = this.message.author.username;
  }

  async pick(
    type: CharType
  ): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    const body: string[] = [];
    const pool = this.getPoolInUserDb(type);

    const chosen = pool.pickRandom();
    if (pool.herosLeft().length === 0) {
      pool.herosUsed = [];
      body.push(
        `Tous les soigneurs ont été joués, ${this.username}. Le pool est réinitialisé.`
      );
    }
    body.push(`${this.username}, le soigneur choisi est : **${chosen}**`);

    return this.message.channel.send(body.join("\n"));
  }

  async reset(
    type: CharType
  ): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    this.resetPool(type);

    return this.message.reply(
      `Le pool des soigneurs a été réinitialisé pour ${this.username}.`
    );
  }

  async resetAll(): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    this.resetPool(CharType.Healer);
    this.resetPool(CharType.Dps);
    this.resetPool(CharType.Tank);

    return this.message.reply(
      `Tous les pools ont été réinitialisés pour ${this.username}.`
    );
  }

  async herosLeft(
    type: CharType
  ): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    const pool = this.getPoolInUserDb(type);

    return this.message.reply(
      `${this.username}, voici les heroes restants : ${pool
        .herosLeft()
        .join(", ")}`
    );
  }

  async help(): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    const helpText = `
**Liste des commandes disponibles :**
- \`!h\` ou \`!healer\` : Choisit un soigneur aléatoire.
- \`!d\` ou \`!dps\` : Choisit un DPS aléatoire.
- \`!t\` ou \`!tank\` : Choisit un tank aléatoire.
- \`!hr\` ou \`!healer_reset\` : Réinitialise le pool de soigneurs.
- \`!dr\` ou \`!dps_reset\` : Réinitialise le pool de DPS.
- \`!tr\` ou \`!tank_reset\` : Réinitialise le pool de tanks.
- \`!r\` ou \`!reset\` : Réinitialise tous les pools.
- \`!hl\` ou \`!healers_left\` : Affiche les soigneurs restants.
- \`!dl\` ou \`!dps_left\` : Affiche les DPS restants.
- \`!tl\` ou \`!tanks_left\` : Affiche les tanks restants.
    `;
    return this.message.reply(helpText);
  }

  private getPoolInUserDb(type: CharType): Pool {
    db[this.userId] ||= new UserData();
    return db[this.userId].getPool(type);
  }

  private resetPool(type: CharType): void {
    const pool = this.getPoolInUserDb(type);
    pool.herosUsed = [];
  }
}
