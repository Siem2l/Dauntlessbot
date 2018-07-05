exports.run = (client, message, args, Discord) => {
  const fs = require("fs");
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
  try{
      if (args[args.length-2] == "to"){
      args.splice(args.length-2,1);
      }
      let armorarray=['helmet','chestplate','gauntlets','greaves'];
      let exoticarray=['hunger','grace','godhand','echo'];
      if(args.includes('base')){
        args[args.indexOf('base')] = 0;
      }

      if(armorarray.indexOf(args[1]) > -1 ||armorarray.indexOf(args[2]) > -1){
          if(armorarray.indexOf(args[1]) > -1 ){var armorpiece = armorarray[armorarray.indexOf(args[1])]}
          else if(armorarray.indexOf(args[2]) > -1){var armorpiece = armorarray[armorarray.indexOf(args[2])]}

          if (armorpiece){
              var regex = new RegExp( args[0]+".*", 'i');
              var recipefile = db.get("armour").find(behemoth => regex.test(behemoth.boss)).value();
            if(!recipefile){
              message.channel.send("That behemoth is unknown try another behemoth!");
              return;
            }

          if (armorarray.indexOf(args[1]) == -1){
            args.splice(1,1);
          }

          if(args[args.length-1]=='total' && isNaN(parseInt(args[args.length-2]))){
            args[args.length-1]= 0;
            args[args.length]= recipefile[armorpiece]['recipe_cost'].length-1;
          }

          else if (args[args.length-1]=='total'){
            args[args.length-1] = recipefile[armorpiece]['recipe_cost'].length-1;
          }

          if( parseInt(args[2]) > recipefile[armorpiece]['recipe_cost'].length){
            args[2] = recipefile[armorpiece]['recipe_cost'].length-1;
          }

          if( args.length == 4 && parseInt(args[3]) > recipefile[armorpiece]['recipe_cost'].length-1){
            args[3] = recipefile[armorpiece]['recipe_cost'].length-1;
          }

          if( args.length == 4 && parseInt(args[2]) > recipefile[armorpiece]['recipe_cost'].length-1){
            args[2] = recipefile[armorpiece]['recipe_cost'].length-1;
          }

          if (args.length == 3){
            var tiers = [parseInt(args[2])];
            args.splice(2,1)
          }
          if (args.length == 4&& args[3]== args[2]){
            var tiers = [parseInt(args[2])];
            args.splice(2,2)
          }
          else if(args.length == 4){
            var tiers = [parseInt(args[2]),parseInt(args[3])];
            args.splice(2,2)
          }
          if (tiers == null){
            tiers = [0,recipefile[armorpiece]['recipe_cost'].length-1]
          }
          if(tiers.length ==2 ){
          recipecalc = [];
          for (tier = tiers[0]; tier <= tiers[1]; tier++){
            for (index in recipefile[armorpiece]['recipe_cost'][tier]){
              for(let j in recipecalc){
                var found = false;
                if (recipecalc[j]["name"] == recipefile[armorpiece]['recipe_cost'][tier][index]['name']){
                  recipecalc[j]["amount"] += recipefile[armorpiece]['recipe_cost'][tier][index]['amount'];
                  found = true;
                  break;
                }
              }
              if (found != true){
                  var jsonarray = {
                    name:recipefile[armorpiece]['recipe_cost'][tier][index]['name'],
                    amount:recipefile[armorpiece]['recipe_cost'][tier][index]['amount']
                  }
                  recipecalc.push(jsonarray);
                }


              }
          }
          recipecalc.sort(function(a,b) {return (a.amount<b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);})
          var recipestring = "";
          for(var items in recipecalc){
            recipestring += `•  ${recipecalc[items]["name"]}: ${recipecalc[items]["amount"]} \n`;
            }
          }
          else if(tiers.length ==1){
            var recipestring = "";
            for(var items in recipefile[armorpiece]['recipe_cost'][tiers[0]]){
               recipestring += `•  ${items}: ${recipefile[armorpiece]['recipe_cost'][tiers[0]][items]} \n`;
            }
          }
          var  embed = new Discord.RichEmbed();
          embed.setAuthor(recipefile[armorpiece]['name'],"")
               .setColor("#0033cc");
          if (tiers[0]== 0 &&tiers[1] == 10){
                 embed.addField(`Recipe cost for Total`,recipestring)
          }
          else if (tiers[0] == '0' && tiers[1]){
            embed.addField(`Recipe cost for base to +${tiers[1]}`,recipestring)
          }
          else if (tiers[0]== '0' && !tiers[1]){
            embed.addField(`Recipe cost for Base`,recipestring)
          }
          else if (tiers.length == 2 && tiers[1] <= recipefile[armorpiece]['recipe_cost'].length-1){
            embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`,recipestring)
          }
          else{
            embed.addField(`Recipe cost for +${tiers[1]}`,recipestring)

          }

          message.channel.send({embed});
          return;
}
}
else if(exoticarray.indexOf(args[1]) >-1||exoticarray.indexOf(args[0]) >-1){
  if (exoticarray.indexOf(args[1]) >-1){
  var regex = new RegExp( ".*" + args[1], 'i');
  args.splice(0,1);
}
else if(exoticarray.indexOf(args[0]) >-1){
  var regex = new RegExp( ".*" + args[0], 'i');
}
  var recipefile = db.get("exotics").find(behemoth => regex.test(behemoth.name)).value();
  if(args[args.length-1]=='total' && isNaN(parseInt(args[args.length-2]))){
    args[args.length-1]= 0;
    args[args.length]= recipefile['recipe_cost'].length-1;
  }

  else if (args[args.length-1]=='total'){
    args[args.length-1] = recipefile['recipe_cost'].length-1;
  }

  if( parseInt(args[1]) > recipefile['recipe_cost'].length){
    args[1] = recipefile['recipe_cost'].length-1;
  }

  if( args.length == 3 && parseInt(args[2]) > recipefile['recipe_cost'].length-1){
    args[2] = recipefile['recipe_cost'].length-1;
  }

  if( args.length == 3&& parseInt(args[1]) > recipefile['recipe_cost'].length-1){
    args[1] = recipefile['recipe_cost'].length-1;
  }

  if (args.length == 2){
    var tiers = [parseInt(args[1])];
    args.splice(1,1)
  }
  if (args.length == 3&& args[2]== args[1]){
    var tiers = [parseInt(args[1])];
    args.splice(1,2)
  }
  else if(args.length == 3){
    var tiers = [parseInt(args[1]),parseInt(args[2])];
    args.splice(1,2)
  }
  if (tiers == null){
    tiers = [0,recipefile['recipe_cost'].length-1]
  }
  if (tiers.length == 2){
    var recipecalculation = [];
    for (let i = parseInt(tiers[0]); i <= parseInt(tiers[1]);i++){
      for(var item in recipefile['recipe_cost'][i]){
      for(let j in recipecalculation){
        var found = false;
        if (recipecalculation[j]["name"] == recipefile['recipe_cost'][i][item]["name"]){
          recipecalculation[j]["amount"] += recipefile['recipe_cost'][i][item]["amount"];
          found = true;
          break;
        }
      }
      if (found != true){
          var jsonarray = {
            name:recipefile['recipe_cost'][i][item]["name"],
            amount:recipefile['recipe_cost'][i][item]["amount"]
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
    else if (tiers.length == 1){
      var recipestring = "";
      for(var items in recipefile[armorpiece]['recipe_cost'][tiers[0]]){
         recipestring += `•  ${items}: ${recipefile[armorpiece]['recipe_cost'][tiers[0]][items]} \n`;
      }
    }
    var  embed = new Discord.RichEmbed();
    embed.setDescription(recipefile.description)
         .setThumbnail(recipefile.icon_url)
         .setAuthor(recipefile.name,"", recipefile.wiki_url)
         .setColor("#0033cc");
    if (tiers[0] == '0' && tiers[1] == '10'){
           embed.addField(`Recipe cost for Total`,recipestring)
    }
    else if (tiers[0] == '0' && tiers[1] ){
      embed.addField(`Recipe cost for base to +${tiers[1]}`,recipestring)
    }
    else if (tiers[0]== '0' && tiers.length==1){
      embed.addField(`Recipe cost for Base`,recipestring)
    }
    else if (tiers.length == 2 && tiers[1] <= recipefile['recipe_cost'].length-1){
      embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`,recipestring)
    }
    else if (args.length ==  2 && tiers[1] >= recipefile['recipe_cost'].length-1){
      embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`,recipestring)
    }
    else{
      embed.addField(`Recipe cost for +${tiers[0]}`,recipestring)

    }

    message.channel.send({embed});
    return;
}
}
catch(err){
  console.log(err);
}
/*}catch(err){
  message.channel.send(`${recipefile['name']} Does not Have that Level Tier highest tier is: \`\`` + highesttier +'``')
  return;
}

    }else{
        let recipefile = db.get("exotics").find({namedb: `${args[0]}${args[1]}`}).value();
        if (args[3] == "to"){
          args.splice(3,1);
        }
        var highesttier = -1;
        for (let k in recipefile['recipe_cost']){
          highesttier++
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
          console.log(highesttier);
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
        else if (args.length == 4 && args[3] <= highesttier){
          embed.addField(`Recipe cost for +${args[2]} to +${args[3]}`,recipestring)
        }
        else if (args.length ==  4 && args[3] >= highesttier){
          embed.addField(`Recipe cost for +${args[2]} to +${highesttier}`,recipestring)
        }
        else{
          embed.addField(`Recipe cost for +${args[2]}`,recipestring)

        }

        message.channel.send({embed});
        return;
      }
    } catch (err)  {
      console.log(err);
          let guildinfo = client.getGuild.get(message.guild.id);
          let reply = `Please use \`\`${guildinfo.guildprefix}recipe <Behemothname/ExoticName> <statistic if armour> (lower level) (higher level)\`\` with an exotic from below:\n\`\`prismatic grace, the godhand, the hunger, tragic echo\`\`\n for armor choose a statistic : \`\`Helmet, Chestplate, Gauntlets, Greaves \`\`also you can choose one or two level(s) from below: (Default is total) \n\`\`base, +1, +2, +3, +4, +5, +6, +7, +8, +9, +10 and total\`\``
          message.channel.send(reply);



        }
*/
}
