import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from "./bot";

if (!process.env.DISCORD_TOKEN) {
  throw "No discord token in env use 'set DISCORD_TOKEN=<your_token>' on windows and 'export DISCORD_TOKEN=<your_token>' on linux to set it.";
}
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const bot = new Bot(client);
bot.login(process.env.DISCORD_TOKEN);
