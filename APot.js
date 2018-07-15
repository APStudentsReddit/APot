const { AkairoClient, SQLiteProvider } = require('discord-akairo')
const sqlite = require('sqlite')

class APotClient extends AkairoClient {
  constructor () {
    super({
      ownerID: '88410718314971136',
      prefix: message => {
        if (message.guild) {
          return this.settings.get(message.guild.id, 'prefix', '>')
        }

        return '>'
      },
      commandDirectory: './src/commands/',
      inhibitorDirectory: './src/inhibitors/',
      listenerDirectory: './src/listeners/',
      handleEdits: true,
      allowMention: true
    })
  }

  async login (token) {
    // Or, with sequelize
    this.settings = new SQLiteProvider(sqlite.open('./data.db'), 'data', {
      idColumn: 'guild_id',
      dataColumn: 'settings'
    })
    return this.settings.init().then(() => super.login(token))
  }
}

module.exports = APotClient
