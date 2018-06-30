exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
try{
  console.log(args);
  if (args.length == 2){
    var behemoth = db.get("behemoths").find({namedb: `${args[0]} ${args[1]}`}).value();
  }
  else{
  var regex = new RegExp( args[0]+".*", 'i');
  var behemoth = db.get("behemoths").find(behemoth => regex.test(behemoth.namedb)).value();;
}
      var droptablestring = ``;
      for (let key in behemoth.droptable){
              droptablestring += `**${key}**\n${behemoth.droptable[key]}\n\n`;
      }
      if (args.length == 2){
        var icon_url = `${args[0]}_${args[1]}`;
      }
      else{var icon_url = args[0]}

      const embed = {
          "description": behemoth.description,
          "color": 10029881,
          "thumbnail": {
            "url": `https://nireon.me/behemoths/${icon_url}.png`
          },
          "author": {
            "name": behemoth.name,
            "url": behemoth.wiki_url
          },
          "fields": [
            {
              "name": "Droptable",
              "value": `${droptablestring}`
            },
            {
              "name": "Element",
              "value": behemoth.element.toString(),
              "inline": true
            },
            {
              "name": "Weakness",
              "value": behemoth.weakness.toString(),
              "inline": true
            },
            {
              "name": "Interrupt",
              "value": behemoth.interupting
            }
          ]
        };
        message.channel.send({ embed });
    } catch (err)  {
        console.log(err);
        let guildinfo = client.getGuild.get(message.guild.id);
        let reply =`Please use \`\`${guildinfo.guildprefix}behemoth <behemoth name>\`\` or \`\`${guildinfo.guildprefix}<behemoth first name> <statistic>\`\` with a behemoth name from below:\n \`Gnasher\`, \`Shrike\`, \`Quillshot\`, \`Skarn\`, \`Charrogg\`, \`Embermane\`, \`Skraev\`, \`Drask\`, \`Nayzaga\`, \`Pangar\`, \`Hellion\`, \`Stormclaw\`, \`Kharabak\`, \`Ragetail Gnasher\`, \`Firebrand Charrogg\`, \`Shockjaw Nayzaga\`, \`Razorwing Kharabak\`, \`Frostback Pangar\`, \`Deadeye Quillshot\`, \`Bloodfire Embermane\`, \`Moonreaver Shrike\`, \`Rezakiri\`, \`Shrowd\``

        message.channel.send(reply);
    }
  };
