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

    const mappings = await redis.db.hgetallAsync(`${message.guild.id}.aliasMappings`)
    let blacklist = await redis.db.hgetAsync(message.guild.id, 'blacklist')
    blacklist = JSON.parse(blacklist)
    status.edit('aliases: ' + JSON.stringify(mappings))
    message.channel.send('blacklist: ' + blacklist.join(', '))
  }
}

module.exports = MappingsCommand
