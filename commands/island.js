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
          if ((key % 2 == 1)){
            stringlist += `• ${behemoth[key]['name']},`.padEnd(25)+"\n"
          }
          else{
          stringlist += `• ${behemoth[key]['name']},`.padEnd(25)
        }
      }
        return message.channel.send(`Cell list:\n\`\`\`${stringlist}\`\`\``)
      }
    var regex = new RegExp( args[0]+".*", 'i');
    console.log(regex)
    var islandfile= db.get("islands").find(island => regex.test(island.namedb)).value();;
    console.log(islandfile)
    var behemothlistfile = db.get("behemoths").value().filter(item => item.islands.includes(islandfile.name));

    let behemothlist="";
    for (behemoth in behemothlistfile){
      behemothlist +=  "• " + behemothlistfile[behemoth]["name"] + "\n";
    }
      let gatherablelist="";
      for (gatherable in islandfile.gatherables){
        gatherablelist +=  "• " + islandfile.gatherables[gatherable]["name"] + "\n";
      }

        const embed = new Discord.RichEmbed();
        embed.setDescription(islandfile.description)
             .setThumbnail(islandfile.icon_url)
             .setAuthor(islandfile.name,"",islandfile.wiki_url)
             if(behemothlist != ""){
               embed.addField('Behemoths',behemothlist)
           }
            if(gatherablelist!= ""){
             embed.addField("Gatherables",gatherablelist);
           }
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
