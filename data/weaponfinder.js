exports.run = (client, message, args, Discord) => {
  const fs = require("fs");
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);

  let regex = new RegExp( args[0]+" "+ args[1], 'i');
  var recipefile = db.get("weapons").find(function(o) {for (i in o["itemnames"]){if (regex.test(o['itemnames'][i])){return true;}}return false}).value();
  if(recipefile){
    weaponpiece = recipefile.itemnames.findIndex(function (o){return regex.test(o)})
      if (recipefile['items'][weaponpiece]['recipe_cost'].length == 0){
        return message.channel.send("This recipe is not fully known yet try again later!")
      }

      if(args[args.length-1]=='total' && isNaN(parseInt(args[args.length-2]))){
        args[args.length-1]= 0;
        args[args.length]= recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }

      else if (args[args.length-1]=='total'){
        args[args.length-1] = recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }

      if( parseInt(args[2]) > recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }

      if( args.length == 4 && parseInt(args[3]) > recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        args[3] = recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }

      if( args.length == 4 && parseInt(args[2]) > recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }
     if (args.length == 3){
        var tiers = [parseInt(args[2])];
        args.splice(2,1)
      }
      else if (args.length == 4&& args[3]== args[2]){
        var tiers = [parseInt(args[2])];
        args.splice(2,2)
      }
      else if(args.length == 4){
        var tiers = [parseInt(args[2]),parseInt(args[3])];
        args.splice(2,2)
      }
      if (tiers == null){
        tiers = [0,recipefile['items'][weaponpiece]['recipe_cost'].length-1]
      }
      if(tiers.length ==2 ){
      recipecalc = [];
      for (tier = tiers[0]; tier <= tiers[1]; tier++){
        for (index in recipefile['items'][weaponpiece]['recipe_cost'][tier]){
          for(let j in recipecalc){
            var found = false;
            if (recipecalc[j]["name"] == recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name']){
              recipecalc[j]["amount"] += recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount'];
              found = true;
              break;
            }
          }
          if (found != true){
              var jsonarray = {
                name:recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name'],
                amount:recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount']
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
        for(var items in recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]]){
           recipestring += `•  ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["name"]}: ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["amount"]} \n`;
        }
      }
      var  embed = new Discord.RichEmbed();
      embed.setAuthor(recipefile['items'][weaponpiece]['name'],"")
           .setColor("#0033cc")
           .setThumbnail(recipefile['items'][weaponpiece]['icon_url']);
      if (tiers[0]== 0 &&tiers[1] == 10){
             embed.addField(`Recipe cost for Total`,recipestring)
      }
      else if (tiers[0] == recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        embed.addField(`Recipe cost for +${recipefile['items'][weaponpiece]['recipe_cost'].length-1}`,recipestring)
      }
      else if (tiers[0] == '0' && tiers[1]){
        embed.addField(`Recipe cost for base to +${tiers[1]}`,recipestring)
      }
      else if (tiers[0]== '0' && !tiers[1]){
        embed.addField(`Recipe cost for Base`,recipestring)
      }
      else if (tiers.length == 2 && tiers[1] <= recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`,recipestring)
      }
      else{
        embed.addField(`Recipe cost for +${tiers[1]}`,recipestring)

      }

      message.channel.send({embed});
      return;
  }
  regex = new RegExp( args[0]+".*", 'i');
  recipefile = db.get("weapons").find(function(o) {for (i in o["itemnames"]){if (regex.test(o['itemnames'][i])){return true;}}return false})
  .value();

  if(recipefile){
    weaponpiece = recipefile.itemnames.findIndex(function (o){return regex.test(o)})
      if (recipefile['items'][weaponpiece]['recipe_cost'].length == 0){
        return message.channel.send("This recipe is not fully known yet try again later!")
      }

      if(args[args.length-1]=='total' && isNaN(parseInt(args[args.length-2]))){
        args[args.length-1]= 0;
        args[args.length]= recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }

      else if (args[args.length-1]=='total'){
        args[args.length-1] = recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }

      if( parseInt(args[2]) > recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }

      if( args.length == 4 && parseInt(args[3]) > recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        args[3] = recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }

      if( args.length == 4 && parseInt(args[2]) > recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length-1;
      }
     if (args.length == 3){
        var tiers = [parseInt(args[2])];
        args.splice(2,1)
      }
      else if (args.length == 4&& args[3]== args[2]){
        var tiers = [parseInt(args[2])];
        args.splice(2,2)
      }
      else if(args.length == 4){
        var tiers = [parseInt(args[2]),parseInt(args[3])];
        args.splice(2,2)
      }
      if (tiers == null){
        tiers = [0,recipefile['items'][weaponpiece]['recipe_cost'].length-1]
      }
      if(tiers.length ==2 ){
      recipecalc = [];
      for (tier = tiers[0]; tier <= tiers[1]; tier++){
        for (index in recipefile['items'][weaponpiece]['recipe_cost'][tier]){
          for(let j in recipecalc){
            var found = false;
            if (recipecalc[j]["name"] == recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name']){
              recipecalc[j]["amount"] += recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount'];
              found = true;
              break;
            }
          }
          if (found != true){
              var jsonarray = {
                name:recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name'],
                amount:recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount']
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
        for(var items in recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]]){
           recipestring += `•  ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["name"]}: ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["amount"]} \n`;
        }
      }
      var  embed = new Discord.RichEmbed();
      embed.setAuthor(recipefile['items'][weaponpiece]['name'],"")
           .setColor("#0033cc")
           .setThumbnail(recipefile['items'][weaponpiece]['icon_url']);
      if (tiers[0]== 0 &&tiers[1] == 10){
             embed.addField(`Recipe cost for Total`,recipestring)
      }
      else if (tiers[0] == recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        embed.addField(`Recipe cost for +${recipefile['items'][weaponpiece]['recipe_cost'].length-1}`,recipestring)
      }
      else if (tiers[0] == '0' && tiers[1]){
        embed.addField(`Recipe cost for base to +${tiers[1]}`,recipestring)
      }
      else if (tiers[0]== '0' && !tiers[1]){
        embed.addField(`Recipe cost for Base`,recipestring)
      }
      else if (tiers.length == 2 && tiers[1] <= recipefile['items'][weaponpiece]['recipe_cost'].length-1){
        embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`,recipestring)
      }
      else{
        embed.addField(`Recipe cost for +${tiers[1]}`,recipestring)

      }

      message.channel.send({embed});
      return;
  }
  }

exports.conf = {
  name:"weaponfinder",
  aliases: []

};
