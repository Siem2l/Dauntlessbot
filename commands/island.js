exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
    try {
      if (args[0]=='list'){
        stringlist = ''
        var behemoth = db.get('islands').value();
        for (key in behemoth){
          console.log(behemoth[key])
          if ((key % 2 == 1)){
            stringlist += `• ${behemoth[key]['name']},`.padEnd(25)+"\n"
          }
          else{
          stringlist += `• ${behemoth[key]['name']},`.padEnd(25)
        }
      }
        return message.channel.send(`Cell list:\n\`\`\`${stringlist}\`\`\``)
      }
      if (args.length == 2){
        var islandfile= db.get("islands").find({namedb: `${args[0]} ${args[1]}`}).value();
      }
      else{
      var islandfile = db.get("islands").find({namedb: args[0]}).value();
    }
    var behemothlistfile = db.get("behemoths").value().filter(item => item.islands.includes(islandfile.name));

    let behemothlist="";
    for (behemoth in behemothlistfile){
      behemothlist +=  "• " + behemothlistfile[behemoth]["name"] + "\n";
    }
      let gatherablelist="";
      for (gatherable in islandfile.gatherables){
        gatherablelist +=  "• " + islandfile.gatherables[gatherable]["name"] + "\n";
      }

        const embed = {
            "description": islandfile.description,
            "color": 9324,
            "thumbnail": {
              "url": islandfile.icon_url
            },
            "author": {
              "name":  islandfile.name,
              "url": islandfile.wiki_url
            },
            "fields": [
              {
                "name": "Behemoths",
                "value": behemothlist
              },
              {
                "name": "Gatherables",
                "value": gatherablelist
              }
            ]
          };
          message.channel.send({embed});
        } catch (err)  {
        console.log(err);
        let guildinfo = client.getGuild.get(message.guild.id);
            let reply = `Please use one of the following commands:\n\`${guildinfo.guildprefix}Island <IslandName>\` - Specific information about an island or location\n\`${guildinfo.guildprefix}Rotation\` - Displays the behemoths currently available in the Maelstrom & which behemoths are coming next\nTo see a list of Island Names, type \`${guildinfo.guildprefix}Island List\`\n`;
            message.channel.send(reply);
        }
}
exports.conf = {
  name:"island",
  aliases: ["islands"]
};
