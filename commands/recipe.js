exports.run = (client, message, args, Discord) => {
  const fs = require("fs");
  const low = require("lowdb");
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('./data/dauntlessdata.json');
  const db = low(adapter);
  try {
    if (args[args.length - 2] == "to") {
      args.splice(args.length - 2, 1);
    }
    const armorarray = ['helmet', 'chestplate', 'gauntlets', 'greaves'];
    const exoticarray = ['hunger', 'grace', 'godhand', 'echo'];
    const weaponarray = ['axe', 'chainblades', 'hammer', 'sword', 'warpike']
    if (args.includes('base')) {
      args[args.indexOf('base')] = 0;
    }


    let regex = new RegExp(args[0] + " " + args[1], 'i');
    var recipefile = db.get("armour").find(function(o) {
      for (i in o["itemnames"]) {
        if (regex.test(o['itemnames'][i])) {
          return true;
        }
      }
      return false
    }).value();
    if (recipefile) {
      armourpiece = recipefile.itemnames.findIndex(function(o) {
        return regex.test(o)
      })
      if (recipefile['items'][armourpiece]['recipe_cost'].length == 0) {
        return message.channel.send("This recipe is not fully known yet try again later!")
      }

      if (args[args.length - 1] == 'total' && isNaN(parseInt(args[args.length - 2]))) {
        args[args.length - 1] = 0;
        args[args.length] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      } else if (args[args.length - 1] == 'total') {
        args[args.length - 1] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      }

      if (parseInt(args[2]) > recipefile['items'][armourpiece]['recipe_cost'].length - 1) {
        args[2] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      }

      if (args.length == 4 && parseInt(args[3]) > recipefile['items'][armourpiece]['recipe_cost'].length - 1) {
        args[3] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      }

      if (args.length == 4 && parseInt(args[2]) > recipefile['items'][armourpiece]['recipe_cost'].length - 1) {
        args[2] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      }
      if (args.length == 3) {
        var tiers = [parseInt(args[2])];
        args.splice(2, 1)
      } else if (args.length == 4 && args[3] == args[2]) {
        var tiers = [parseInt(args[2])];
        args.splice(2, 2)
      } else if (args.length == 4) {
        var tiers = [parseInt(args[2]), parseInt(args[3])];
        args.splice(2, 2)
      }
      if (tiers == null) {
        tiers = [0, recipefile['items'][armourpiece]['recipe_cost'].length - 1]
      }
      if (tiers.length == 2) {
        recipecalc = [];
        for (tier = tiers[0]; tier <= tiers[1]; tier++) {
          for (index in recipefile['items'][armourpiece]['recipe_cost'][tier]) {
            for (let j in recipecalc) {
              var found = false;
              if (recipecalc[j]["name"] == recipefile['items'][armourpiece]['recipe_cost'][tier][index]['name']) {
                recipecalc[j]["amount"] += recipefile['items'][armourpiece]['recipe_cost'][tier][index]['amount'];
                found = true;
                break;
              }
            }
            if (found != true) {
              var jsonarray = {
                name: recipefile['items'][armourpiece]['recipe_cost'][tier][index]['name'],
                amount: recipefile['items'][armourpiece]['recipe_cost'][tier][index]['amount']
              }
              recipecalc.push(jsonarray);
            }


          }
        }
        recipecalc.sort(function(a, b) {
          return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);
        })
        var recipestring = "";
        for (var items in recipecalc) {
          recipestring += `•  ${recipecalc[items]["name"]}: ${recipecalc[items]["amount"]} \n`;
        }
      } else if (tiers.length == 1) {
        var recipestring = "";
        for (var items in recipefile['items'][armourpiece]['recipe_cost'][tiers[0]]) {
          recipestring += `•  ${recipefile['items'][armourpiece]['recipe_cost'][tiers[0]][items]["name"]}: ${recipefile['items'][armourpiece]['recipe_cost'][tiers[0]][items]["amount"]} \n`;
        }
      }
      var embed = new Discord.RichEmbed();
      embed.setAuthor(recipefile['items'][armourpiece]['name'], "")
        .setColor("#0033cc")
        .setThumbnail(recipefile['items'][armourpiece]['icon_url']);
      if (tiers[0] == 0 && tiers[1] == 10) {
        embed.addField(`Recipe cost for Total`, recipestring)
      } else if (tiers[0] == recipefile['items'][armourpiece]['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${recipefile['items'][armourpiece]['recipe_cost'].length-1}`, recipestring)
      } else if (tiers[0] == '0' && tiers[1]) {
        embed.addField(`Recipe cost for base to +${tiers[1]}`, recipestring)
      } else if (tiers[0] == '0' && !tiers[1]) {
        embed.addField(`Recipe cost for Base`, recipestring)
      } else if (tiers.length == 2 && tiers[1] <= recipefile['items'][armourpiece]['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`, recipestring)
      } else {
        embed.addField(`recipe cost for +${tiers[0]}`, recipestring)

      }

      message.channel.send({
        embed
      });
      return;
    }

    if (armorarray.indexOf(args[1]) > -1 || armorarray.indexOf(args[2]) > -1) {
      if (armorarray.indexOf(args[1]) > -1) {
        var armorpiece = armorarray.indexOf(args[1])
      } else if (armorarray.indexOf(args[2]) > -1) {
        var armorpiece = armorarray.indexOf(args[2])
      }
      console.log(armorpiece)
      if (armorpiece != null) {
        regex = new RegExp(args[0] + ".*", 'i');
        var recipefile = db.get("armour").find(behemoth => regex.test(behemoth.boss)).value();
        if (!recipefile) {
          message.channel.send("That behemoth is unknown try another behemoth!");
          return;
        }
        if (armorarray.indexOf(args[1]) == -1) {
          args.splice(1, 1);
        }
        if (args[args.length - 1] == 'total' && isNaN(parseInt(args[args.length - 2]))) {
          args[args.length - 1] = 0;
          args[args.length] = recipefile['items'][armorpiece]['recipe_cost'].length - 1;
        } else if (args[args.length - 1] == 'total') {
          args[args.length - 1] = recipefile['items'][armorpiece]['recipe_cost'].length - 1;
        }

        if (parseInt(args[2]) > recipefile['items'][armorpiece]['recipe_cost'].length) {
          args[2] = recipefile['items'][armorpiece]['recipe_cost'].length - 1;
        }

        if (args.length == 4 && parseInt(args[3]) > recipefile['items'][armorpiece]['recipe_cost'].length - 1) {
          args[3] = recipefile['items'][armorpiece]['recipe_cost'].length - 1;
        }

        if (args.length == 4 && parseInt(args[2]) > recipefile['items'][armorpiece]['recipe_cost'].length - 1) {
          args[2] = recipefile['items'][armorpiece]['recipe_cost'].length - 1;
        }

        if (args.length == 3) {
          var tiers = [parseInt(args[2])];
          args.splice(2, 1)
        }
        if (args.length == 4 && args[3] == args[2]) {
          var tiers = [parseInt(args[2])];
          args.splice(2, 2)
        } else if (args.length == 4) {
          var tiers = [parseInt(args[2]), parseInt(args[3])];
          args.splice(2, 2)
        }
        if (tiers == null) {
          tiers = [0, recipefile['items'][armorpiece]['recipe_cost'].length - 1]
        }
        if (tiers.length == 2) {
          recipecalc = [];
          for (tier = tiers[0]; tier <= tiers[1]; tier++) {
            for (index in recipefile['items'][armorpiece]['recipe_cost'][tier]) {
              for (let j in recipecalc) {
                var found = false;
                if (recipecalc[j]["name"] == recipefile['items'][armorpiece]['recipe_cost'][tier][index]['name']) {
                  recipecalc[j]["amount"] += recipefile['items'][armorpiece]['recipe_cost'][tier][index]['amount'];
                  found = true;
                  break;
                }
              }
              if (found != true) {
                var jsonarray = {
                  name: recipefile['items'][armorpiece]['recipe_cost'][tier][index]['name'],
                  amount: recipefile['items'][armorpiece]['recipe_cost'][tier][index]['amount']
                }
                recipecalc.push(jsonarray);
              }


            }
          }
          recipecalc.sort(function(a, b) {
            return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);
          })
          var recipestring = "";
          for (var items in recipecalc) {
            recipestring += `•  ${recipecalc[items]["name"]}: ${recipecalc[items]["amount"]} \n`;
          }
        } else if (tiers.length == 1) {
          var recipestring = "";
          for (var items in recipefile['items'][armorpiece]['recipe_cost'][tiers[0]]) {
            recipestring += `•  ${recipefile['items'][armorpiece]['recipe_cost'][tiers[0]][items]["name"]}: ${recipefile['items'][armorpiece]['recipe_cost'][tiers[0]][items]["amount"]} \n`;
          }
        }
        var embed = new Discord.RichEmbed();
        embed.setAuthor(recipefile['items'][armorpiece]['name'], "")
          .setColor("#0033cc")
          .setThumbnail(recipefile['items'][armorpiece]['icon_url']);
        if (tiers[0] == 0 && tiers[1] == 10) {
          embed.addField(`Recipe cost for Total`, recipestring)
        } else if (tiers[0] == recipefile['items'][armorpiece]['recipe_cost'].length - 1) {
          embed.addField(`Recipe cost for +${recipefile['items'][armorpiece]['recipe_cost'].length-1}`, recipestring)
        } else if (tiers[0] == '0' && tiers[1]) {
          embed.addField(`Recipe cost for base to +${tiers[1]}`, recipestring)
        } else if (tiers[0] == '0' && !tiers[1]) {
          embed.addField(`Recipe cost for Base`, recipestring)
        } else if (tiers.length == 2 && tiers[1] <= recipefile['items'][armorpiece]['recipe_cost'].length - 1) {
          embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`, recipestring)
        } else {
          embed.addField(`recipe cost for +${tiers[0]}`, recipestring)

        }

        message.channel.send({embed});
        return;
      }
    }
    regex = new RegExp(args[0] + " " + args[1], 'i');
    var recipefile = db.get("weapons").find(function(o) {
      for (i in o["itemnames"]) {
        if (regex.test(o['itemnames'][i])) {
          return true;
        }
      }
      return false
    }).value();
    if (recipefile) {
      weaponpiece = recipefile.itemnames.findIndex(function(o) {
        return regex.test(o)
      })
      if (recipefile['items'][weaponpiece]['recipe_cost'].length == 0) {
        return message.channel.send("This recipe is not fully known yet try again later!")
      }

      if (args[args.length - 1] == 'total' && isNaN(parseInt(args[args.length - 2]))) {
        args[args.length - 1] = 0;
        args[args.length] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      } else if (args[args.length - 1] == 'total') {
        args[args.length - 1] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      }

      if (parseInt(args[2]) > recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      }

      if (args.length == 4 && parseInt(args[3]) > recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        args[3] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      }

      if (args.length == 4 && parseInt(args[2]) > recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      }
      if (args.length == 3) {
        var tiers = [parseInt(args[2])];
        args.splice(2, 1)
      } else if (args.length == 4 && args[3] == args[2]) {
        var tiers = [parseInt(args[2])];
        args.splice(2, 2)
      } else if (args.length == 4) {

        var tiers = [parseInt(args[2]), parseInt(args[3])];
        args.splice(2, 2)
      }
      if (tiers == null) {

        tiers = [0, recipefile['items'][weaponpiece]['recipe_cost'].length - 1]
      }
      if (tiers.length == 2) {
        recipecalc = [];
        for (tier = tiers[0]; tier <= tiers[1]; tier++) {
          for (index in recipefile['items'][weaponpiece]['recipe_cost'][tier]) {
            for (let j in recipecalc) {
              var found = false;
              if (recipecalc[j]["name"] == recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name']) {
                recipecalc[j]["amount"] += recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount'];
                found = true;
                break;
              }
            }
            if (found != true) {
              var jsonarray = {
                name: recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name'],
                amount: recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount']
              }
              recipecalc.push(jsonarray);
            }


          }
        }
        recipecalc.sort(function(a, b) {
          return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);
        })
        var recipestring = "";
        for (var items in recipecalc) {
          recipestring += `•  ${recipecalc[items]["name"]}: ${recipecalc[items]["amount"]} \n`;
        }
      } else if (tiers.length == 1) {
        var recipestring = "";
        for (var items in recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]]) {
          recipestring += `•  ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["name"]}: ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["amount"]} \n`;
        }
      }
      var embed = new Discord.RichEmbed();
      embed.setAuthor(recipefile['items'][weaponpiece]['name'], "")
        .setColor("#0033cc")
        .setThumbnail(recipefile['items'][weaponpiece]['icon_url']);
      if (tiers[0] == 0 && tiers[1] == 10) {
        embed.addField(`Recipe cost for Total`, recipestring)
      } else if (tiers[0] == recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${recipefile['items'][weaponpiece]['recipe_cost'].length-1}`, recipestring)
      } else if (tiers[0] == '0' && tiers[1]) {
        embed.addField(`Recipe cost for base to +${tiers[1]}`, recipestring)
      } else if (tiers[0] == '0' && !tiers[1]) {
        embed.addField(`Recipe cost for Base`, recipestring)
      } else if (tiers.length == 2 && tiers[1] <= recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`, recipestring)
      } else {
        embed.addField(`recipe cost for +${tiers[0]}`, recipestring)

      }

      message.channel.send({
        embed
      });
      return;
    }
    if (weaponarray.indexOf(args[1]) > -1 || weaponarray.indexOf(args[2]) > -1) {
      if (weaponarray.indexOf(args[1]) > -1) {
        var weaponpiece = weaponarray.indexOf(args[1])
      } else if (weaponarray.indexOf(args[2]) > -1) {
        var weaponpiece = weaponarray.indexOf(args[2])
      }
      if (typeof weaponpiece !== 'undefined') {
        regex = new RegExp(args[0] + ".*", 'i');
        var recipefile = db.get("weapons").find(behemoth => regex.test(behemoth.name)).value();
        if (!recipefile) {
          message.channel.send("That behemoth is unknown try another behemoth!");
          return;
        }
        if (recipefile['items'][weaponpiece]['recipe_cost'].length == 0) {
          return message.channel.send("This recipe is not fully known yet try again later!")
        }
        if (weaponarray.indexOf(args[1]) == -1) {
          args.splice(1, 1);
        }

        if (args[args.length - 1] == 'total' && isNaN(parseInt(args[args.length - 2]))) {
          args[args.length - 1] = 0;
          args[args.length] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
        } else if (args[args.length - 1] == 'total') {
          args[args.length - 1] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
        }

        if (parseInt(args[2]) > recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
          args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
        }

        if (args.length == 4 && parseInt(args[3]) > recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
          args[3] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
        }

        if (args.length == 4 && parseInt(args[2]) > recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
          args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
        }
        if (args.length == 3) {
          var tiers = [parseInt(args[2])];
          args.splice(2, 1)
        } else if (args.length == 4 && args[3] == args[2]) {
          var tiers = [parseInt(args[2])];
          args.splice(2, 2)
        } else if (args.length == 4) {
          var tiers = [parseInt(args[2]), parseInt(args[3])];
          args.splice(2, 2)
        }
        if (tiers == null) {
          tiers = [0, recipefile['items'][weaponpiece]['recipe_cost'].length - 1]
        }
        if (tiers.length == 2) {
          recipecalc = [];
          for (tier = tiers[0]; tier <= tiers[1]; tier++) {
            for (index in recipefile['items'][weaponpiece]['recipe_cost'][tier]) {
              for (let j in recipecalc) {
                var found = false;
                if (recipecalc[j]["name"] == recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name']) {
                  recipecalc[j]["amount"] += recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount'];
                  found = true;
                  break;
                }
              }
              if (found != true) {
                var jsonarray = {
                  name: recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name'],
                  amount: recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount']
                }
                recipecalc.push(jsonarray);
              }


            }
          }
          recipecalc.sort(function(a, b) {
            return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);
          })
          var recipestring = "";
          for (var items in recipecalc) {
            recipestring += `•  ${recipecalc[items]["name"]}: ${recipecalc[items]["amount"]} \n`;
          }
        } else if (tiers.length == 1) {
          var recipestring = "";
          for (var items in recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]]) {
            recipestring += `•  ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["name"]}: ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["amount"]} \n`;
          }
        }
        var embed = new Discord.RichEmbed();
        embed.setAuthor(recipefile['items'][weaponpiece]['name'], "")
          .setColor("#0033cc")
          .setThumbnail(recipefile['items'][weaponpiece]['icon_url']);
        if (tiers[0] == 0 && tiers[1] == 10) {
          embed.addField(`Recipe cost for Total`, recipestring)
        } else if (tiers[0] == recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
          embed.addField(`Recipe cost for +${recipefile['items'][weaponpiece]['recipe_cost'].length-1}`, recipestring)
        } else if (tiers[0] == '0' && tiers[1]) {
          embed.addField(`Recipe cost for base to +${tiers[1]}`, recipestring)
        } else if (tiers[0] == '0' && !tiers[1]) {
          embed.addField(`Recipe cost for Base`, recipestring)
        } else if (tiers.length == 2 && tiers[1] <= recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
          embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`, recipestring)
        } else {
          embed.addField(`recipe cost for +${tiers[0]}`, recipestring)

        }

        message.channel.send({
          embed
        });
        return;
      }
    }
    if (exoticarray.indexOf(args[1]) > -1 || exoticarray.indexOf(args[0]) > -1) {
      if (exoticarray.indexOf(args[1]) > -1) {
        regex = new RegExp(".*" + args[1], 'i');
        args.splice(0, 1);
      } else if (exoticarray.indexOf(args[0]) > -1) {
        regex = new RegExp(".*" + args[0], 'i');
      }
      var recipefile = db.get("exotics").find(behemoth => regex.test(behemoth.name)).value();
      if (args[args.length - 1] == 'total' && isNaN(parseInt(args[args.length - 2]))) {
        args[args.length - 1] = 0;
        args[args.length] = recipefile['recipe_cost'].length - 1;
      } else if (args[args.length - 1] == 'total') {
        args[args.length - 1] = recipefile['recipe_cost'].length - 1;
      }

      if (parseInt(args[1]) > recipefile['recipe_cost'].length) {
        args[1] = recipefile['recipe_cost'].length - 1;
      }

      if (args.length == 3 && parseInt(args[2]) > recipefile['recipe_cost'].length - 1) {
        args[2] = recipefile['recipe_cost'].length - 1;
      }

      if (args.length == 3 && parseInt(args[1]) > recipefile['recipe_cost'].length - 1) {
        args[1] = recipefile['recipe_cost'].length - 1;
      }

      if (args.length == 2) {
        var tiers = [parseInt(args[1])];
        args.splice(1, 1)
      }
      if (args.length == 3 && args[2] == args[1]) {
        var tiers = [parseInt(args[1])];
        args.splice(1, 2)
      } else if (args.length == 3) {
        var tiers = [parseInt(args[1]), parseInt(args[2])];
        args.splice(1, 2)
      }
      if (tiers == null) {
        tiers = [0, recipefile['recipe_cost'].length - 1]
      }
      if (tiers.length == 2) {
        var recipecalculation = [];
        for (let i = parseInt(tiers[0]); i <= parseInt(tiers[1]); i++) {
          for (var item in recipefile['recipe_cost'][i]) {
            for (let j in recipecalculation) {
              var found = false;
              if (recipecalculation[j]["name"] == recipefile['recipe_cost'][i][item]["name"]) {
                recipecalculation[j]["amount"] += recipefile['recipe_cost'][i][item]["amount"];
                found = true;
                break;
              }
            }
            if (found != true) {
              var jsonarray = {
                name: recipefile['recipe_cost'][i][item]["name"],
                amount: recipefile['recipe_cost'][i][item]["amount"]
              }
              recipecalculation.push(jsonarray);
            }
          }
        }
        var recipestring = "";
        recipecalculation.sort(function(a, b) {
          return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);
        })
        for (var items in recipecalculation) {
          recipestring += `•  ${recipecalculation[items]["name"]}: ${recipecalculation[items]["amount"]} \n`;
        }
      } else if (tiers.length == 1) {
        var recipestring = "";
        for (var items in recipefile['recipe_cost'][tiers[0]]) {
          recipestring += `•  ${recipefile['recipe_cost'][tiers[0]][items]["name"]}: ${recipefile['recipe_cost'][tiers[0]][items]["amount"]} \n`;
        }
      }
      var embed = new Discord.RichEmbed();
      embed.setDescription(recipefile.description)
        .setThumbnail(recipefile.icon_url)
        .setAuthor(recipefile.name, "", recipefile.wiki_url)
        .setColor("#0033cc");
      if (tiers[0] == '0' && tiers[1] == '10') {
        embed.addField(`Recipe cost for Total`, recipestring)
      } else if (tiers[0] == '0' && tiers[1]) {
        embed.addField(`Recipe cost for base to +${tiers[1]}`, recipestring)
      } else if (tiers[0] == '0' && tiers.length == 1) {
        embed.addField(`Recipe cost for Base`, recipestring)
      } else if (tiers[0] == recipefile['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${recipefile['recipe_cost'].length-1}`, recipestring)
      } else if (tiers.length == 2 && tiers[1] <= recipefile['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`, recipestring)
      } else if (args.length == 2 && tiers[1] >= recipefile['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`, recipestring)
      } else {
        embed.addField(`Recipe cost for +${tiers[0]}`, recipestring)
      }

      message.channel.send({
        embed
      });
      return;
    }
    regex = new RegExp(args[0] + ".*", 'i');
    recipefile = db.get("weapons").find(function(o) {
      for (i in o["itemnames"]) {
        if (regex.test(o['itemnames'][i])) {
          return true;
        }
      }
      return false
    }).value();
    if (recipefile) {
      weaponpiece = recipefile.itemnames.findIndex(function(o) {
        return regex.test(o)
      })
      if (recipefile['items'][weaponpiece]['recipe_cost'].length == 0) {
        return message.channel.send("This recipe is not fully known yet try again later!")
      }

      if (args[args.length - 1] == 'total' && isNaN(parseInt(args[args.length - 2]))) {

        args[args.length - 1] = 0;
        args[args.length] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      } else if (args[args.length - 1] == 'total') {
        args[args.length - 1] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      }

      if (parseInt(args[1]) > recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        args[1] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      }

      if (args.length == 3 && parseInt(args[2]) > recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      }

      if (args.length == 3 && parseInt(args[1]) > recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        args[2] = recipefile['items'][weaponpiece]['recipe_cost'].length - 1;
      }
      if (args.length == 2) {

        var tiers = [parseInt(args[1])];
        args.splice(1, 1)
      } else if (args.length == 3 && args[2] == args[1]) {
        var tiers = [parseInt(args[2])];
        args.splice(1, 2)
      } else if (args.length == 3) {
        var tiers = [parseInt(args[1]), parseInt(args[2])];
        args.splice(1, 2)

      }
      if (tiers == null) {
        tiers = [0, recipefile['items'][weaponpiece]['recipe_cost'].length - 1]
      }
      if (tiers.length == 2) {
        recipecalc = [];
        for (tier = tiers[0]; tier <= tiers[1]; tier++) {
          for (index in recipefile['items'][weaponpiece]['recipe_cost'][tier]) {
            for (let j in recipecalc) {
              var found = false;
              if (recipecalc[j]["name"] == recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name']) {
                recipecalc[j]["amount"] += recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount'];
                found = true;
                break;
              }
            }
            if (found != true) {
              var jsonarray = {
                name: recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['name'],
                amount: recipefile['items'][weaponpiece]['recipe_cost'][tier][index]['amount']
              }
              recipecalc.push(jsonarray);
            }


          }
        }
        recipecalc.sort(function(a, b) {
          return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);
        })
        var recipestring = "";
        for (var items in recipecalc) {
          recipestring += `•  ${recipecalc[items]["name"]}: ${recipecalc[items]["amount"]} \n`;
        }
      } else if (tiers.length == 1) {
        var recipestring = "";
        for (var items in recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]]) {
          recipestring += `•  ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["name"]}: ${recipefile['items'][weaponpiece]['recipe_cost'][tiers[0]][items]["amount"]} \n`;
        }
      }
      var embed = new Discord.RichEmbed();
      embed.setAuthor(recipefile['items'][weaponpiece]['name'], "")
        .setColor("#0033cc")
        .setThumbnail(recipefile['items'][weaponpiece]['icon_url']);
      if (tiers[0] == 0 && tiers[1] == 10) {
        embed.addField(`Recipe cost for Total`, recipestring)
      } else if (tiers[0] == recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${recipefile['items'][weaponpiece]['recipe_cost'].length-1}`, recipestring)
      } else if (tiers[0] == '0' && tiers[1]) {
        embed.addField(`Recipe cost for base to +${tiers[1]}`, recipestring)
      } else if (tiers[0] == '0' && !tiers[1]) {
        embed.addField(`Recipe cost for Base`, recipestring)
      } else if (tiers.length == 2 && tiers[1] <= recipefile['items'][weaponpiece]['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`, recipestring)
      } else {
        embed.addField(`recipe cost for +${tiers[0]}`, recipestring)
      }

      message.channel.send({
        embed
      });
      return;
    }

    regex = new RegExp(args[0] + ".*", 'i');
    recipefile = db.get("armour").find(function(o) {
      for (i in o["itemnames"]) {
        if (regex.test(o['itemnames'][i])) {
          return true;
        }
      }
      return false
    }).value();
    if (recipefile) {
      armourpiece = recipefile.itemnames.findIndex(function(o) {
        return regex.test(o)
      })
      if (recipefile['items'][armourpiece]['recipe_cost'].length == 0) {
        return message.channel.send("This recipe is not fully known yet try again later!")
      }

      if (args[args.length - 1] == 'total' && isNaN(parseInt(args[args.length - 2]))) {
        args[args.length - 1] = 0;
        args[args.length] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      } else if (args[args.length - 1] == 'total') {
        args[args.length - 1] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      }

      if (parseInt(args[1]) > recipefile['items'][armourpiece]['recipe_cost'].length - 1) {

        args[1] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      }

      if (args.length == 3 && parseInt(args[2]) > recipefile['items'][armourpiece]['recipe_cost'].length - 1) {
        args[2] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      }

      if (args.length == 3 && parseInt(args[1]) > recipefile['items'][armourpiece]['recipe_cost'].length - 1) {
        args[1] = recipefile['items'][armourpiece]['recipe_cost'].length - 1;
      }
      if (args.length == 2) {
        var tiers = [parseInt(args[1])];
        args.splice(1, 1)
      } else if (args.length == 3 && args[2] == args[1]) {
        var tiers = [parseInt(args[1])];
        args.splice(1, 2)
      } else if (args.length == 3) {
        var tiers = [parseInt(args[1]), parseInt(args[2])];
        args.splice(1, 2)
      }
      if (tiers == null) {
        tiers = [0, recipefile['items'][armourpiece]['recipe_cost'].length - 1]
      }
      if (tiers.length == 2) {
        recipecalc = [];
        for (tier = tiers[0]; tier <= tiers[1]; tier++) {
          for (index in recipefile['items'][armourpiece]['recipe_cost'][tier]) {
            for (let j in recipecalc) {
              var found = false;
              if (recipecalc[j]["name"] == recipefile['items'][armourpiece]['recipe_cost'][tier][index]['name']) {
                recipecalc[j]["amount"] += recipefile['items'][armourpiece]['recipe_cost'][tier][index]['amount'];
                found = true;
                break;
              }
            }
            if (found != true) {
              var jsonarray = {
                name: recipefile['items'][armourpiece]['recipe_cost'][tier][index]['name'],
                amount: recipefile['items'][armourpiece]['recipe_cost'][tier][index]['amount']
              }
              recipecalc.push(jsonarray);
            }


          }
        }
        recipecalc.sort(function(a, b) {
          return (a.amount < b.amount) ? 1 : ((b.amount < a.amount) ? -1 : 0);
        })
        var recipestring = "";
        for (var items in recipecalc) {
          recipestring += `•  ${recipecalc[items]["name"]}: ${recipecalc[items]["amount"]} \n`;
        }
      } else if (tiers.length == 1) {
        var recipestring = "";
        for (var items in recipefile['items'][armourpiece]['recipe_cost'][tiers[0]]) {
          recipestring += `•  ${recipefile['items'][armourpiece]['recipe_cost'][tiers[0]][items]["name"]}: ${recipefile['items'][armourpiece]['recipe_cost'][tiers[0]][items]["amount"]} \n`;
        }
      }
      var embed = new Discord.RichEmbed();
      embed.setAuthor(recipefile['items'][armourpiece]['name'], "")
        .setColor("#0033cc")
        .setThumbnail(recipefile['items'][armourpiece]['icon_url']);
      if (tiers[0] == 0 && tiers[1] == 10) {
        embed.addField(`Recipe cost for Total`, recipestring)
      } else if (tiers[0] == recipefile['items'][armourpiece]['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${recipefile['items'][armourpiece]['recipe_cost'].length-1}`, recipestring)
      } else if (tiers[0] == '0' && tiers[1]) {
        embed.addField(`Recipe cost for base to +${tiers[1]}`, recipestring)
      } else if (tiers[0] == '0' && !tiers[1]) {
        embed.addField(`Recipe cost for Base`, recipestring)
      } else if (tiers.length == 2 && tiers[1] <= recipefile['items'][armourpiece]['recipe_cost'].length - 1) {
        embed.addField(`Recipe cost for +${tiers[0]} to +${tiers[1]}`, recipestring)
      } else {
        embed.addField(`recipe cost for +${tiers[0]}`, recipestring)

      }

      message.channel.send({
        embed
      });
      return;
    }
    let guildinfo = client.getGuild.get(message.guild.id);
    var reply = `Please use one of the following commands:\n\`${guildinfo.guildprefix}Recipe <ItemName> Base\` – Specific information about the materials required to craft an item for the first time\n\`${guildinfo.guildprefix}Recipe <ItemName> Total\` – Specific information about the materials required to craft an item & upgrade it fully\n\`${guildinfo.guildprefix}Recipe <ItemName> <Lower> <Upper>\` – Specific information about the materials required to upgrade an item\n• Replace <ItemName> with the name of the item from the game you are crafting\nTo see more information on using <Lower> & <Upper> type \`${guildinfo.guildprefix}Help\`\n`;
    return message.channel.send(reply)
  } catch (err) {
    console.log(err);
    let guildinfo = client.getGuild.get(message.guild.id);
    var reply = `Please use one of the following commands:\n\`${guildinfo.guildprefix}Recipe <ItemName> Base\` – Specific information about the materials required to craft an item for the first time\n\`${guildinfo.guildprefix}Recipe <ItemName> Total\` – Specific information about the materials required to craft an item & upgrade it fully\n\`${guildinfo.guildprefix}Recipe <ItemName> <Lower> <Upper>\` – Specific information about the materials required to upgrade an item\n• Replace <ItemName> with the name of the item from the game you are crafting\nTo see more information on using <Lower> & <Upper> type \`${guildinfo.guildprefix}Help\`\n`;
    return message.channel.send(reply)
  }
}
exports.conf = {
  name: "recipe",
  aliases: []
};
