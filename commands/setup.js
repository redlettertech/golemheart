const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Database = require("@replit/database");
const db = new Database();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup Golemheart')
    .addSubcommand(subcommand =>
      subcommand
        .setName('wishlist')
        .setDescription('Wishlist command settings')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Select a channel')
            .setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('brew')
        .setDescription('Brew command settings')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Select a channel')
            .setRequired(true))
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.reply({ content: `You must be an administrator to use this command.`, ephemeral: true });
      return;
    }

    if (interaction.options.getSubcommand() === 'wishlist') {
      const guildObject = await db.get('g' + interaction.guild.id);
      if (guildObject == null) {
        const guildObjectNew = {
          wishlist_channel: channel.id,
        }
        await db.set('g' + interaction.guild.id, guildObjectNew);
      } else {
        guildObject.wishlist_channel = channel.id;
        await db.set('g' + interaction.guild.id, guildObject);
      }
      //console.log(`Setup - Wishlist channel set to ${channel}.`);
      await interaction.reply({ content: `Wishlists will be sent to the ${channel} channel.`, ephemeral: true });

    } else if (interaction.options.getSubcommand() === 'brew') {
      const guildObject = await db.get('g' + interaction.guild.id);
      if (guildObject == null) {
        const guildObjectNew = {
          brew_channel: channel.id,
        }
        await db.set('g' + interaction.guild.id, guildObjectNew);
      } else {
        guildObject.brew_channel = channel.id;
        await db.set('g' + interaction.guild.id, guildObject);
      }
      //console.log(`Setup - Brew channel set to ${channel}.`);
      await interaction.reply({ content: `Brewing threads will be created in the ${channel} channel.`, ephemeral: true });
    }
  },
};
