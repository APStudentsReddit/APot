const { Command } = require('discord-akairo')

class MappingsCommand extends Command {
  constructor () {
    super('map', {
      aliases: ['mappings', 'm'],
      category: 'management',
      args: [],
      userPermissions: ['MANAGE_ROLES'],
      channelRestriction: 'guild',
      description: {
        content: 'Lists mappings of aliases'
      }
    })
  }

  async exec (message, args) {
    const status = await message.reply(`Fetching mappings...`)

    const mappings = await this.client.settings.get(message.guild.id, 'aliasMappings', {})
    const blacklist = await this.client.settings.get(message.guild.id, 'blacklist', [])

    let aliases = []

    for (var alias in mappings) {
      aliases.push(`${alias} : <@&${mappings[alias]}>`)
    }

    const embed = await this.client.util.embed()
      .addField('Prefix', await this.client.settings.get(message.guild.id, 'prefix', '>'))
      .addField('Blacklist', blacklist.length > 0 ? blacklist.map((id) => `<@${id}>`) : 'none')
      .addField('Aliases', aliases.length > 0 ? aliases.join('\n') : 'none')
      .setFooter(`requested by ${message.author.username}`, message.author.displayAvatarURL)
    await status.edit({ embed })
  }
}

module.exports = MappingsCommand
