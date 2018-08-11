exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
  const request = require("request");
  let weaponcreate = function(weaponfile,weapontype){
    var embed = new Discord.RichEmbed();
    embed.setTitle("__"+ weaponfile.name + "__")
    weaponfile = weaponfile.items[weapontype]
    embed.setThumbnail(weaponfile.icon_url)
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
    return{embed};
  }
  try{
    var weapontype = -1;
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

    if (weapontype > -1){
      args.pop()
      let string = args.join().split(',').join(' ')
      let regex  = new RegExp(string+'.*','i')
      weaponfile = db.get("weapons").find(function(o) {return regex.test(o.name)}).value();
      let embed = weaponcreate(weaponfile,weapontype)
      if (embed){
        return message.channel.send(embed)
      }
    }
    else {
      let string = args.join().split(',').join(' ')
      let regex  = new RegExp(string+'.*','i')
      weaponfile = db.get("weapons").find(function(o) {for (i in o["itemnames"]){if (regex.test(o['itemnames'][i])){return true;}}return false}).value();
      weaponpiece = weaponfile.itemnames.findIndex(function (o){return regex.test(o)})
      let embed = weaponcreate(weaponfile,weaponpiece)
      if (embed){
        return message.channel.send(embed)
      }
    }

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
