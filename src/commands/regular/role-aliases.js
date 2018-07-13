const { Command } = require('discord-akairo')
const redis = require('../../structures/database.js')

class AddRoleAlias extends Command {
  constructor () {
    super('role-aliases', {
      aliases: ['ls-role-alias', 'ls'],
      category: 'regular',
      args: [
        {
          id: 'role',
          type: 'roles',
          prompt: {
            start: 'Which helper role would you like to list aliases for?'
          }
        }
      ],
      channelRestriction: 'guild',
      description: {
        content: 'Lists role aliases for helper pings.',
        usage: '<role>',
        examples: ['Computer Science Helper']
      }
    })
  }

  async exec (message, args) {
    const status = await message.reply(`Fetching aliases…`)

    if (args.role.size > 1) return status.edit(`${message.author}, Found too many roles matching that name. Please try again with a more specific role name.`)

    const roleId = args.role.first().id

    const aliases = JSON.parse(await redis.db.hgetAsync(roleId, 'aliases'))

    if (!aliases) {
      return status.edit(`${message.author.toString()}, ${args.role.first().toString()} has no aliases.`)
    }

    status.edit(`${message.author.toString()}, The aliases for ${args.role.first().toString()} are: ${aliases.join(', ')}`)
  }
}

module.exports = AddRoleAlias
