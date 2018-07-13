/**
 * stole this one too because i was lazy
*/

const { Command } = require('discord-akairo')

class HelpCommand extends Command {
  constructor () {
    super('help', {
      aliases: ['help', 'halp', 'h'],
      clientPermissions: ['EMBED_LINKS'],
      quoted: false,
      category: 'regular',
      args: [
        {
          id: 'command',
          type: 'commandAlias',
          prompt: {
            start: 'Which command do you need help with?',
            retry: 'Please provide a valid command.',
            optional: true
          }
        }
      ],
      description: {
        content: 'Displays a list of commands or information about a command.',
        usage: '[command]',
        examples: ['', 'blacklist', 'request-helper']
      }
    })
  }

  exec (message, { command }) {
    if (!command) return this.execCommandList(message)

    const prefix = this.handler.prefix(message)
    const description = Object.assign({
      content: 'No description available.',
      usage: '',
      examples: [],
      fields: []
    }, command.description)

    const embed = this.client.util.embed()
      .setColor(0xFFAC33)
      .setTitle(`\`${prefix}${command.aliases[0]} ${description.usage}\``)
      .addField('Description', description.content)

    for (const field of description.fields) embed.addField(field.name, field.value)

    if (description.examples.length) {
      const text = `${prefix}${command.aliases[0]}`
      embed.addField('Examples', `\`${text} ${description.examples.join(`\`\n\`${text} `)}\``, true)
    }

    if (command.aliases.length > 1) {
      embed.addField('Aliases', `\`${command.aliases.join('` `')}\``, true)
    }

    return message.channel.send({ embed })
  }

  async execCommandList (message) {
    const embed = this.client.util.embed()
      .setColor(0xFFAC33)
      .addField('Command List',
        [
          'This is a list of commands.',
          'To view details for a command, do `>help <command>`.'
        ]
      )

    for (const category of this.handler.categories.values()) {
      const title = {
        regular: 'Regular',
        owner: 'Owner',
        management: 'Management'
      }[category.id]

      if (title) embed.addField(title, `\`${category.map(cmd => cmd.aliases[0]).join('` `')}\``)
    }

    const shouldReply = message.guild && message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')

    try {
      await message.author.send({ embed })
      if (shouldReply) return message.reply('I\'ve sent you a DM with the command list.')
    } catch (err) {
      if (shouldReply) return message.reply('I could not send you the command list in DMs.')
    }

    return undefined
  }
}

module.exports = HelpCommand
