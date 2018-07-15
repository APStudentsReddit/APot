const { Command } = require('discord-akairo')

class BlackListCommand extends Command {
  constructor () {
    super('blacklist', {
      aliases: ['blacklist', 'bean'],
      category: 'management',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: 'Who is getting (un)blacklisted?'
          }
        }
      ],
      userPermissions: ['MANAGE_ROLES'],
      channelRestriction: 'guild',
      description: {
        content: 'Blacklists someone from using all commands.',
        usage: '<user>',
        examples: ['naughtyboy#1234']
      }
    })
  }

  async exec (message, args) {
    // Make sure the person being blacklisted is not an admin
    if (args.member.permissions.has('ADMINISTRATOR')) return message.reply('You can\'t blacklist an admin. :frowning:')

    // Get the guild's blacklist if it exists or otherwise create it
    const blacklist = await this.client.settings.get(message.guild.id, 'blacklist', [])

    // Check if the user is already blacklisted and assume the intent of this command is to unblacklist them
    if (blacklist.includes(args.member.id)) {
      // Find the index of that one user in the array and remove it
      const index = blacklist.indexOf(args.member.id)
      blacklist.splice(index, 1)

      // Update the database with the new blacklist
      await this.client.settings.set(message.guild.id, 'blacklist', blacklist)

      // Tell the person running the command that they have been unblacklisted
      return message.reply(`${args.member} has been unblacklisted.`)
    } else {
      // Otherwise assume that they are to be blacklisted so therefore add them to the array
      blacklist.push(args.member.id)

      // Update the database with the new blacklist
      await this.client.settings.set(message.guild.id, 'blacklist', blacklist)

      // Tell the person running the command that they have been blacklisted
      return message.reply(`${args.member} has been blacklisted. <:banned:467377723799764992>`)
    }
  }
}

module.exports = BlackListCommand
