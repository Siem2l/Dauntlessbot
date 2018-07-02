exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);

    try {
        let exoticfile = db.get("exotics").find({namedb: `${args[0]}${args[1]}`}).value();

        var embed = {
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
                "name": "Unique effect ",
                "value": exoticfile.uniqueeffect
              },
              {
                "name": "Cell slots",
                "value": exoticfile.cells
              },
              {
                "name": "Recipe cost",
                "value": "If you want to know the recipe cost of this exotic type: \n``!recipe <exotic name>``"
              }
            ]
          };
        if (exoticfile.weakness != null){
            embed.fields.splice(2,0,{
                "name":"Strength",
                "value":exoticfile.strength,
                "inline":true
            },

            {
                "name":"Weakness",
                "value":exoticfile.weakness,
                "inline":true
            });

        }
        if(exoticfile.strength != null){
          embed.fields.splice(2,0,{
              "name":"Strength",
              "value":exoticfile.strength,
              "inline":true
          });}
        message.channel.send({embed});
    } catch (err)  {
      console.log(err)
      let reply = `Please use \`\`${guildinfo.guildprefix}exotic <exotic name>\`\` with a exotic from below:\n\`\`prismatic grace, the godhand, the hunger, tragic echo\`\``;
      message.channel.send(reply);
        }
}
