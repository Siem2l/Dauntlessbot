exports.run = (client, message, args, Discord) => {
  const fs = require("fs");
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
    try {
        let exoticfile = db.get("exotics").find({namedb: `${args[0]}${args[1]}`}).value();
        if (!args[2]){
            args[2] = "total";
        }
            let recipestring = "";
            for(var items in exoticfile.recipe_cost[args[2]]){

               recipestring += `•  ${items}: ${exoticfile.recipe_cost[args[2]][items]} \n`;
            }

        const embed = {
            "description": exoticfile.description,
            "color": 9324,
            "thumbnail": {
              "url": exoticfile.icon_url
            },
            "author": {
              "name": exoticfile.name,
              "url": exoticfile.wiki_url
            },
            "fields": [
                {
                    "name": `Recipe cost for ${args[2]}`,
                    "value": recipestring
                  }
            ]
          };

        message.channel.send({embed});
    } catch (err)  {
        console.log(err);

          let guildinfo = client.getGuild.get(message.guild.id);
          let reply = `Please use \`\`${guildinfo.prefix}recipe <exotic name> (level)\`\` with a exotic name from below:\n\`\`prismatic grace, the godhand, the hunger, tragic echo\`\`\n also choose a level from below: (Default is total) \n\`\`base, +1, +2, +3, +4, +5, +6, +7, +8, +9, +10 and total\`\``
            message.channel.send(reply);



        }
}
