import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { UserData, db } from "../config/userData";
import { CharType, CharTypeName } from "../enums/charType.enum";
import { Pool } from "../config/pool";
import { Stats, UserStats } from "../config/stats";

export class BotCommands {
  private userId: string;
  private username: string;

  constructor(private message: Message<true>, private stats: Stats) {
    this.userId = this.message.author.id;
    this.username = this.message.author.username;
  }

  async pick(
    type: CharType
  ): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    const body: string[] = [];
    const pool = this.getPoolInUserDb(type);

    if (pool.herosLeft().length === 0) {
      pool.herosUsed = [];
      body.push(
        `Tous les ${type.plurial} ont été joués, ${this.username}. Le pool est réinitialisé.`
      );
    }
    const chosen = pool.pickRandom();
    if (chosen) {
      this.stats.addCountOnHero(this.userId, type.name, chosen);
      body.push(
        `${this.username}, le  ${type.singular} choisi est : **${chosen}**`
      );
    }

    return this.message.channel.send(body.join("\n"));
  }

  async reset(
    type: CharType
  ): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    this.resetPool(type);

    return this.message.channel.send(
      `Le pool des ${type.plurial} a été réinitialisé pour ${this.username}.`
    );
  }

  async resetAll(): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    this.resetPool(CharType.Healer);
    this.resetPool(CharType.Dps);
    this.resetPool(CharType.Tank);

    return this.message.channel.send(
      `Tous les pools ont été réinitialisés pour ${this.username}.`
    );
  }

  async herosLeft(
    type: CharType
  ): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    const pool = this.getPoolInUserDb(type);

    return this.message.channel.send(
      `${this.username}, voici les heroes restants : ${pool
        .herosLeft()
        .join(", ")}`
    );
  }

  async usersStats(
    type: CharType
  ): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    const rows = await this.stats.getUserStatisticByRole(
      this.userId,
      type.name
    );
    const totalSelections = rows.reduce((acc, row) => acc + row.count, 0);
    const messageContent: string[] = [];
    messageContent.push(
      `**Statistiques de sélection des héros pour les ${type.plurial}**`
    );
    messageContent.push(`- Total : **${totalSelections}**`);

    for (const row of rows) {
      const percentage = ((row.count / totalSelections) * 100).toFixed(2);
      messageContent.push(`- ${row.count}: ${row.hero} (${percentage}%)`);
    }

    return this.message.channel.send(messageContent.join("\n"));
  }

  async usersAllStats(): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    const rows = await this.stats.getUserStatistic(this.userId);
    const totalSelections = rows.reduce((acc, row) => acc + row.count, 0);
    const healersStats = rows.filter((row) => row.role === CharTypeName.Healer);
    const dpsStats = rows.filter((row) => row.role === CharTypeName.Dps);
    const tanksStats = rows.filter((row) => row.role === CharTypeName.Tank);
    const messageContent: string[] = [];
    messageContent.push(`**Statistiques de sélection des héros**`);
    messageContent.push(`- Total : **${totalSelections}**`);

    this.addStats(healersStats, CharType.Healer, messageContent);
    this.addStats(dpsStats, CharType.Dps, messageContent);
    this.addStats(tanksStats, CharType.Tank, messageContent);

    return this.message.channel.send(messageContent.join("\n"));
  }

  private addStats(
    rows: UserStats[],
    chartype: CharType,
    messageContent: string[]
  ): void {
    const totalSelections = rows.reduce((acc, row) => acc + row.count, 0);

    messageContent.push(
      `**Statistiques de sélection des héros: ${chartype.plurial}**`
    );

    for (const row of rows) {
      const percentage = ((row.count / totalSelections) * 100).toFixed(2);
      messageContent.push(`- ${row.count}: ${row.hero} (${percentage}%)`);
    }
  }

  async help(): Promise<OmitPartialGroupDMChannel<Message<true>>> {
    const helpText = `
**Liste des commandes disponibles :**
- \`!h\` ou \`!healer\` : Choisit un soigneur aléatoire.
- \`!d\` ou \`!dps\` : Choisit un DPS aléatoire.
- \`!t\` ou \`!tank\` : Choisit un tank aléatoire.
- \`!hr\` ou \`!healers_reset\` : Réinitialise le pool de soigneurs.
- \`!dr\` ou \`!dps_reset\` : Réinitialise le pool de DPS.
- \`!tr\` ou \`!tanks_reset\` : Réinitialise le pool de tanks.
- \`!r\` ou \`!reset\` : Réinitialise tous les pools.
- \`!hl\` ou \`!healers_left\` : Affiche les soigneurs restants.
- \`!dl\` ou \`!dps_left\` : Affiche les DPS restants.
- \`!tl\` ou \`!tanks_left\` : Affiche les tanks restants.
- \`!hs\` ou \`!healers_stats\` : Affiche les stats soigneurs.
- \`!ds\` ou \`!dps_stats\` : Affiche les stats DPS.
- \`!ts\` ou \`!tanks_stats\` : Affiche les stats tanks.
    `;
    return this.message.channel.send(helpText);
  }

  private getPoolInUserDb(type: CharType): Pool {
    db[this.userId] ||= new UserData();
    return db[this.userId].getPool(type.name);
  }

  private resetPool(type: CharType): void {
    const pool = this.getPoolInUserDb(type);
    pool.herosUsed = [];
  }
}
