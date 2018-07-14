const { Command } = require('discord-akairo')
const redis = require('../../structures/database.js')

class AddRoleAlias extends Command {
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

      // Fetch current roleAliases for this role from the database and make it parsable
      const roleAliases = await redis.db.hgetAsync(role.id, 'aliases') || '[]'
      let newAliasArray = JSON.parse(roleAliases)

      // Clean out the array of any alias matching args.alias
      newAliasArray = newAliasArray.filter(alias => alias !== args.alias.toLowerCase())

      // Update the database with the cleaned array and remove it from mappings
      await redis.db.hsetAsync(role.id, 'aliases', JSON.stringify(newAliasArray))
      await redis.db.hdelAsync(`${message.guild.id}.aliasMappings`, args.alias)

      // Tell the user that the role is not an alias anymore
      status.edit(`${message.author.toString()}, ${args.alias} is no longer a valid alias of ${role}`)
    } else {
      return message.reply('That\'s not a valid helper role. Please try again.')
    }
  }
}

module.exports = AddRoleAlias
