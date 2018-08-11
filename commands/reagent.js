exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
  if (args.length == 2){
    regex = new RegExp( args[0]+ " " + args[1]+".*", 'i');
    reagentfile = db.get("reagents").find(function(o) {for (i in o["reagentnames"]){if (regex.test(o['reagentnames'][i])){return true;}}return false}).value();
  }
  else{
      regex = new RegExp( args[0]+".*", 'i');
      reagentfile = db.get("reagents").find(function(o) {for (i in o["reagentnames"]){if (regex.test(o['reagentnames'][i])){return true;}}return false}).value();
}
let reagentindex = reagentfile.reagentnames.findIndex(function (o){return regex.test(o)})
let embed = new Discord.RichEmbed();
embed.setAuthor(reagentfile.reagentnames[reagentindex],"",'https://dauntless.gamepedia.com/Reagents')
.setDescription(reagentfile.reagents[reagentindex]['description'])
.addField("Obtained from",`${reagentfile.name} - ${reagentfile.reagents[reagentindex]['droppart']}\u200B`,true)
.addField("| Rarity",`**|** ${reagentfile.reagents[reagentindex]['rarity']}`,true)
return message.channel.send({embed})
}
exports.conf = {
  name:"reagent",
  aliases: ["reagents"]
};
