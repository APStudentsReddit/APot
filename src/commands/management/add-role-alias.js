const { Command } = require('discord-akairo')

class AddRoleAlias extends Command {
  constructor () {
    super('create-role-alias', {
      aliases: ['create-role-alias', 'add-role-alias', 'set-role-alias', 'addrolealias', 'addra', 'createra', 'add-alias'],
      category: 'management',
      split: 'sticky',
      args: [
        {
          id: 'helperRole',
          prompt: {
            start: 'Which helper role would you like to add an alias for?'
          },
          prefix: ['--role=', '--r', '-r='],
          match: 'prefix'

        },
        {
          id: 'alias',
          prompt: {
            start: 'What alias would you like to add?'
          },
          prefix: ['--alias=', '--a=', '-a='],
          match: 'prefix'
        }
      ],
      userPermissions: ['MANAGE_ROLES'],
      channelRestriction: 'guild',
      description: {
        content: 'Adds a helper role alias',
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

      // Check if this alias already exists
      if (dbRole.aliases.indexOf(args.alias.toLowerCase()) !== -1) return status.edit(`${message.author}, That alias already exists for ${role.toString()}`)

      // Add the alias to the list of aliases available to that role and add it to the mappings
      dbRole.aliases.push(args.alias.toLowerCase())
      dbRoles[role.id] = dbRole
      dbAliasMappings[args.alias.toLowerCase()] = role.id

      // Update the database with the new data from above
      await this.client.settings.set(message.guild.id, 'roles', dbRoles)
      await this.client.settings.set(message.guild.id, 'aliasMappings', dbAliasMappings)

      // Tell the user that the role is now an alias
      status.edit(`${message.author.toString()}, ${args.alias} is now a valid alias of ${role}`)
    } else {
      return message.reply('That\'s not a valid helper role. Please try again.')
    }
  }
}

module.exports = AddRoleAlias
