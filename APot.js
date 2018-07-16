const { AkairoClient, SQLiteProvider } = require('discord-akairo')
const sqlite = require('sqlite')
const SQLite = require('better-sqlite3')
const sql = new SQLite('./data.db')

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

  build () {
    // Check if the table "data" exists.
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'data';").get()
    if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
      sql.prepare('CREATE TABLE `data` ( `guild_id` TEXT NOT NULL UNIQUE, `settings` TEXT );').run()
      // Ensure that the "id" row is always unique and indexed.
      sql.prepare('CREATE UNIQUE INDEX idx_guild_id ON data (guild_id);').run()
    }
  }

  async login (token) {
    await this.build()
    this.settings = new SQLiteProvider(sqlite.open('./data.db'), 'data', {
      idColumn: 'guild_id',
      dataColumn: 'settings'
    })
    return this.settings.init().then(() => super.login(token))
  }
}

module.exports = APotClient
