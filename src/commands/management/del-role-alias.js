const { Command } = require('discord-akairo')

class DelRoleAlias extends Command {
  constructor () {
    super('delete-role-alias', {
      aliases: ['delete-role-alias', 'del-role-alias', 'rm-role-alias', 'deleterolealias', 'deletera', 'rmra', 'delete-alias', 'rm-alias'],
      category: 'management',
      split: 'sticky',
      args: [
        {
          id: 'helperRole',
          prompt: {
            start: 'Which helper role would you like to remove an alias from?'
          },
          prefix: '--role=',
          match: 'prefix'
        },
        {
          id: 'alias',
          prompt: {
            start: 'Which alias would you like to remove?'
          },
          prefix: '--alias=',
          match: 'prefix'
        }
      ],
      userPermissions: ['MANAGE_ROLES'],
      channelRestriction: 'guild',
      description: {
        content: 'Deletes a helper role alias',
        usage: '--role="<helper role>" --alias="<alias>"'
      }
    })
  }

  async exec (message, args) {
    // Find all roles with matching the role name given
    const rolesFound = await message.guild.roles.filter(a => a.name.toLowerCase().includes(args.helperRole.toLowerCase()))

    // Mke sure we do find a role
    if (rolesFound.size === 0) return message.reply(`found no roles matching that name. Try again`)

    // Make sure there is only 1 role matching the given role name
    if (rolesFound.size > 1) return message.reply('Found too many roles matching that name. Please try again with a more specific role name.')

    // Assume the role wanted is the first and only one in the Collection
    const role = rolesFound.first()

    // Make sure it is a helper role
    if (role.name.includes('Helper')) {
      // Send a status message
      const status = await message.reply(`Updating aliases for ${role.toString()}`)

      // Fetch current roleAliases for this role from the database or create a temporary object if it does not exist
      const dbRoles = await this.client.settings.get(message.guild.id, 'roles', {})
      const dbRole = dbRoles[role.id] || { aliases: [] }

      // Fetch current aliasMappings from database
      const dbAliasMappings = await this.client.settings.get(message.guild.id, 'aliasMappings', {})

      // Clean out the array of any alias matching args.alias
      dbRole.aliases = dbRole.aliases.filter(alias => alias !== args.alias.toLowerCase())
      dbRoles[role.id] = dbRole
      delete dbAliasMappings[args.alias.toLowerCase()]

      // Update the database with the new data from above
      await this.client.settings.set(message.guild.id, 'roles', dbRoles)
      await this.client.settings.set(message.guild.id, 'aliasMappings', dbAliasMappings)

      // Tell the user that the role is not an alias anymore
      status.edit(`${message.author.toString()}, ${args.alias} is no longer a valid alias of ${role}`)
    } else {
      return message.reply('That\'s not a valid helper role. Please try again.')
    }
  }
}

module.exports = DelRoleAlias
