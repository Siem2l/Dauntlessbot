exports.run = (client, message, args, Discord) => {
  const fs = require("fs");
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
    try {
        let exoticfile = db.get("exotics").find({namedb: `${args[0]}${args[1]}`}).value();
        if (args[3] == "to"){
          args.splice(3,1);
          console.log(args);
        }
        if (!args[2] || args[2] == 'total'){
            args[2] = '0';
            args[3] = '10';
        }
        else if (args[2] == 'base'){
          args[2] = '0'
        }
        if (args[2].startsWith("+")){
        args[2] =args[2].substring(1);
        }
         if (args[3].startsWith("+")){
        args[3] = args[3].substring(1);
        }
        if (args.length == 4){
          var recipecalculation = [];
          for (let i = parseInt(args[2]); i <= parseInt(args[3]);i++){
            for(var item in exoticfile.recipe_cost[`${i}`]){
            for(let j in recipecalculation){
              var found = false;
              if (recipecalculation[j]["name"] == item){
                recipecalculation[j]["amount"] += exoticfile.recipe_cost[`${i}`][item];
                found = true;
                break;
              }
            }
            if (found != true){
                var jsonarray = {
                  name:item,
                  amount:exoticfile.recipe_cost[i][item]
                }
                recipecalculation.push(jsonarray);
              }
            }
            }
            var recipestring = "";
            recipecalculation.sort(function(a,b) {return (a.amount<b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);})
            for(var items in recipecalculation){
              recipestring += `•  ${recipecalculation[items]["name"]}: ${recipecalculation[items]["amount"]} \n`;
          }
        } else {
            var recipestring = "";
            for(var items in exoticfile.recipe_cost[args[2]]){

               recipestring += `•  ${items}: ${exoticfile.recipe_cost[args[2]][items]} \n`;
            }
          }
        var  embed = new Discord.RichEmbed();
        embed.setDescription(exoticfile.description)
             .setThumbnail(exoticfile.icon_url)
             .setAuthor(exoticfile.name,"", exoticfile.wiki_url)
             .setColor("#0033cc");

        if (args[2] == '0' && args[3] == '10'){
               embed.addField(`Recipe cost for Total`,recipestring)
        }
        else if (args[2] == '0' && args.length == 4 ){
          embed.addField(`Recipe cost for base => +${args[3]}`,recipestring)
        }
        else if (args[2]== '0'){
          embed.addField(`Recipe cost for Base`,recipestring)
        }
        else if (args.length == 4){
          embed.addField(`Recipe cost for +${args[2]} => +${args[3]}`,recipestring)
        }
        else{
          embed.addField(`Recipe cost for +${args[2]}`,recipestring)

        }

        message.channel.send({embed});
    } catch (err)  {
        console.log(err);

          let guildinfo = client.getGuild.get(message.guild.id);
          let reply = `Please use \`\`${guildinfo.guildprefix}recipe <exotic name> (lower level) (higher level)\`\` with a exotic name from below:\n\`\`prismatic grace, the godhand, the hunger, tragic echo\`\`\n also choose one or two level(s) from below: (Default is total) \n\`\`base, +1, +2, +3, +4, +5, +6, +7, +8, +9, +10 and total\`\``
            message.channel.send(reply);



        }
}
