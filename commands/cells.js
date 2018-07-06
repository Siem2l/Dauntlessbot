exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
    try{
      if (args[0]=='list'){
        stringlist = ''
        var behemoth = db.get('cells').value();
        for (key in behemoth){
          console.log(behemoth[key])
          if ((key % 2 == 1)){
            stringlist += `• ${behemoth[key]['name']},`.padEnd(25)+"\n"
          }
          else{
          stringlist += `• ${behemoth[key]['name']},`.padEnd(25)
        }
      }
        return message.channel.send(`Island list:\n\`\`\`${stringlist}\`\`\``)
      }
      if (args.length == 2){
        var cellfile = db.get("cells").find({namedb: `${args[0]} ${args[1]}`}).value();
      }
      else{
      var cellfile = db.get("cells").find({namedb: args[0]}).value();

    }
        const embed = {
            "description": cellfile.description,
            "color": 13937765,
            "thumbnail": {
              "url": `https://nireon.me/cellslots/${cellfile.type.toLowerCase()}.png`
            },
            "author": {
              "name": cellfile.name,
              "url": `https://dauntless.gamepedia.com/Perks`
            },
            "fields": [
              {
                "name": "Type",
                "value": cellfile.type
              },
              {
                "name": "Bonuses",
                "value": `**+1** ${cellfile.level01}\n\n**+2** ${cellfile.level02}\n\n**+3** ${cellfile.level03}\n\n**+4** ${cellfile.level04}\n\n**+5** ${cellfile.level05}\n\n**+6** ${cellfile.level06}`,
                "inline": true
              }
            ]
          };
          message.channel.send({ embed });
    } catch(err){
          let guildinfo = client.getGuild.get(message.guild.id);
          let reply = `Please use one of the following commands:\n\`${guildinfo.guildprefix}Cell <CellName>\` - Specific information about a specific cell\nTo see a list of Cell Names, type \`${guildinfo.guildprefix}Cell List\`\n`;
          message.channel.send(reply);
      }


    };
    exports.conf = {
      name:"cells",
      aliases: ["cell"]
    };
