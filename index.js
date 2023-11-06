/* lidando com possiveis erros padroes */
process.on('uncaughtException', (err) => {
  if (err.code === 'MODULE_NOT_FOUND') {
    console.error(`Please install the modules using [ npm i ] to run your application.\n`, err.message);
  } else {
    console.error('Erro não capturado:', err);
  }
});
/* Usando modulos instalados */
const Discord = require("discord.js")
const config = require("./config.json")
const colors = require('colors');

const client = new Discord.Client({
  intents: [1, 512, 32768, 2, 128,
  Discord.IntentsBitField.Flags.DirectMessages,
  Discord.IntentsBitField.Flags.GuildInvites,
  Discord.IntentsBitField.Flags.GuildMembers,
  Discord.IntentsBitField.Flags.GuildPresences,
  Discord.IntentsBitField.Flags.Guilds,
  Discord.IntentsBitField.Flags.MessageContent,
  Discord.IntentsBitField.Flags.Guilds,
  Discord.IntentsBitField.Flags.GuildMessageReactions,
  Discord.IntentsBitField.Flags.GuildEmojisAndStickers
],
  partials: [
    Discord.Partials.User,
    Discord.Partials.Message,
    Discord.Partials.Reaction,
    Discord.Partials.Channel,
    Discord.Partials.GuildMember
  ]
});

module.exports = client

client.on('interactionCreate', (interaction) => {

  if (interaction.type === Discord.InteractionType.ApplicationCommand) {

    const cmd = client.slashCommands.get(interaction.commandName);

    if (!cmd) return interaction.reply(`Error`);

    interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

    cmd.run(client, interaction)

  }
})

client.slashCommands = new Discord.Collection()

require('./handler')(client)

if (!config.token) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log(colors.bgYellow(" warning "), colors.white("Or you can define your token in"), colors.grey("[ config.json ]"), colors.white("and the code will log in every time with this defined token"))
  rl.question(colors.green("- Enter your bot token here: "), async (token) => {
    config.token = token;
    rl.close();

    try {
      await client.login(token);
    } catch (error) {
      console.error(colors.red("Invalid token. Please provide a valid token."));
    }
  });
} else {
  client.login(config.token).catch(error => {
    if (error.code === "TokenInvalid") {
      console.error(colors.red("Invalid token. Please provide a valid token."))
    }
  })
}

const fs = require('fs');
const { error } = require("console");

fs.readdir('./events', (err, file) => {
  file.forEach(event => {
    require(`./events/${event}`)
  })
})