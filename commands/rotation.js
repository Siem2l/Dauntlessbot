exports.run = (client, message, args, Discord) => {
  const embed = new Discord.RichEmbed();
  embed.setDescription("After patch [0.5.7](https://playdauntless.com/patch-notes/ob-0-5-7) every dire behemoth will be available in the maelstrom.\nIf you want furthur explanation why this change happened check this [link](https://playdauntless.com/news/shifting-skies-the-maelstrom).")
  .setColor('0xe1ec13');
    return message.channel.send({embed})
      }
exports.conf = {
  name:"rotation",
  aliases: ['rot']
};
