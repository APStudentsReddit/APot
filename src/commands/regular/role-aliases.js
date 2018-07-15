const { Command } = require('discord-akairo')

class AddRoleAlias extends Command {
  constructor () {
    super('role-aliases', {
      aliases: ['ls-role-alias', 'ls'],
      category: 'regular',
      quoted: true,
      args: [
        {
          id: 'role',
          type: 'string',
          prompt: {
            start: 'Which helper role would you like to list aliases for?'
          },
          match: 'content'
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

    const rolesFound = await message.guild.roles.filter(a => a.name.toLowerCase().includes(args.role.toLowerCase()))
    if (rolesFound.size === 0) return status.edit(`${message.author}, sorry. I didn't found any roles matching that name.`)
    if (rolesFound.size > 1) return status.edit(`${message.author}, Found too many roles matching that name. Please try again with a more specific role name.`)

    const roleId = rolesFound.first().id

    const roleData = (await this.client.settings.get(message.guild.id, 'roles', {}))[roleId]

    if (!roleData) {
      return status.edit(`${message.author.toString()}, ${rolesFound.first().toString()} has no aliases.`)
    }

    status.edit(`${message.author.toString()}, The aliases for ${rolesFound.first().toString()} are: ${roleData.join(', ')}`)
  }
}

module.exports = AddRoleAlias
