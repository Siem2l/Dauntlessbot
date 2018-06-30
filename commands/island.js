exports.run = (client, message, args, Discord) => {
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);


    try {
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
            let reply = "Please use ``!island <island name>`` with a island from below:\n``amber-6, aulrics refuge, burning rose, cerulean-22, cobalt-4, coldrunner key, dyadic drift, frostmarch, iron falls, relevation rock, rooks isle, sandrians stone, underwald, vermillion-18, viridian-12``"
            message.channel.send(reply);
        }
}
