const { Command } = require('discord-akairo')
const redis = require('../../structures/database.js')
const moment = require('moment')

class RequestHelperCommand extends Command {
  constructor () {
    super('request-helper', {
      aliases: ['rhelper'],
      category: 'regular',
      args: [
        {
          id: 'helperRole',
          type: 'string',
          prompt: {
            start: 'Which helpers would you like to ping?'
          }
        }
      ],
      clientPermissions: ['MANAGE_ROLES'],
      channelRestriction: 'guild',
      description: {
        content: 'Requests a helper. Can only be used once an hour.',
        usage: '<helper role alias>',
        examples: ['csa', 'calc bc']
      }
    })
  }

  async exec (message, args) {
    // Get time remaining in milliseconds by subtracting current time in milliseconds (from epoch) from the last helper ping time
    const timePassed = Date.now() - parseInt(await redis.db.hgetAsync(message.author.id, 'lastHelperPing'))

    // If an hour (3600000 milliseconds) has not passed since last ping, return a message giving them time remaining
    if (timePassed < 3600000) return message.reply(`You've pinged a helper role within the last hour. Please try again ${moment().to(parseInt(await redis.db.hgetAsync(message.author.id, 'lastHelperPing')) + 3600000)}`).then(msg => msg.delete(5000))

    // Go to the mapped list of aliases and find the roleId that corresponds with the alias
    const roleIdToPing = await redis.db.hgetAsync('aliasMappings', args.helperRole.toLowerCase())

    // Convert the role id into an actual role object
    const role = message.guild.roles.get(roleIdToPing)

    // Check if there is only 1 helper role matching that name
    if (role) {
      // Send a status message
      const status = await message.reply(`Attempting to ping ${role.name}s!`)

      // Make sure it is a helper role
      if (!role.name.includes('Helper')) return message.reply('That is not a valid helper role.')

      // Make the role mentionable, mention the helpers, and then make the role unmentionable
      await role.setMentionable(true, `Requested by: ${message.author.username} (${message.author.id})`)
      await message.channel.send(`${message.author} has requested a ${role.toString()}`)
      await role.setMentionable(false, `Requested by: ${message.author.username} (${message.author.id})`)

      // Delete the status message
      await status.delete()

      // Mark the current time in milliseconds as the last time this person pinged a helper
      await redis.db.hsetAsync(message.author.id, 'lastHelperPing', Date.now())
    } else {
      return message.reply('That\'s not a valid alias for pinging a helper role. Please try again.')
    }
  }
}

module.exports = RequestHelperCommand