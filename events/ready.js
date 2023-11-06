require('../index')

const Discord = require('discord.js')
const colors = require('colors');
const client = require('../index')
const { activity } = require("../config.json")

client.on('ready', () => {
    console.log(colors.bgGreen(" on-line "), `- I'am on-line in [`, colors.green(`${client.user.username}`), '];')
    client.user.setActivity(activity)
})