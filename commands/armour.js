exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
  let armourcreate = function(armourfile,armourpiece){
    var embed = new Discord.RichEmbed();
    embed.setTitle("__"+ armourfile.boss  + "__")
    armourfile = armourfile.items[armourpiece]
    embed.setThumbnail(armourfile.icon_url)
    .setAuthor(armourfile.name,"",armourfile.wiki_url)
    .addField("Cellslot",armourfile.cellslot)
    .addField("Element", armourfile.element, true)
    .addField("Weakness",armourfile.weakness,true);
    console.log(armourfile)
    if (armourfile.bonuses != "None"){
    var bonuslist = ""
    for (let key in armourfile.bonuses){
      bonuslist += `**+${armourfile.bonuses[key]}** ` + key + "\n";

      }
    }else{
      var bonuslist = "None"
    }

    embed.addField("Bonus(es)",bonuslist,true);
    if(armourfile.upgraded_bonus != null){
    var upgbonuslist = ""
      for (let key in armourfile.upgraded_bonus ){
        upgbonuslist += `**+${armourfile.upgraded_bonus[key]}** ` + key + "\n";
      }
      embed.addField ("Upgraded Bonus(es)",upgbonuslist,true)
    }
    if(armourfile.specials != null){
      var uniqueeffectlist = ''
      for (let key in armourfile.specials){
        uniqueeffectlist += `${armourfile.specials[key]}\n`
      }
      embed.addField("Unique Effects", uniqueeffectlist)
    }
    return {embed};

  }
  try{
    var armourtype = -1
    switch (args[args.length-1]){
      case "helmet":
        armourtype = 0;
        break
      case "chestplate":
        armourtype = 1;
        break;
      case "gauntlets":
        armourtype = 2
        break;
      case "greaves":
        armourtype = 3
        break;
      case "head":
        armourtype = 0
        break;
      case "chest":
        armourtype = 1;
        break;
      case "gloves":
      armourtype = 2;
        break;
      case "boots":
      armourtype=3;
    }
    console.log(armourtype > -1)
    if (armourtype > -1){
      console.log(armourtype)
      args.pop()
      let string = args.join().split(',').join(' ')
      let regex  = new RegExp(string+'.*','i')
      armourfile = db.get("armour").find(function(o) {return regex.test(o.boss)}).value();
      console.log(armourfile)
      let embed = armourcreate(armourfile,armourtype)
      if (embed){
        return message.channel.send(embed)
      }
    }
    else {
      let string = args.join().split(',').join(' ')
      let regex  = new RegExp(string+'.*','i')
      armourfile = db.get("armour").find(function(o) {for (i in o["itemnames"]){if (regex.test(o['itemnames'][i])){return true;}}return false}).value();
      armourpiece = armourfile.itemnames.findIndex(function (o){return regex.test(o)})
      let embed = armourcreate(armourfile,armourpiece)
      if (embed){
        return message.channel.send(embed)
      }
    }
  let guildinfo = client.getGuild.get(message.guild.id);
  return message.channel.send(`Please use \`\`${guildinfo.guildprefix}armour <behemoth name> <armor piece>\`\` with a behemoth name from below:\n\`\`Gnasher, Shrike, Quillshot, Skarn, Charrogg, Embermane, Skraev, Drask, Nayzaga, Pangar, Hellion, Stormclaw, Kharabak, Ragetail Gnasher, Firebrand Charrogg, Shockjaw Nayzaga, Razorwing Kharabak, Frostback Pangar, Deadeye Quillshot, Bloodfire Embermane, Moonreaver Shrike, Rezakiri, Shrowd, Koshai\`\`\n With a armour piece from this list:\n \`\`Helmet, Chestplate, Gauntlets, Greaves\`\``)
  } catch (err){
    console.log(err);
    let guildinfo = client.getGuild.get(message.guild.id);
    let reply =`Please use \`\`${guildinfo.guildprefix}armour <behemoth name> <armor piece>\`\` with a behemoth name from below:\n\`\`Gnasher, Shrike, Quillshot, Skarn, Charrogg, Embermane, Skraev, Drask, Nayzaga, Pangar, Hellion, Stormclaw, Kharabak, Ragetail Gnasher, Firebrand Charrogg, Shockjaw Nayzaga, Razorwing Kharabak, Frostback Pangar, Deadeye Quillshot, Bloodfire Embermane, Moonreaver Shrike, Rezakiri, Shrowd, Koshai\`\`\n With a armour piece from this list:\n \`\`Helmet, Chestplate, Gauntlets, Greaves\`\``
    message.channel.send(reply);
  }



}
exports.conf = {
  name:"armour",
  aliases: ["armor"]
};
