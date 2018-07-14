const { Command } = require('discord-akairo')
const redis = require('../../structures/database.js')

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

    let mappings = await redis.db.hgetallAsync(`${message.guild.id}.aliasMappings`)
    let blacklist = await redis.db.hgetAsync(message.guild.id, 'blacklist')
    blacklist = JSON.parse(blacklist) || []

    let aliases = []

    for (var alias in mappings) {
      aliases.push(`${alias} : <@&${mappings[alias]}>`)
    }

    const embed = await this.client.util.embed()
      .addField('Blacklist', blacklist.length > 0 ? blacklist.map((id) => `<@${id}>`) : 'none')
      .addField('Aliases', aliases.length > 0 ? aliases.join('\n') : 'none')
      .setFooter(`requested by ${message.author.username}`, message.author.displayAvatarURL)
    await status.edit({ embed })
  }
}

module.exports = MappingsCommand
