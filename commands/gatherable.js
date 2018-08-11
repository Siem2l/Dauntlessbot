exports.run = (client, message, args, Discord) => {
  try {
    const low = require("lowdb");
    const FileSync = require('lowdb/adapters/FileSync');
    const adapter = new FileSync('./data/dauntlessdata.json');
    const db = low(adapter);
    let gatherablearray = ['Dashleaf','Ironthistle','Heart Lily','Omnistone','Phoenix Opal','Skybloom',"Slayer's Boon","Wrathwort"]
    console.log(args)
    if (args[0] === "list"){
      let string = "**Gatherable List:**\n\`\`\`"
      for (i in gatherablearray){
        if (i == gatherablearray.length-1){
          string += '• '+gatherablearray[i]
        }else{
          string += '• '+gatherablearray[i]+',\n'
        }
      }
      string += '\`\`\`'
      return message.channel.send(string)
    }

    let regex = new RegExp( args[0]+".*", 'i');

    if (gatherablearray.findIndex(function(item) { return regex.test(item)}) > -1){
      let gatherableitem =  gatherablearray[gatherablearray.findIndex(function(item) { return regex.test(item)})]
      let gatherableslist = db.get('islands').filter({gatherables:[{name:gatherableitem}]}).value();
      if (gatherableslist){
          let string = `Islands with the gatherable **${gatherableitem}**: \`\`\``
          for (let i in gatherableslist){
            if (i === gatherableslist.length-1){
                string += '• '+gatherableslist[i]['name']
            }
            else{
            string += '• '+gatherableslist[i]['name']+',\n'
          }
          }
          string += '\`\`\`'
          return message.channel.send(string)
          }
    }
    return message.channel.send("Gatherable not Recognized")
  }catch(err){
    console.log(err)
    return message.channel.send("Gatherable not Recognized")
  }
}
exports.conf = {
  name:"gatherable",
  aliases: ['gatherables','flowers','plants','plant','flower']
};
