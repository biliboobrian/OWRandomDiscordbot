import { Client, GatewayIntentBits } from "discord.js";
import { Bot } from "./bot";

if (!process.env.DISCORD_TOKEN) {
  throw "No DISCORD_TOKEN in env use 'set DISCORD_TOKEN=<your_token>' on windows and 'export DISCORD_TOKEN=<your_token>' on linux to set it.";
}

if (!process.env.SQLITE_PATH) {
  throw "No SQLITE_PATH in env.";
}
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const bot = new Bot(client, process.env.SQLITE_PATH);
bot.login(process.env.DISCORD_TOKEN);
