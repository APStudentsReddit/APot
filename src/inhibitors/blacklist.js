const { Inhibitor } = require('discord-akairo')
const redis = require('../structures/database')

class BlacklistInhibitor extends Inhibitor {
  constructor () {
    super('blacklist', {
      reason: 'blacklist',
      type: 'post'
    })
  }

  async exec (message) {
    // Get the current guild's blacklisted memebers from the Redis database
    var blacklist = await redis.db.hgetAsync(message.guild.id, 'blacklist') || '[]'

    // Make it parsable by turning it into a JSON-like structure
    blacklist = JSON.parse(blacklist)

    // Check if the member is blacklisted, if they are, tell them they were blacklisted in DMs and abort the command
    if (blacklist.includes(message.member.id)) {
      message.author.send('You were blacklisted so you can\'t use that command anymore')
      return false
    }
  }
}

module.exports = BlacklistInhibitor
