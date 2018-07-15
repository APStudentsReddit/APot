const { Inhibitor } = require('discord-akairo')

class BlacklistInhibitor extends Inhibitor {
  constructor () {
    super('blacklist', {
      reason: 'blacklist',
      type: 'post'
    })
  }

  async exec (message, command) {
    // Don't apply to DMs
    if (!message.guild) return true
    if (command.id === 'help') return false

    // Get the current guild's blacklisted memebers from the database
    const blacklist = await this.client.settings.get(message.guild.id, 'blacklist', [])

    // Check if the member is blacklisted, if they are, tell them they were blacklisted in DMs and abort the command
    if (blacklist.includes(message.member.id)) {
      message.author.send('You have been blacklisted from using me.')
      // eslint-disable-next-line no-throw-literal
      throw undefined
    }
  }
}

module.exports = BlacklistInhibitor
