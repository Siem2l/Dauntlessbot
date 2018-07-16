exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/rotation.json');
  const adapter1 = new FileSync('./data/dauntlessdata.json');
  const db1 = low(adapter1);
  let rotation = client.getIslands.all();

  const embed = new Discord.RichEmbed();
  embed.setAuthor("Current Maelstrom Rotation","","https://dauntless.gamepedia.com/The_Maelstrom")
  .setThumbnail("http://nireon.me/islands/the_maelstrom.png")
  if(rotation.length == 4){
    let behemoths1 = db1.get("behemoths").filter({islands: [rotation[0]["islandname"]]}).value();
    let behemoths2 = db1.get("behemoths").filter({islands: [rotation[1]["islandname"]]}).value();
    let behemoths3 = db1.get("behemoths").filter({islands: [rotation[2]["islandname"]]}).value();
    let behemoths4 = db1.get("behemoths").filter({islands: [rotation[3]["islandname"]]}).value();
    var now = new Date().getTime();
    var date1 = (new Date(rotation[0]["time"]+597600000*2)).getTime() - now;
    var date2 = new Date(rotation[1]["time"]+597600000*2).getTime() - now;
    var date3 = new Date(rotation[2]["time"]).getTime() - now;
    var date4 = new Date(rotation[3]["time"]).getTime() - now;
    embed.addField("**In Rotation**",`\`\`${rotation[0]["islandname"]}\`\` - leaving in: ${Math.floor(date1 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date1 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths1[0]["name"]}\n • ${behemoths1[1]["name"]}`)
         .addField("**In Rotation**",`\`\`${rotation[1]["islandname"]}\`\` - leaving in: ${Math.floor(date2 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date2 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths2[0]["name"]}\n • ${behemoths2[1]["name"]}`)
         .addField("**Upcoming**",`\`\`${rotation[2]["islandname"]}\`\` - entering in: ${Math.floor(date3 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date3 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date3 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths3[0]["name"]}\n • ${behemoths3[1]["name"]}`)
         .addField("**Upcoming**",`\`\`${rotation[3]["islandname"]}\`\` - entering in: ${Math.floor(date4 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date4 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date4 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths4[0]["name"]}\n • ${behemoths4[1]["name"]}`)
  }
  else if(rotation.length == 3 ){
    let behemoths1 = db1.get("behemoths").filter({islands: [rotation[0]["islandname"]]}).value();
    let behemoths2 = db1.get("behemoths").filter({islands: [rotation[1]["islandname"]]}).value();
    let behemoths3 = db1.get("behemoths").filter({islands: [rotation[2]["islandname"]]}).value();
    var now = new Date().getTime();
    var date1 = (new Date(rotation[0]["time"]+597600000*2)).getTime() - now;
    var date2 = new Date(rotation[1]["time"]+597600000*2).getTime() - now;
    var date3 = new Date(rotation[2]["time"]).getTime() - now;
    embed.addField("**In Rotation**",`\`\`${rotation[0]["islandname"]}\`\` - leaving in: ${Math.floor(date1 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date1 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths1[0]["name"]}\n • ${behemoths1[1]["name"]}`)
         .addField("**In Rotation**",`\`\`${rotation[1]["islandname"]}\`\` - leaving in: ${Math.floor(date2 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date2 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths2[0]["name"]}\n • ${behemoths2[1]["name"]}`)
         .addField("**Upcoming**",`\`\`${rotation[2]["islandname"]}\`\` - entering in: ${Math.floor(date3 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date3 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date3 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths3[0]["name"]}\n • ${behemoths3[1]["name"]}`)
  }
  else if(rotation.length == 2){
    let behemoths1 = db1.get("behemoths").filter({islands: [rotation[0]["islandname"]]}).value();
    let behemoths2 = db1.get("behemoths").filter({islands: [rotation[1]["islandname"]]}).value();
    var now = new Date().getTime();
    var date1 = (new Date(rotation[0]["time"]+597600000*2)).getTime() - now;
    var date2 = new Date(rotation[1]["time"]+597600000*2).getTime() - now;
    embed.addField("**In Rotation**",`\`\`${rotation[0]["islandname"]}\`\` - leaving in: ${Math.floor(date1 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date1 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths1[0]["name"]}\n • ${behemoths1[1]["name"]}`)
         .addField("**In Rotation**",`\`\`${rotation[1]["islandname"]}\`\` - leaving in: ${Math.floor(date2 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date2 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths2[0]["name"]}\n • ${behemoths2[1]["name"]}`)
  }
  else if(rotation.length == 1){
    let behemoths1 = db1.get("behemoths").filter({islands: [rotation[0]["islandname"]]}).value();
    var now = new Date().getTime();
    var date1 = (new Date(rotation[0]["time"]+597600000*2)).getTime() - now;
    embed.addField("**In Rotation**",`\`\`${rotation[0]["islandname"]}\`\` - leaving in: ${Math.floor(date1 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date1 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths1[0]["name"]}\n • ${behemoths1[1]["name"]}`)
  }
  embed.setFooter("This data has been provided through the Official Dauntless Wiki. Click on the Title to get linked to the wiki.")
    message.channel.send({embed})
}
exports.conf = {
  name:"rotation",
  aliases: ['rot']
};
