exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
try{
  console.log(args)
  if (args[0]=='list'|| args[0] == ''){
    let stringlist = ""
    var behemoth = db.get('behemoths').value();
    for (key in behemoth){
      if ((key % 2 == 1)){
        stringlist += `• ${behemoth[key]['name']},`.padEnd(25)+"\n"
      }
      else{
      stringlist += `• ${behemoth[key]['name']},`.padEnd(25)
    }
    }
    return message.channel.send('Behemoth list:\n\`\`\`'+stringlist+'\`\`\`')
  }
  var regex = new RegExp( args[0]+".*", 'i');
  console.log(regex)
  var behemoth = db.get("behemoths").find(behemoth => regex.test(behemoth.namedb)).value();;
      var droptablestring = ``;
      for (let key in behemoth.droptable){
              droptablestring += `**${key}**\n${behemoth.droptable[key]}\n\n`;
      }


      const embed = {
          "description": behemoth.description,
          "color": 10029881,
          "thumbnail": {
            "url": behemoth.icon_url
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
        let reply =`Please use one of the following commands:\n\`${guildinfo.guildprefix}BehemothName Info\` - General information about a specific behemoth\n\`${guildinfo.guildprefix}BehemothName <BodyPart>\` - Specific information about armour from a behemoth\n• Replace <BodyPart> with \`Helmet\`, \`Chestplate\`, \`Legs\`, or \`Greaves\`\n\`${guildinfo.guildprefix}BehemothName <WeaponType>\` - Specific information about weapons from a behemoth\n• Replace <WeaponType> with \`Sword\`, \`Hammer\`, \`Chain Blades\`, \`Axe\`, or \`Warpike\`\n\`${guildinfo.guildprefix}BehemothName Lantern\` - Specific information about lantern from a behemoth\nTo see a list of Behemoth Names, type \`${guildinfo.guildprefix}Behemoth List\`\n`;

        message.channel.send(reply);
    }
  };
  exports.conf = {
    name:"behemoth",
    aliases: ["bm","behe",'behemoths']
  };
