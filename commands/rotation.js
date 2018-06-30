exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/rotation.json');
  const adapter1 = new FileSync('./data/dauntlessdata.json');
  const db1 = low(adapter1);
  let rotation = client.getIslands.all();
  let behemoths1 = db1.get("behemoths").filter({islands: [rotation[0]["islandname"]]}).value();
  let behemoths2 = db1.get("behemoths").filter({islands: [rotation[1]["islandname"]]}).value();
  let behemoths3 = db1.get("behemoths").filter({islands: [rotation[2]["islandname"]]}).value();
  let behemoths4 = db1.get("behemoths").filter({islands: [rotation[3]["islandname"]]}).value();
  var now = new Date().getTime();
  var date1 = (new Date(rotation[0]["time"]+597600000*2)).getTime() - now;
  var date2 = new Date(rotation[1]["time"]+597600000*2).getTime() - now;
  var date3 = new Date(rotation[2]["time"]).getTime() - now;
  var date4 = new Date(rotation[3]["time"]).getTime() - now;

  const embed = {
      "color": 9324,
      "thumbnail": {
        "url": "http://nireon.me/islands/the_maelstrom.png"
      },
      "author": {
        "name": "Current Maelstrom rotation",
        "url": "https://dauntless.gamepedia.com/The_Maelstrom"
      },
      "fields": [
          {
              "name": `**In Rotation**`,
              "value": `\`\`${rotation[0]["islandname"]}\`\` - leaving in: ${Math.floor(date1 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date1 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths1[0]["name"]}\n • ${behemoths1[1]["name"]}`
            },
            {
                "name": `**In Rotation**`,
                "value": `\`\`${rotation[1]["islandname"]}\`\` - leaving in: ${Math.floor(date2 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date2 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths2[0]["name"]}\n • ${behemoths2[1]["name"]}`
              },
          {
            "name": `**Upcoming**`,
            "value":`\`\`${rotation[2]["islandname"]}\`\` - entering in: ${Math.floor(date3 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date3 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date3 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths3[0]["name"]}\n • ${behemoths3[1]["name"]}`
          },
          {
            "name": `**Upcoming**`,
            "value": `\`\`${rotation[3]["islandname"]}\`\` - entering in: ${Math.floor(date4 / (1000 * 60 * 60 * 24))} Days, ${Math.floor((date4 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))} Hrs, ${Math.floor((date4 % (1000 * 60 * 60)) / (1000 * 60))} Min.\n • ${behemoths4[0]["name"]}\n • ${behemoths4[1]["name"]}`
          }
      ]
    };//597600000
    message.channel.send({embed})
}
