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

    const blacklist = await this.client.settings.get(message.guild.id, 'blacklist', [])

    const helperRoles = await message.guild.roles.filter(role => role.name.toLowerCase().includes('helper')).sort((a, b) => { if (a.name < b.name) return -1; if (a.name > b.name) return 1; return 0 })

    let aliases = []

    await helperRoles.map(async (role) => {
      const dbRole = await this.client.settings.get(message.guild.id, 'roles', {})[role.id] || {}
      let roleAliases
      if (dbRole.aliases) {
        roleAliases = dbRole.aliases.join(', ')
      } else {
        roleAliases = 'none'
      }
      aliases.push(`<@&${role.id}> : ${roleAliases}`)
      if (aliases.join('\n').length >= 2000) {
        aliases = aliases.slice(0, -1)
        message.channel.send(aliases.join('\n'))
        aliases = []
        aliases.push(`<@&${role.id}> : ${roleAliases}`)
      }
    })

    if (aliases.length > 0) {
      message.channel.send(aliases)

      const embed = await this.client.util.embed()
        .addField('Prefix', await this.client.settings.get(message.guild.id, 'prefix', '>'))
        .addField('Blacklist', blacklist.length > 0 ? blacklist.map((id) => `<@${id}>`) : 'none')
        .setFooter(`requested by ${message.author.username}`, message.author.displayAvatarURL)
      await status.edit({ embed })
    } else {
      const embed = await this.client.util.embed()
        .addField('Prefix', await this.client.settings.get(message.guild.id, 'prefix', '>'))
        .addField('Blacklist', blacklist.length > 0 ? blacklist.map((id) => `<@${id}>`) : 'none')
        .addField('Aliases: ', aliases)
        .setFooter(`requested by ${message.author.username}`, message.author.displayAvatarURL)
      await status.edit({ embed })
    }
  }
}

module.exports = MappingsCommand
