exports.run = (client, message, args, Discord) => {

  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);

try {
  var regex = new RegExp( args[0]+".*", 'i');
  var lanternfile = db.get("lanterns").find(lantern => regex.test(lantern.behemoth)).value();;
  var embed = new Discord.RichEmbed()
        .setAuthor(lanternfile.name)
        .setColor(0x00AE86)
        .setThumbnail("https://nireon.me/Lantern.png")
        .addField("Cellslot",lanternfile.cellslot)
        .addField("Instant",lanternfile.instant)
        .addField("Hold",lanternfile.hold);
  message.channel.send({embed});
}catch(err){
  message.channel.send("We could not find a behemoth with that name with a lantern try a behemoth from this list:\n `recruit`, `Shrike`,  `Skarn`, `Embermane`, `Drask`, `Pangar`")
}

}
exports.conf = {
  name:"lantern",
  aliases: ["lanterns"]
};
