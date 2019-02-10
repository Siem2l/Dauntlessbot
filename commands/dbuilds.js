exports.run = async (client, message, args, Discord) => {
  try {
    const request = require('request');
    const Hashids = require("hashids");
    const hash = new Hashids("spicy");
    const low = require("lowdb");
    const FileSync = require('lowdb/adapters/FileSync');
    const adapter = new FileSync('./data/dauntlessdata.json');
    const db = low(adapter);

    const addReactions = async (msg) => {
        await msg.react("◀");
        await msg.react("▶");
        await msg.react("❌");
    };

    let arraylink = args[0].split("/")
    let code = arraylink[arraylink.length - 1]
    var build = hash.decode(code);
    if (build == '') {
      return message.channel.send("The code at the end of you link is incorrect")
    }
    const embedlanterncreate = function(lanternname,cell01=0){
      var lanternfile = db.get("lanterns").find({name:lanternname}).value();
      let embed = new Discord.RichEmbed()
            .setAuthor(lanternfile.name)
            .setThumbnail("https://nireon.me/Lantern.png")
            .addField("Cellslot",lanternfile.cellslot)
            .addField("Instant",lanternfile.instant)
            .addField("Hold",lanternfile.hold);
            if (cell01 != 0){
              let level1 = cell01.substr(0,cell01.indexOf(' '));
              let cell1 = cell01.substr(cell01.indexOf(' ')+1).replace(" Cell", "");
              let cellobject1 = db.get('cells').find({name:cell1}).value();
              embed.addField("Cells",`${cellobject1.type} : ${level1} ${cellobject1.name} Cell`)
            }
      return {embed}
    }

    const embedarmourcreate = function (armourname,cell01=0) {
      var armourfile = db.get("armour").find({itemnames:[armourname]}).value();
      if (armourfile){
        armourtype = armourfile.itemnames.indexOf(armourname)
        var behemothfile = db.get("behemoths").find({namedb:armourfile.boss}).value();
        armourfile = armourfile['items'][armourtype];
      let embed = new Discord.RichEmbed();
      if (behemothfile){
        embed.setTitle("__"+ behemothfile.name + "__")
      }
      embed.setThumbnail(armourfile.icon_url)
      .setAuthor(armourfile.name,"",armourfile.wiki_url)
      .addField("Cellslot",armourfile.cellslot)
      .addField("Element", armourfile.element, true)
      .addField("Weakness",armourfile.weakness,true);
      if (armourfile.bonuses != "None"){
      var bonuslist = ""
      for (let bonuskey in armourfile.bonuses){
        bonuslist += `+${armourfile.bonuses[bonuskey]} ` + bonuskey + "\n";
        }
      }else{
        var bonuslist = "None"
      }
      embed.addField ("Bonus(es)",bonuslist,true);
      if(armourfile.upgraded_bonus != null){
      var upgbonuslist = ""
        for (let bonusupgkey in armourfile.upgraded_bonus ){
          upgbonuslist += `+${armourfile.upgraded_bonus[bonusupgkey]} ` + bonusupgkey + "\n";
        }
        embed.addField ("Upgraded Bonus(es)",upgbonuslist,true)
      }
      if (cell01 != 0){
        let level1 = cell01.substr(0,cell01.indexOf(' '));
        let cell1 = cell01.substr(cell01.indexOf(' ')+1).replace(" Cell", "");
        let cellobject1 = db.get('cells').find({name:cell1}).value();
        embed.addField("Cells",`${cellobject1.type} : ${level1} ${cellobject1.name} Cell`)
      }

      return {embed}
    }
}
    const embedcreate = function (weaponname, cell01 = 0, cell02=0){
      var weaponfile = db.get("weapons").find({itemnames:[weaponname]}).value();
      if(weaponfile){
        weaponpiece = weaponfile.itemnames.indexOf(weaponname)
        let regexbm = new RegExp(weaponfile.name,'i')
         behemothfile = db.get('behemoths').find(behemoth => regexbm.test(behemoth.namedb)).value();
         weaponfile = weaponfile["items"][weaponpiece];
      var embed = new Discord.RichEmbed();
      if (behemothfile){
        embed.setTitle("__"+ behemothfile.name + "__")
      }
      embed.setThumbnail(weaponfile.icon_url)
      .setAuthor(weaponfile.name,"",weaponfile.wiki_url)
      .addField("Cellslots",weaponfile.cellslot01 + " & " + weaponfile.cellslot02,true)
      .addField("Element", weaponfile.element, true)
      if (weaponfile.bonuses != "None"){
      bonuslist = ""
      for (let key in weaponfile.bonuses){
        bonuslist += `+${weaponfile.bonuses[key]} ` + key + "\n";
        }
      }else{
        bonuslist = "None"
      }
      embed.addField("Bonus(es)",bonuslist,true);
      if(weaponfile.upgraded_bonus != null){
      var upgbonuslist = ""
        for (let key in weaponfile.upgraded_bonus ){
          upgbonuslist += `+${weaponfile.upgraded_bonus[key]} ` + key + "\n";
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
      if (cell01 != 0 && cell02 != 0){
        let level1 = cell01.substr(0,cell01.indexOf(' '));
        let cell1 = cell01.substr(cell01.indexOf(' ')+1).replace(" Cell", "");
        let cellobject1 = db.get('cells').find({name:cell1}).value();
        let level2 = cell02.substr(0,cell02.indexOf(' '));
        let cell2 = cell02.substr(cell02.indexOf(' ')+1).replace(" Cell", "");
        let cellobject2 = db.get('cells').find({name:cell2}).value();
        embed.addField("Cells",`${cellobject1.type} : ${level1} ${cellobject1.name} Cell\n${cellobject2.type} : ${level2} ${cellobject2.name} Cell`)
      }
      else if (cell01 != 0){
        let level1 = cell01.substr(0,cell01.indexOf(' '));
        let cell1 = cell01.substr(cell01.indexOf(' ')+1).replace(" Cell", "");
        embed.addField("Cells",`${cellobject1.type} : ${level1} ${cellobject1.name} Cell`)
      }
      else if (cell02 != 0){
        let level2 = cell02.substr(0,cell02.indexOf(' '));
        let cell2 = cell02.substr(cell02.indexOf(' ')+1).replace(" Cell", "");
        embed.addField("Cells",`${cellobject2.type} : ${level2} ${cellobject2.name} Cell`)
      }
      return {embed};
    }
    }







    request(`https://www.dauntless-builder.com/map/v${build[0]}.json`, {
      json: true
    }, async (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      var pages = {}

      const embed = new Discord.RichEmbed();
      pages[1] = {embed};
      embed.setAuthor("Dauntless Build:")
      gearstring = "";
      perkstring = "";
      perkfile = []
      specialfile = [];
      exoticsarray = ["Tragic Echo", "Prismatic Grace", "The Hunger", "The Godhand"]
      //0: version
      //1: weaponname
      //2: weaponlevel
      //3: cellslot1 weapon
      //4: cellslot2 weapons
      //5: helmet named
      //6: helmet level01
      //7: helmet cellslot
      //8: chestplate name
      //9: chestplate level
      //10: chestplate cell
      //11: gauntlets name
      //12: gauntlets level
      //13: gauntlets cell
      //14: greaves name
      //15: greaves level
      //16: greaves cell
      //17: lanternname
      //18: lantern cell
      if (res.body[build[1]]) {

        let weaponname = res.body[build[1]]
        if (res.body[build[1]] == "Repeater"){

          gearstring += "**Weapon:** " + res.body[build[1]] + "\n";
          if (res.body[build[19]]){
          gearstring += "\t*Barrel:*\t" + res.body[build[19]] + "\n";
          }
          if (res.body[build[21]]){
          gearstring += "\t*Chamber:*\t" + res.body[build[21]] + "\n";
          }
          if (res.body[build[23]]){
          gearstring += "\t*Grip:*\t" + res.body[build[23]] + "\n";
          }
          if (res.body[build[25]]){
          gearstring += "\t*Prism:*\t" + res.body[build[25]] + "\n";
        }












        }
        else{
          gearstring += "**Weapon:** " + res.body[build[1]] + " +" + build[2] + "\n";
        }
        if (res.body[build[3]]) {
          let cellperks = []
          cellperks[0] = res.body[build[3]].replace(" Cell", "").replace("+", "").substr(0, res.body[build[3]].replace(" Cell", "").replace("+", "").indexOf(" "))
          cellperks[1] = res.body[build[3]].replace(" Cell", "").replace("+", "").substr(res.body[build[3]].replace(" Cell", "").replace("+", "").indexOf(" ") + 1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == cellperks[1]) {
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: cellperks[1],
              amount: cellperks[0]
            }
            perkfile.push(jsonarray);
          }
        }
        if (res.body[build[4]]) {
          let cellperks = []
          cellperks[0] = res.body[build[4]].replace(" Cell", "").replace("+", "").substr(0, res.body[build[4]].replace(" Cell", "").replace("+", "").indexOf(" "))
          cellperks[1] = res.body[build[4]].replace(" Cell", "").replace("+", "").substr(res.body[build[4]].replace(" Cell", "").replace("+", "").indexOf(" ") + 1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == cellperks[1]) {
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: cellperks[1],
              amount: cellperks[0]
            }
            perkfile.push(jsonarray);
          }
        }
        if (res.body[build[3]]&& res.body[build[4]]){
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedcreate(weaponname,res.body[build[3]],res.body[build[4]])
        }
        else if (res.body[build[3]]){
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedcreate(weaponname,res.body[build[3]])
        }
        else if (res.body[build[4]]){
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedcreate(weaponname,0,res.body[build[4]])
        }
        else{
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedcreate(weaponname)
        }
        //--------------------------Upgraded bonuses loader----------------------
          var weaponfile = db.get("weapons").find({
            items: [{
              name: res.body[build[1]]
            }]
          }).value();
          let weaponindex = weaponfile['items'].findIndex(obj => obj.name == res.body[build[1]])
          if (weaponfile['items'][weaponindex]["specials"] != "None") {
            for (let key in weaponfile['items'][weaponindex]["specials"]) {
              specialfile.push(weaponfile['items'][weaponindex]["specials"][key])
            }
          }
          for (let key in weaponfile['items'][weaponindex]["upgraded_bonus"]) {
            for (let j in perkfile) {
              var found = false;
              if (perkfile[j]['name'] == key) {
                perkfile[j]["amount"] += weaponfile['items'][weaponindex]["upgraded_bonus"][key]
                found = true;
                break;
              }
            }
            if (found != true) {
              var jsonarray = {
                name: key,
                amount: weaponfile['items'][weaponindex]["upgraded_bonus"][key]
              }
              perkfile.push(jsonarray);
            }
          }
        }

      if (res.body[build[5]]) {
        gearstring += "**Helmet:** " + res.body[build[5]] + " +" + build[6] + "\n"
        if (res.body[build[7]]) {
          let cellperks = []
          cellperks[0] = res.body[build[7]].replace(" Cell", "").replace("+", "").substr(0, res.body[build[7]].replace(" Cell", "").replace("+", "").indexOf(" "))
          cellperks[1] = res.body[build[7]].replace(" Cell", "").replace("+", "").substr(res.body[build[7]].replace(" Cell", "").replace("+", "").indexOf(" ") + 1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == cellperks[1]) {
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: cellperks[1],
              amount: cellperks[0]
            }
            perkfile.push(jsonarray);
          }
        }
        if (res.body[build[7]]){
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedarmourcreate(res.body[build[5]],res.body[build[7]])
        }
        else{
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedarmourcreate(res.body[build[5]])
        }
        //--------------------------Upgraded bonuses loader----------------------
          var armourfile = db.get("armour").find({
            items: [{
              name: res.body[build[5]]
            }]
          }).value();
          for (let key in armourfile['items'][0]["upgraded_bonus"]) {
            for (let j in perkfile) {
              var found = false;
              if (perkfile[j]['name'] == key) {
                perkfile[j]["amount"] += armourfile['items'][0]["upgraded_bonus"][key]
                found = true;
                break;
              }
            }
            if (found != true) {
              var jsonarray = {
                name: key,
                amount: armourfile['items'][0]["upgraded_bonus"][key]
              }
              perkfile.push(jsonarray);
            }
          }
        }
      if (res.body[build[8]]) {
        gearstring += "**Chestplate:** " + res.body[build[8]] + " +" + build[9] + "\n"
        if (res.body[build[10]]) {
          let cellperks = []
          cellperks[0] = res.body[build[10]].replace(" Cell", "").replace("+", "").substr(0, res.body[build[10]].replace(" Cell", "").replace("+", "").indexOf(" "))
          cellperks[1] = res.body[build[10]].replace(" Cell", "").replace("+", "").substr(res.body[build[10]].replace(" Cell", "").replace("+", "").indexOf(" ") + 1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == cellperks[1]) {
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: cellperks[1],
              amount: cellperks[0]
            }
            perkfile.push(jsonarray);
          }
        }
        if (res.body[build[10]]){
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedarmourcreate(res.body[build[8]],res.body[build[10]])
        }
        else{
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedarmourcreate(res.body[build[8]])
        }
        //--------------------------Upgraded bonuses loader----------------------
        var regex = new RegExp(res.body[build[8]] + ".*", 'i');
        var armourfile = db.get("armour").find({
          items: [{
            name: res.body[build[8]]
          }]
        }).value();
        for (let key in armourfile['items'][1]["upgraded_bonus"]) {
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == key) {
              perkfile[j]["amount"] += armourfile['items'][1]["upgraded_bonus"][key]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: key,
              amount: armourfile['items'][1]["upgraded_bonus"][key]
            }
            perkfile.push(jsonarray);
          }
        }
      }
      if (res.body[build[11]]) {
        gearstring += "**Gauntlets:** " + res.body[build[11]] + " +" + build[12] + "\n"
        if (res.body[build[13]]) {
          let cellperks = []
          cellperks[0] = res.body[build[13]].replace(" Cell", "").replace("+", "").substr(0, res.body[build[13]].replace(" Cell", "").replace("+", "").indexOf(" "))
          cellperks[1] = res.body[build[13]].replace(" Cell", "").replace("+", "").substr(res.body[build[13]].replace(" Cell", "").replace("+", "").indexOf(" ") + 1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == cellperks[1]) {
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: cellperks[1],
              amount: cellperks[0]
            }
            perkfile.push(jsonarray);
          }
        }
        if (res.body[build[13]]){
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedarmourcreate(res.body[build[11]],res.body[build[13]])
        }
        else{
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedarmourcreate(res.body[build[11]])
        }
        //--------------------------Upgraded bonuses loader----------------------
        var regex = new RegExp(res.body[build[11]] + ".*", 'i');
        var armourfile = db.get("armour").find({
          items: [{
            name: res.body[build[11]]
          }]
        }).value();
        for (let key in armourfile['items'][2]["upgraded_bonus"]) {
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == key) {
              perkfile[j]["amount"] += armourfile['items'][2]["upgraded_bonus"][key]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: key,
              amount: armourfile['items'][2]["upgraded_bonus"][key]
            }
            perkfile.push(jsonarray);
          }
        }
      }
      if (res.body[build[14]]) {
        gearstring += "**Greaves:** " + res.body[build[14]] + " +" + build[15] + "\n"
        if (res.body[build[16]]) {
          let cellperks = []
          cellperks[0] = res.body[build[16]].replace(" Cell", "").replace("+", "").substr(0, res.body[build[16]].replace(" Cell", "").replace("+", "").indexOf(" "))
          cellperks[1] = res.body[build[16]].replace(" Cell", "").replace("+", "").substr(res.body[build[16]].replace(" Cell", "").replace("+", "").indexOf(" ") + 1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == cellperks[1]) {
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: cellperks[1],
              amount: cellperks[0]
            }
            perkfile.push(jsonarray);
          }
        }
        if (res.body[build[16]]){
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedarmourcreate(res.body[build[14]],res.body[build[16]])
        }
        else{
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedarmourcreate(res.body[build[14]])
        }
        //--------------------------Upgraded bonuses loader----------------------
        var regex = new RegExp(res.body[build[14]] + ".*", 'i');
        var armourfile = db.get("armour").find({
          items: [{
            name: res.body[build[14]]
          }]
        }).value();
        for (let key in armourfile['items'][3]["upgraded_bonus"]) {
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == key) {
              perkfile[j]["amount"] += armourfile['items'][3]["upgraded_bonus"][key]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: key,
              amount: armourfile['items'][3]["upgraded_bonus"][key]
            }
            perkfile.push(jsonarray);
          }
        }
      }
      if (res.body[build[17]]) {
        gearstring += "**Lantern:** " + res.body[build[17]] + "\n"
        if (res.body[build[18]]) {
          let cellperks = []
          cellperks[0] = res.body[build[18]].replace(" Cell", "").replace("+", "").substr(0, res.body[build[18]].replace(" Cell", "").replace("+", "").indexOf(" "))
          cellperks[1] = res.body[build[18]].replace(" Cell", "").replace("+", "").substr(res.body[build[18]].replace(" Cell", "").replace("+", "").indexOf(" ") + 1)
          cellperks[0] = parseInt(cellperks[0])
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile) {
            var found = false;
            if (perkfile[j]['name'] == cellperks[1]) {
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
          }
          if (found != true) {
            var jsonarray = {
              name: cellperks[1],
              amount: cellperks[0]
            }
            perkfile.push(jsonarray);
          }
        }
        if (res.body[build[18]]){
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedlanterncreate(res.body[build[17]],res.body[build[18]])
        }
        else{
          pages[++Object.keys(pages)[Object.keys(pages).length-1]] = embedlanterncreate(res.body[build[17]])
        }
      }

      // repeaterdata
      perkfile.sort((a, b) => b.amount - a.amount);
      for (let key in perkfile) {
        if (perkfile[key]["amount"] > 6) {
          var celllevel = "level06";
        } else {
          var celllevel = `level0${perkfile[key]["amount"]}`
        }
        let cellfile = db.get("cells").find({
          name: perkfile[key]["name"]
        }).value();
        perkstring += "__•" + " +" + perkfile[key]['amount'] + " " + perkfile[key]['name'] + "__\n" + cellfile[celllevel] + "\n";

      }

      if (gearstring != "") {
        embed.setDescription(`[Build on website](${args[0]})\n` + gearstring + "\n" + perkstring);
      }
      if (specialfile.length != 0) {
        let specialstring = "";
        for (let i in specialfile) {
          if (specialfile[i].startsWith("• ")) {
            specialstring += specialfile[i]
          } else {
            specialstring += "• " + specialfile[i]
          }
          specialstring += "\n"
        }
        embed.addField("Unique Effect(s)", specialstring)
      }
      /*  var perks = {};
        var regex = new RegExp( res.body[build[1]]+".*", 'i');
        var weaponfile = db.get("weapons").find({items:[{name:res.body[build[1]]}]}).value();
        let weaponindex = weaponfile['items'].findIndex(obj => obj.name == res.body[build[1]])
        for (let key in weaponfile['items'][weaponindex]["upgraded_bonus"]){
          perks[key] = weaponfile['items'][weaponindex]["upgraded_bonus"][key];
          */
      pages[1] = {embed}
      const msg = await message.channel.send(pages[1]);
      await addReactions(msg);
      const filter = (reaction, user) => ( ["◀","▶","❌"].includes(reaction.emoji.name) && user.id === message.author.id);
      const collector = msg.createReactionCollector(filter,{ time: 120000 });
      let page = 1;
      collector.on("collect", reaction => {
          reaction.remove(message.author);
          if(reaction.emoji.name === "◀" && page > 1) {
              page--;
              msg.edit('',pages[page]);
          } else if(reaction.emoji.name === "▶" && page < Object.keys(pages).length+1) {
              page++;
              msg.edit('',pages[page]);
          } else if (reaction.emoji.name === "❌" ){
              msg.delete();
          }
      });
      collector.on("end", collected => {
              msg.edit("Timer ran out use the command again to use the menu again")
              msg.clearReactions()
      });
    });
  } catch (err) {
    console.log(err);
    return message.channel.send("Something went wrong! contact Nireon#0001 if you want to resolve the issue")
  }
};
exports.conf = {
  name: "dbuilds",
  aliases: ["build", "dbuild", "db"]
};
