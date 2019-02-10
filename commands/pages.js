exports.run = async (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
  const request = require("request");

    const addReactions = async (msg) => {
        await msg.react("◀");
        await msg.react("▶");
        await msg.react("❌");
    };
    const embedlanterncreate = function(lanternname){
      var lanternfile = db.get("lanterns").find({name:lanternname}).value();
      let embed = new Discord.RichEmbed()
            .setAuthor(lanternfile.name)
            .setColor(0x00AE86)
            .setThumbnail("https://nireon.me/Lantern.png")
            .addField("Cellslot",lanternfile.cellslot)
            .addField("Instant",lanternfile.instant)
            .addField("Hold",lanternfile.hold);
          return {embed}
    }
    const embedcreate = function (weaponname){
      var weaponfile = db.get("weapons").find({itemnames:[weaponname]}).value();
      console.log(weaponfile)
      if(weaponfile){
        weaponpiece = weaponfile.itemnames.indexOf(weaponname)
        let regexbm = new RegExp(weaponfile.name,'i')
         behemothfile = db.get('behemoths').find(behemoth => regexbm.test(behemoth.namedb)).value();
         weaponfile = weaponfile["items"][weaponpiece];
      let embed = new Discord.RichEmbed();
      embed.setTitle("__"+ behemothfile.name + "__")
      .setThumbnail(weaponfile.icon_url)
      .setAuthor(weaponfile.name,"",weaponfile.wiki_url)
      .addField("Cellslots",weaponfile.cellslot01 + " & " + weaponfile.cellslot02,true)
      .addField("Element", weaponfile.element, true)
      if (weaponfile.bonuses != "None"){
      bonuslist = ""
      for (let key in weaponfile.bonuses){
        bonuslist += `**+${weaponfile.bonuses[key]}** ` + key + "\n";
        }
      }else{
        bonuslist = "None"
      }
      embed.addField("Bonus(es)",bonuslist,true);
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
      console.log(embed)
      return {embed};
    }
    }

    const embedarmourcreate = function (armourname) {
      var armourfile = db.get("armour").find({itemnames:[armourname]}).value();
      if (armourfile){
        armourtype = armourfile.itemnames.indexOf(armourname)
        console.log(armourfile)
        var behemothfile = db.get("behemoths").find({namedb:armourfile.boss}).value();
        armourfile = armourfile['items'][armourtype];
      let embed = new Discord.RichEmbed();
      embed.setTitle("__"+ behemothfile.name  + "__")
      .setThumbnail(armourfile.icon_url)
      .setAuthor(armourfile.name,"",armourfile.wiki_url)
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
      return {embed}
    }
}
    const embed = new Discord.RichEmbed();
    embed.setTitle('test')
    const msg = await message.channel.send({embed});
    await addReactions(msg);
    const filter = (reaction, user) => ( ["◀","▶","❌"].includes(reaction.emoji.name) && user.id === message.author.id);
    const collector = msg.createReactionCollector(filter,{ time: 60000 });
    const pages = {
        1: embedlanterncreate("Drask's Fury"),
        2: embedcreate(args),
        3: embedcreate(args),
        4: embedcreate(args)
    };
    let page = 1;
    collector.on("collect", reaction => {
        reaction.remove(message.author);
        if(reaction.emoji.name === "◀" && page > 1) {
          console.log(pages)
            msg.edit('',pages[page]);
            page--;
        } else if(reaction.emoji.name === "▶" && page < 5) {
            msg.edit('',pages[page]);
            page++;
        } else if (reaction.emoji.name === "❌" ){
            msg.delete();
        }
    });
};
exports.conf = {
  name: "pages",
  aliases: []
};
