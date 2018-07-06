exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);

    try {
      if (args[0]=='list'){
        stringlist = ''
        var behemoth = db.get('exotics').value();
        for (key in behemoth){
          if ((key % 2 == 1)){
            stringlist += `• ${behemoth[key]['name']},`.padEnd(25)+"\n"
          }
          else{
          stringlist += `• ${behemoth[key]['name']},`.padEnd(25)
        }
      }
        return message.channel.send(`Exotic list:\n\`\`\`${stringlist}\`\`\``)
      }
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
      let guildinfo = client.getGuild.get(message.guild.id);
      let reply = `Please use one of the following commands:\n\`${guildinfo.guildprefix}Exotic <ExoticName>\` - General information about a specific exotic\nTo see a list of Exotic Names, type \`${guildinfo.guildprefix}Exotic List\`\n`
      message.channel.send(reply);
        }
}
exports.conf = {
  name:"exotic",
  aliases: []
};
