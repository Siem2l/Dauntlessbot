exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
    try{
      if (args[0]=='list'){

        stringlist = ''
        let type = ''
        let celllist = db.get('cells').sortBy('type').value();
        for (key in celllist){
          if (type != celllist[key]['type']){
            if (key % 2 === 1){
            stringlist += '\n\n'+celllist[key]['type'] + ':\n'
            }
            else{
            stringlist += '\n'+celllist[key]['type'] + ':\n'
          }
            type = celllist[key]['type']
          }
          if ((key % 2 == 1)){
            stringlist += `• ${celllist[key]['name']},`.padEnd(25)+"\n"
          }
          else{
          stringlist += `• ${celllist[key]['name']},`.padEnd(25)
        }
      }
        return message.channel.send(`Cell list:\n\`\`\`${stringlist}\`\`\``)
      }
      if (args.length == 2){
          var regex = new RegExp( args[0]+ " " + args[1]+".*", 'i');
        var cellfile = db.get("cells").find(cell => regex.test(cell.namedb)).value();
      }
      else{
          var regex = new RegExp( args[0]+".*", 'i');
      var cellfile = db.get("cells").find(cell => regex.test(cell.namedb)).value();
    }

    let name = cellfile.name
    let armourfile = db.get('armour').filter(function(o) {for (let i in o.items){return o['items'][i]['bonuses'][name] > 0;}}).value();
      if (armourfile.length != 0){
    var obtainablefromarmour = '';
      for (let i in armourfile){
        for (let j in armourfile[i]['items']){
          for (let k in armourfile[i]['items'][j]['bonuses']){
            if (k == name){
              obtainablefromarmour += `• ${armourfile[i]['items'][j]['name']},\n`
            }
          }
        }
      }
    }
  let weaponfile = db.get('weapons').filter(function(o) {for (let i in o.items){return o['items'][i]['bonuses'][name] > 0;}}).value();
  if (weaponfile.length != 0){
  var obtainablefromweapons= ''
  for (let i in weaponfile){
    for (let j in weaponfile[i]['items']){
      for (let k in weaponfile[i]['items'][j]['bonuses']){
        if (k == name){
          obtainablefromweapons += `• ${weaponfile[i]['items'][j]['name']},\n`
        }
      }
    }
  }
}

        const embed = new Discord.RichEmbed;
        embed.setDescription(cellfile.description)
        .setThumbnail(`https://nireon.me/cellslots/${cellfile.type.toLowerCase()}.png`)
        .setAuthor(cellfile.name,'','https://dauntless.gamepedia.com/Perks')
        .addField("Bonuses",`**+1** ${cellfile.level01}\n\n**+2** ${cellfile.level02}\n\n**+3** ${cellfile.level03}\n\n**+4** ${cellfile.level04}\n\n**+5** ${cellfile.level05}\n\n**+6** ${cellfile.level06}`,true)
        if(obtainablefromweapons){
        embed.addField("Obtainable from weapons:",obtainablefromweapons,true)
        }
        if(obtainablefromarmour){
        embed.addField("Obtainable from armour:",obtainablefromarmour,true)
      }
          message.channel.send({ embed });
    } catch(err){
      console.log(err)
          let guildinfo = client.getGuild.get(message.guild.id);
          let reply = `Please use one of the following commands:\n\`${guildinfo.guildprefix}Cell <CellName>\` - Specific information about a specific cell\nTo see a list of Cell Names, type \`${guildinfo.guildprefix}Cell List\`\n`;
          message.channel.send(reply);
      }


    };
    exports.conf = {
      name:"cells",
      aliases: ["cell"]
    };
