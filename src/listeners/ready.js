const { Listener } = require('discord-akairo')
const SQLite = require('better-sqlite3')
const sql = new SQLite('./data.db')

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      eventName: 'ready'
    })
  }

  exec () {
  // Check if the table "data" exists.
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'data';").get()
    if (!table['count(*)']) {
    // If the table isn't there, create it and setup the database correctly.
      sql.prepare('CREATE TABLE `data` ( `guild_id` TEXT NOT NULL UNIQUE, `settings` TEXT );').run()
      // Ensure that the "id" row is always unique and indexed.
      sql.prepare('CREATE UNIQUE INDEX idx_guild_id ON data (guild_id);').run()
    }

    console.log('I am ready, captain!')
  }
}

module.exports = ReadyListener
