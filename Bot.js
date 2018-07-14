const { AkairoClient } = require('discord-akairo')

const client = new AkairoClient({
  ownerID: '88410718314971136',
  prefix: '>',
  commandDirectory: './src/commands/',
  inhibitorDirectory: './src/inhibitors/',
})

client.login(process.env.TOKEN).then(() => {
  console.log('Logged in! Woo!')
})
