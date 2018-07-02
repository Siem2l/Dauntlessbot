exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
    try{am
      if (args.length == 2){
        var cellfile = db.get("cells").find({namedb: `${args[0]} ${args[1]}`}).value();
      }
      else{
      var cellfile = db.get("cells").find({namedb: args[0]}).value();

    }
    console.log(`https://nireon.me/cellslots/${cellfile.type.toLowerCase()}.png`);
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
          let reply = ` Please use \`\`${guildinfo.guildprefix}cells <cell name>\`\` with a cell name from below:\n \`\`acidic, aetherborne, aetherhunter, aetheric attunement, aetheric frenzy, agility, assassins vigor, barbed, bladestorm, bloodless, conditioning, cunning, deconstruction, endurance, energized, evasion, evasive fury, fireproof, fleet footed, fortress, insulated, knockout king, medic, merciless, nimble, nine lives, overpower, pacifier, rage, ragehunter, savagery, sharpened, shellshock resist, stunning vigour, sturdy, swift, tough, vampiric, warmth, weighted strikes, wild frenzy\`\``
          message.channel.send(reply);
      }


    };
