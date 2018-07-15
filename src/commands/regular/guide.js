const { Command } = require('discord-akairo')

class GuideCommand extends Command {
  constructor () {
    super('guide', {
      aliases: ['guide', 'usage', 'g'],
      clientPermissions: ['EMBED_LINKS'],
      quoted: false,
      category: 'regular',
      args: [],
      description: {
        content: 'Displays a guide showing how to use this bot.',
        usage: '[command]',
        examples: ['', 'blacklist', 'request-helper']
      }
    })
  }

  exec (message) {
    const prefix = this.client.settings.get(message.guild.id, 'prefix', '>')

    const embed = this.client.util.embed()
      .setColor('#00a8ff')
      .addField('Primary Commands', [`${prefix}createra`, `${prefix}deletera`, `${prefix}ls`, `${prefix}rhelper`, `${prefix}blacklist`])
      .addField(':heavy_plus_sign: Set up role aliases by doing: ', [
        `\`${prefix}createra --role="role name" --alias="alias"\``,
        `\`${prefix}addra --r="role name" --a="alias"\``
      ])
      .addField(':heavy_minus_sign: Delete role aliases by doing: ', [
        `\`${prefix}deletera --role="role name" --alias="alias"\``,
        `\`${prefix}deletera --r="role name" --a="alias"\``
      ])
      .addField(':repeat: List all role role aliases for a single role by doing: ', `\`${prefix}ls Role Name\``)
      .addField('<:ping:467729523857948682> To mention a role, run: ', [`\`${prefix}rhelper role alias\``, `\`${prefix}helper role alias\``])
      .addField('<:banned:467377723799764992> To blacklist or to unblacklist someone, run: ', `\`${prefix}blacklist member\``)
    message.channel.send({ embed }).then((msg) => msg.delete(13000))
  }
}

module.exports = GuideCommand
