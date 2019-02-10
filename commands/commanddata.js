exports.run = (client, message, args, Discord) => {
  let data = client.getcommands.all()
  let statistics = '\`\`\`commandname'.padEnd(25) + 'amount\n'
  for (let i in data){
    statistics += `${data[i]['command']}`.padEnd(25) + `${data[i]['amount']}\n`
  }
  statistics += '\`\`\`'
  message.channel.send(statistics)
}
exports.conf = {
  name:"commanddata",
  aliases: ['cmddata']
};
