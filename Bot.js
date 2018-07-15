const APot = require('./APot')
const bot = new APot()

bot.login(process.env.TOKEN).then(() => {
  console.log('Logged in! Woo!')
})
