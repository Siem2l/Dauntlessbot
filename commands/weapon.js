exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
  const request = require("request");
  try{
    var weapontype;
    switch (args[args.length-1]){
      case "axe":
        weapontype = 0;
        break;
      case "chainblades":
        weapontype = 1;
        break;
      case "hammer":
        weapontype = 2;
        break;
      case "sword":
        weapontype = 3;
        break;
      case "warpike":
        weapontype = 4;
        break;
    }

  var regex = new RegExp( args[0]+".*", 'i');
    if (args.length == 2){
      var behemothfile = db.get("behemoths").find(behemoth => regex.test(behemoth.namedb)).value();;
    }else if (args.length == 3){
      var behemothfile = db.get("behemoths").find({namedb:`${args[0]} ${args[1]}`}).value();
  }
  if (args.length == 2){
    var weaponfile = db.get("weapons").find(weapon => regex.test(weapon.name)).value();;
  } else{
    var weaponfile = db.get("weapons").find(weapon => regex.test(weapon.name)).value();;
  }
  weaponfile = weaponfile.items[weapontype];

  console.log(weaponfile.icon_url)

        var embed = new Discord.RichEmbed();
    embed.setTitle("__"+ behemothfile.name + " (" + weaponfile.type +")__")
    .setThumbnail(weaponfile.icon_url)
    .setAuthor(weaponfile.name,"",weaponfile.wiki_url)
    .addField("Cellslots",weaponfile.cellslot01 + " & " + weaponfile.cellslot02,true)
    .addField("Element", weaponfile.element, true)
    if (weaponfile.bonuses != "None"){
    var bonuslist = ""
    for (let key in weaponfile.bonuses){
      bonuslist += `**+${weaponfile.bonuses[key]}** ` + key + "\n";
      }
    }else{
      var bonuslist = "None"
    }
    embed.addField ("Bonus(es)",bonuslist,true);
    if(weaponfile.upgraded_bonus != null){
    var upgbonuslist = ""
      for (let key in weaponfile.upgraded_bonus ){
        upgbonuslist += `**+${weaponfile.upgraded_bonus[key]}** ` + key + "\n";
      }
      embed.addField ("Upgraded Bonus(es)",upgbonuslist,true)
    }
    if(weaponfile.specials != "None"){
    var uniqueeffectstring = "";
      for (let key in weaponfile.specials){
        uniqueeffectstring += " • " + weaponfile.specials[key]
    }
    embed.addField("Unique Effect(s)",uniqueeffectstring)
    }
    message.channel.send({embed});


  } catch (err){
let guildinfo = client.getGuild.get(message.guild.id);
    let reply = `Please use \`\`${guildinfo.guildprefix}weapon <behemoth name> <weapon name>\`\` with a behemoth name from below:\n\`\`Gnasher, Shrike, Quillshot, Skarn, Charrogg, Embermane, Skraev, Drask, Nayzaga, Pangar, Hellion, Stormclaw, Kharabak, Ragetail Gnasher, Firebrand Charrogg, Shockjaw Nayzaga, Razorwing Kharabak, Frostback Pangar, Deadeye Quillshot, Bloodfire Embermane, Moonreaver Shrike, Rezakiri, Shrowd\`\`\n With a weapon from this list:\n \`\`axe, chainblades, hammer, sword, warpike\`\``
console.log(err);
  message.channel.send(reply);
  }
}
exports.conf = {
  name:"weapon",
  aliases: ["weapons"]
};
