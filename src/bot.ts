import { Client, Message } from "discord.js";
import { BotCommands } from "./comands/bot-commands";
import { CharType } from "./enums/charType.enum";
import { Stats } from "./config/stats";

export class Bot {
  private stats: Stats;

  constructor(private client: Client, dbPath: string) {
    this.stats = new Stats(dbPath);

    this.client.once("ready", () => {
      console.log(`Bot connecté en tant que ${client.user?.tag}`);
    });

    this.client.on("messageCreate", async (message: Message) => {
      if (message.inGuild()) {
        if (!message.content.startsWith("!")) return;
        const args = message.content.slice(1).trim().split(/ +/);
        const command = args.shift()?.toLowerCase();
        if (!command) return;

        const botCommands = new BotCommands(message, this.stats);

        switch (command) {
          case "h":
          case "healer":
            await botCommands.pick(CharType.Healer);
            break;
          case "d":
          case "dps":
            await botCommands.pick(CharType.Dps);
            break;
          case "t":
          case "tank":
            await botCommands.pick(CharType.Tank);
            break;
          case "hr":
          case "healer_reset":
            await botCommands.reset(CharType.Healer);
            break;
          case "dr":
          case "dps_reset":
            await botCommands.reset(CharType.Dps);
            break;
          case "tr":
          case "tank_reset":
            await botCommands.reset(CharType.Tank);
            break;
          case "r":
          case "reset":
            await botCommands.resetAll();
            break;
          case "hl":
          case "healers_left":
            await botCommands.herosLeft(CharType.Healer);
            break;
          case "dl":
          case "dps_left":
            await botCommands.herosLeft(CharType.Dps);
            break;
          case "tl":
          case "tanks_left":
            await botCommands.herosLeft(CharType.Tank);
            break;
          case "tl":
          case "tanks_left":
            await botCommands.help();
            break;
          case "hs":
          case "healers_stats":
            await botCommands.usersStats(CharType.Healer);
            break;
          case "ds":
          case "dps_stats":
            await botCommands.usersStats(CharType.Dps);
            break;
          case "ts":
          case "tanks_stats":
            await botCommands.usersStats(CharType.Tank);
            break;
          case "s":
          case "stats":
            await botCommands.usersAllStats();
            break;
          case "help":
            await botCommands.help();
            break;
          default:
            await message.reply(
              "Commande inconnue. Tapez `!help` pour voir les commandes disponibles."
            );
        }
      }
    });
  }

  login(discordToken: string): void {
    this.client.login(discordToken);
  }
}
