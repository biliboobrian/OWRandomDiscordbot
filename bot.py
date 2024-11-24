import discord
from discord.ext import commands
import random
import os

# Liste des personnages par rôle
HEALERS = ["Ana", "Baptiste", "Brigitte", "Kiriko", "Lifeweaver", "Lucio", "Mercy", "Moira", "Zenyatta", "Juno"]
DPS = ["Ashe", "Bastion", "Cassidy", "Echo", "Genji", "Hanzo", "Junkrat", "Mei", "Pharah", "Reaper", "Sojourn", "Soldier: 76", "Sombra", "Symmetra", "Torbjorn", "Tracer", "Widowmaker"]
TANKS = ["D.Va", "Doomfist", "Junker Queen", "Orisa", "Ramattra", "Reinhardt", "Roadhog", "Sigma", "Winston", "Wrecking Ball", "Zarya"]

intents = discord.Intents.default()
intents.messages = True
intents.message_content = True
bot = commands.Bot(command_prefix="!", intents=intents)

user_data = {}

def pick_random(role_list, played_list):
    available = [hero for hero in role_list if hero not in played_list]
    if not available:
        return None, role_list
    chosen = random.choice(available)
    played_list.append(chosen)
    return chosen, None

@bot.event
async def on_ready():
    print(f"Bot connecté en tant que {bot.user}.")

@bot.command(aliases=["h"])
async def healer(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data.setdefault(user_id, {"healer": [], "dps": [], "tank": []})
    chosen, reset = pick_random(HEALERS, user_data[user_id]["healer"])
    if reset:
        user_data[user_id]["healer"] = []
        chosen, _ = pick_random(HEALERS, user_data[user_id]["healer"])
        await ctx.send(f"Tous les soigneurs ont été joués, {username}. Le pool est réinitialisé.")
    await ctx.send(f"{username}, le healer choisi est : **{chosen}**")

@bot.command(aliases=["d"])
async def dps(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data.setdefault(user_id, {"healer": [], "dps": [], "tank": []})
    chosen, reset = pick_random(DPS, user_data[user_id]["dps"])
    if reset:
        user_data[user_id]["dps"] = []
        chosen, _ = pick_random(DPS, user_data[user_id]["dps"])
        await ctx.send(f"Tous les DPS ont été joués, {username}. Le pool est réinitialisé.")
    await ctx.send(f"{username}, le DPS choisi est : **{chosen}**")

@bot.command(aliases=["t"])
async def tank(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data.setdefault(user_id, {"healer": [], "dps": [], "tank": []})
    chosen, reset = pick_random(TANKS, user_data[user_id]["tank"])
    if reset:
        user_data[user_id]["tank"] = []
        chosen, _ = pick_random(TANKS, user_data[user_id]["tank"])
        await ctx.send(f"Tous les tanks ont été joués, {username}. Le pool est réinitialisé.")
    await ctx.send(f"{username}, le tank choisi est : **{chosen}**")

@bot.command(aliases=["hr"])
async def healer_reset(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data.setdefault(user_id, {"healer": [], "dps": [], "tank": []})
    user_data[user_id]["healer"] = []
    await ctx.send(f"Le pool des soigneurs a été réinitialisé pour {username}.")

@bot.command(aliases=["dr"])
async def dps_reset(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data.setdefault(user_id, {"healer": [], "dps": [], "tank": []})
    user_data[user_id]["dps"] = []
    await ctx.send(f"Le pool des DPS a été réinitialisé pour {username}.")

@bot.command(aliases=["tr"])
async def tank_reset(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data.setdefault(user_id, {"healer": [], "dps": [], "tank": []})
    user_data[user_id]["tank"] = []
    await ctx.send(f"Le pool des tanks a été réinitialisé pour {username}.")

@bot.command(aliases=["r"])
async def reset(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data[user_id] = {"healer": [], "dps": [], "tank": []}
    await ctx.send(f"Tous les pools ont été réinitialisés pour {username}.")

@bot.command(aliases=["hl"])
async def healers_left(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data.setdefault(user_id, {"healer": [], "dps": [], "tank": []})
    remaining = [f"**{hero}**" for hero in HEALERS if hero not in user_data[user_id]["healer"]]
    if remaining:
        await ctx.send(f"{username}, voici les soigneurs restants : {', '.join(remaining)}")
    else:
        await ctx.send(f"{username}, tous les soigneurs ont été joués ! Le pool est vide.")

@bot.command(aliases=["dl"])
async def dps_left(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data.setdefault(user_id, {"healer": [], "dps": [], "tank": []})
    remaining = [f"**{hero}**" for hero in DPS if hero not in user_data[user_id]["dps"]]
    if remaining:
        await ctx.send(f"{username}, voici les DPS restants : {', '.join(remaining)}")
    else:
        await ctx.send(f"{username}, tous les DPS ont été joués ! Le pool est vide.")

@bot.command(aliases=["tl"])
async def tanks_left(ctx):
    user_id = ctx.author.id
    username = ctx.author.name
    user_data.setdefault(user_id, {"healer": [], "dps": [], "tank": []})
    remaining = [f"**{hero}**" for hero in TANKS if hero not in user_data[user_id]["tank"]]
    if remaining:
        await ctx.send(f"{username}, voici les tanks restants : {', '.join(remaining)}")
    else:
        await ctx.send(f"{username}, tous les tanks ont été joués ! Le pool est vide.")

@bot.command()
async def moira(ctx):
    await ctx.send(f"Claire arrête de tricher !!")

@bot.command()
async def genji(ctx):
    await ctx.send(f"Mada Mada.")

@bot.command()
async def cassidy(ctx):
    await ctx.send(f"Merci poulette.")

@bot.command()
async def winston(ctx):
    await ctx.send(f"Winton !!")

@bot.command()
async def reinhardt(ctx):
    await ctx.send(f"Vrooooooooooooooommmmmmmmm.")

@bot.remove_command("help")
@bot.command()
async def help(ctx):
    help_text = """
**Liste des commandes disponibles :**
- `!h` ou `!healer` : Choisit un soigneur aléatoire.
- `!d` ou `!dps` : Choisit un DPS aléatoire.
- `!t` ou `!tank` : Choisit un tank aléatoire.
- `!hr` ou `!healer_reset` : Réinitialise le pool de soigneurs.
- `!dr` ou `!dps_reset` : Réinitialise le pool de DPS.
- `!tr` ou `!tank_reset` : Réinitialise le pool de tanks.
- `!r` ou `!reset` : Réinitialise tous les pools.
- `!hl` ou `!healers_left` : Affiche les soigneurs restants.
- `!dl` ou `!dps_left` : Affiche les DPS restants.
- `!tl` ou `!tanks_left` : Affiche les tanks restants.
"""
    await ctx.send(help_text)

@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, commands.CommandNotFound):
        await ctx.send(f"❌ La commande `{ctx.invoked_with}` n'est pas reconnue. Tapez `!help` pour voir la liste des commandes disponibles.")
    else:
        raise error

bot.run(os.getenv("DISCORD_TOKEN"))
