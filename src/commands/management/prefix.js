const { Command } = require('discord-akairo')

class PrefixCommand extends Command {
  constructor () {
    super('prefix', {
      aliases: ['prefix'],
      category: 'management',
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'prefix',
          optional: true
        }
      ],
      channelRestriction: 'guild'
    })
  }

  async exec (message, args) {
    // If prefix argument is not given, then assume the user is looking for current prefix
    if (args.prefix === '') {
      const prefix = this.client.settings.get(message.guild.id, 'prefix', '>')
      return message.reply(`the prefix for this server is: \`${prefix}\``)
    }

    // Make sure member is a server admin
    if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply("You are not authorized to change this server's prefix.")

    // Otherwise set the current guild prefix to args.prefix
    await this.client.settings.set(message.guild.id, 'prefix', args.prefix)

    if (args.prefix === '>') return message.reply('Prefix has been reset to `>`')
    return message.reply(`Prefix has been set to \`${args.prefix}\``)
  }
}

module.exports = PrefixCommand
