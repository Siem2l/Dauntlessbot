exports.run = (client, message, args, Discord) => {
  const fs = require("fs");
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
    try {
      let armorarray=['helmet','chestplate','gauntlets','greaves']
      if(armorarray.indexOf(args[1]) > -1 ||armorarray.indexOf(args[2]) > -1){
          var regex = new RegExp( args[0]+".*", 'i');
          var recipefile = db.get("armour").find(behemoth => regex.test(behemoth.boss)).value();
          var behemothfile = db.get("behemoths").find(behemoth => regex.test(behemoth.namedb)).value();;
          if (!recipefile){
            message.channel.send("Behemoth is unknown try another behemoth")
            return;
          }
          var armorpiece;
          if(armorarray.indexOf(args[1])> -1){
          armorpiece = args[1]
          }
          else if(armorarray.indexOf(args[2])> -1){
          armorpiece = args[2]
          }
          else{
            message.channel.send("Please choose an armor/weaponpiece from this list:\n ``'helmet','chestplate','gauntlets','greaves'``")
            return;
          }
          if (args[4] == "to"){
            args.splice(4,1);
          }
          if (args[3] == "to"){
            args.splice(3,1);
          }
          if (args.indexOf('base') > -1){
            args[args.indexOf('base')]='0'
          }
          let intarray = ['0','1','2','3','4','5','6','7','8','9','10']
          var highesttier = -1;
          for (let k in recipefile[armorpiece]['recipe_cost']){
            highesttier++
          }
          if (!args[2] || args[2] == 'total'){
              args[2] = '0';
              let i=-1;
              for (let key in recipefile[armorpiece]['recipe_cost']){
                i++
              }

              args[3] = `${i}`
          }
          else if((!args[3]&& intarray.indexOf(args[2])== -1) || (args[3]=='total' && intarray.indexOf(args[2])== -1) ){
            args[3] = '0';
            let i=-1;
            for (let key in recipefile[armorpiece]['recipe_cost']){
              i++
            }
            args[4] = `${i}`
          }
          if (args.indexOf('total') > -1){
            args[args.indexOf('total')]='10'
          }
          if (args[2].startsWith("+")){
          args[2] =args[2].substring(1);
          }
          if (args.length == 4 && args[3].startsWith("+")){
          args[3] = args[3].substring(1);
          }
          if (args.length == 5 && args[4].startsWith("+")){
          args[4] = args[4].substring(1);
          }
          if (args[args.length-1] > highesttier){
            args[args.length-1] = `${highesttier}`;
          }
          if (intarray.indexOf(args[args.length-1])>-1&&intarray.indexOf(args[args.length-2])>-1){
            var recipecalculation = [];
            for (let i = parseInt(args[args.length-2]); i <= parseInt(args[args.length-1]);i++){
              for(var item in recipefile[armorpiece]['recipe_cost'][`${i}`]){
              for(let j in recipecalculation){
                var found = false;
                if (recipecalculation[j]["name"] == item){
                  recipecalculation[j]["amount"] += recipefile[armorpiece]['recipe_cost'][`${i}`][item];
                  found = true;
                  break;
                }
              }
              if (found != true){
                  var jsonarray = {
                    name:item,
                    amount:recipefile[armorpiece]['recipe_cost'][i][item]
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

          }
          else{
            var recipestring = "";
            for(var items in recipefile[armorpiece]['recipe_cost'][args[2]]){
               recipestring += `•  ${items}: ${recipefile[armorpiece]['recipe_cost'][args[2]][items]} \n`;
          }
        }
        try{
          var pngurl = `https://nireon.me/armour/${armorpiece}/${args[args.length-2]}.png`;
          var  embed = new Discord.RichEmbed();
          embed.setAuthor(recipefile[armorpiece]['name'])
               .setColor("#0033cc");

          if ((args[2] == '0' && args[3] == '10')||(args[3] == '0' && args[4] == '10')){
                 embed.addField(`Recipe cost for Total`,recipestring)
          }
          else if ((args[2] == '0'&& intarray.indexOf(args[3]) > -1)){
            embed.addField(`Recipe cost for base to +${args[3]}`,recipestring)
          }
          else if ((args[3] == '0'&& intarray.indexOf(args[4]) > -1)){
            embed.addField(`Recipe cost for base to +${args[4]}`,recipestring)
          }
          else if (args[2]== '0' || args[3] == 0){
            embed.addField(`Recipe cost for Base`,recipestring)
          }
          else if (args.length == 4 && args[3] <= highesttier){
            embed.addField(`Recipe cost for +${args[2]} to +${args[3]}`,recipestring)
          }
          else if(args.length == 4 && args[3] > highesttier){
            embed.addField(`Recipe cost for +${args[2]} to +${highesttier}`,recipestring)
          }
          else if (args.length == 5 && args[4] <= highesttier){
            embed.addField(`Recipe cost for +${args[3]} to +${args[4]}`,recipestring)
          }
          else if (args.length ==  5 && args[4] >= highesttier){
            embed.addField(`Recipe cost for +${args[3]} to +${highesttier}`,recipestring)
          }
          else{
            embed.addField(`Recipe cost for +${args[2]}`,recipestring)

          }

          message.channel.send({embed});
          return;
}catch(err){
  message.channel.send(`${recipefile[armorpiece]['name']} Does not Have that Level Tier highest tier is: \`\`` + highesttier +'``')
  return;
}

    }else{
        let recipefile = db.get("exotics").find({namedb: `${args[0]}${args[1]}`}).value();
        if (args[3] == "to"){
          args.splice(3,1);
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
         if (args.length == 4 && args[3].startsWith("+")){
        args[3] = args[3].substring(1);
        }
        if (args[args.length-1] > 10){
          args[args.length-1] = 10;
        }
        if (args.length == 4){
          var recipecalculation = [];
          for (let i = parseInt(args[2]); i <= parseInt(args[3]);i++){
            for(var item in recipefile['recipe_cost'][`${i}`]){
            for(let j in recipecalculation){
              var found = false;
              if (recipecalculation[j]["name"] == item){
                recipecalculation[j]["amount"] += recipefile['recipe_cost'][`${i}`][item];
                found = true;
                break;
              }
            }
            if (found != true){
                var jsonarray = {
                  name:item,
                  amount:recipefile['recipe_cost'][i][item]
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
            for(var items in recipefile['recipe_cost'][args[2]]){
               recipestring += `•  ${items}: ${recipefile['recipe_cost'][args[2]][items]} \n`;
            }
          }
        var  embed = new Discord.RichEmbed();
        embed.setDescription(recipefile.description)
             .setThumbnail(recipefile.icon_url)
             .setAuthor(recipefile.name,"", recipefile.wiki_url)
             .setColor("#0033cc");
        if (args[2] == '0' && args[3] == '10'){
               embed.addField(`Recipe cost for Total`,recipestring)
        }
        else if (args[2] == '0' && args.length == 4 ){
          embed.addField(`Recipe cost for base to +${args[3]}`,recipestring)
        }
        else if (args[2]== '0'){
          embed.addField(`Recipe cost for Base`,recipestring)
        }
        else if (args.length == 4 && args[3] < highesttier){
          embed.addField(`Recipe cost for +${args[2]} to +${args[3]}`,recipestring)
        }
        else if (args.length ==  4 && args[3] > highesttier){
          embed.addField(`Recipe cost for +${args[2]} to +${highesttier}`,recipestring)
        }
        else{
          embed.addField(`Recipe cost for +${args[2]}`,recipestring)

        }

        message.channel.send({embed});
        return;
      }
    } catch (err)  {
          let guildinfo = client.getGuild.get(message.guild.id);
          let reply = `Please use \`\`${guildinfo.guildprefix}recipe <Behemothname/ExoticName> <statistic if armour> (lower level) (higher level)\`\` with an exotic from below:\n\`\`prismatic grace, the godhand, the hunger, tragic echo\`\`\n for armor choose a statistic : \`\`Helmet, Chestplate, Gauntlets, Greaves \`\`also you can choose one or two level(s) from below: (Default is total) \n\`\`base, +1, +2, +3, +4, +5, +6, +7, +8, +9, +10 and total\`\``
          message.channel.send(reply);



        }
}
