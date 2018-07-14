const { Command } = require('discord-akairo')
const redis = require('../../structures/database.js')

class AddRoleAlias extends Command {
  constructor () {
    super('create-role-alias', {
      aliases: ['add-role-alias', 'set-role-alias', 'addrolealias', 'addra', 'createra', 'add-alias'],
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
    if (rolesFound.size === 0) return message.reply(`${message.author}, found no roles matching that name. Try again`)

    // Make sure there is only 1 role matching the given role name
    if (rolesFound.size > 1) return message.reply('Found too many roles matching that name. Please try again with a more specific role name.')

    // Assume the role wanted is the first and only one in the Collection
    const role = rolesFound.first()

    // Make sure it is a helper role
    if (role.name.includes('Helper')) {
      // Send a status message
      const status = await message.reply(`Updating aliases for ${role.toString()}`)

      // Fetch current roleAliases for this role from the database and make it parsable
      let roleAliases = await redis.db.hgetAsync(role.id, 'aliases') || '[]'
      roleAliases = JSON.parse(roleAliases)

      // Check if this alias already exists
      if (roleAliases.indexOf(args.alias.toLowerCase()) !== -1) return status.edit(`${message.author}, That alias already exists for ${role.toString()}`)

      // Add the alias to the list of aliases available to that role and add it to the mappings
      roleAliases.push(args.alias.toLowerCase())
      await redis.db.hsetAsync(role.id, 'aliases', JSON.stringify(roleAliases))
      await redis.db.hsetAsync(`${message.guild.id}.aliasMappings`, args.alias.toLowerCase(), role.id).then(console.log)

      // Tell the user that the role is now an alias
      status.edit(`${message.author.toString()}, ${args.alias} is now a valid alias of ${role}`)
    } else {
      return message.reply('That\'s not a valid helper role. Please try again.')
    }
  }
}

module.exports = AddRoleAlias
