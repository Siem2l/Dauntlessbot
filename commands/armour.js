exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);

  try{
    switch (args[args.length-1]){
      case "head":
        args[args.length-1] = "helmet";
        break;
      case "chest":
        args[args.length-1] = "chestplate";
        break;
      case "gloves":
      args[args.length-1] = "gauntlets";
        break;

    }


    if (args.length == 2){
      var regex = new RegExp( args[0]+".*", 'i');
    var armourfile = db.get("armour").find(behemoth => regex.test(behemoth.boss)).value();
  } else{
      var armourfile = db.get("armour").find({boss:`${args[0]} ${args[1]}`}).value();
  }
    armourfile = armourfile[args[args.length-1]];


    if (args.length == 2){
      var regex = new RegExp( args[0]+".*",'i');
      var behemothfile = db.get("behemoths").find(behemoth => regex.test(behemoth.namedb)).value();;
    }else if (args.length == 3){
      var behemothfile = db.get("behemoths").find({namedb:`${args[0]} ${args[1]}`}).value();
  }


    var embed = new Discord.RichEmbed();
    embed.setTitle("__"+ behemothfile.name + " (" + args[args.length-1]+")__")
    .setThumbnail(armourfile.icon_url)
    .setAuthor(armourfile.name,armourfile.wiki_url)
    .addField("Cellslot",armourfile.cellslot)
    .addField("Element", armourfile.element, true)
    .addField("Weakness",armourfile.weakness,true);
    if (armourfile.bonuses != "None"){
    var bonuslist = ""
    for (let key in armourfile.bonuses){
      bonuslist += `**+${armourfile.bonuses[key]}** ` + key + "\n";
      }
    }else{
      var bonuslist = "None"
    }
    embed.addField ("Bonus(es)",bonuslist,true);
    if(armourfile.upgraded_bonus != null){
    var upgbonuslist = ""
      for (let key in armourfile.upgraded_bonus ){
        upgbonuslist += `**+${armourfile.upgraded_bonus[key]}** ` + key + "\n";
      }
      embed.addField ("Upgraded Bonus(es)",upgbonuslist,true)
    }
    message.channel.send({embed});



  } catch (err){
    console.log(err);
    let guildinfo = client.getGuild.get(message.guild.id);
    let reply =`Please use \`\`${guildinfo.guildprefix}armour <behemoth name> <armor piece>\`\` with a behemoth name from below:\n\`\`Gnasher, Shrike, Quillshot, Skarn, Charrogg, Embermane, Skraev, Drask, Nayzaga, Pangar, Hellion, Stormclaw, Kharabak, Ragetail Gnasher, Firebrand Charrogg, Shockjaw Nayzaga, Razorwing Kharabak, Frostback Pangar, Deadeye Quillshot, Bloodfire Embermane, Moonreaver Shrike, Rezakiri, Shrowd\`\`\n With a armour piece from this list:\n \`\`Helmet, Chestplate, Gauntlets, Greaves\`\``
    message.channel.send(reply);
  }



}
exports.conf = {
  name:"armour",
  aliases: ["armor"]
};
