exports.run = (client, message, args, Discord) => {
  try{
    const request = require('request');
    const Hashids = require("hashids");
    const hash = new Hashids("spicy");
    const low = require("lowdb");
    const FileSync = require('lowdb/adapters/FileSync');
    const adapter = new FileSync('./data/dauntlessdata.json');
    const db = low(adapter);
    let arraylink = args[0].split("/")
    let code = arraylink[arraylink.length-1]
    var build = hash.decode(code);
  if (build == ''){
    return message.channel.send("The code at the end of you link is incorrect")
  }

    request(`https://www.dauntless-builder.com/map/v${build[0]}.json`, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  const embed = new Discord.RichEmbed();
  embed.setAuthor("Dauntless Build:")
  gearstring="";
  perkstring="";
  perkfile=[]
  specialfile = [];
  exoticsarray = ["Tragic Echo","Prismatic Grace","The Hunger","The Godhand"]
  //0: version
  //1: weaponname
  //2: weaponlevel
  //3: cellslot1 weapon
  //4: cellslot2 weapons
  //5: helmet named
  //6: helmet level01
  //7: helmet cellslot
  //8: chestplate name
  //9: chestplate level
  //10: chestplate cell
  //11: gauntlets name
  //12: gauntlets level
  //13: gauntlets cell
  //14: greaves name
  //15: greaves level
  //16: greaves cell
  //17: lanternname
  //18: lantern cell
  if (res.body[build[1]]){
    gearstring+= "**Weapon:** " + res.body[build[1]] + " +" + build[2] +"\n";
    if(res.body[build[3]]){
      let cellperks =[]
      cellperks[0] = res.body[build[3]].replace(" Cell","").replace("+","").substr(0,res.body[build[3]].replace(" Cell","").replace("+","").indexOf(" "))
      cellperks[1] = res.body[build[3]].replace(" Cell","").replace("+","").substr(res.body[build[3]].replace(" Cell","").replace("+","").indexOf(" ")+1)
      cellperks[0] = parseInt(cellperks[0])
        for (let j in perkfile){
            var found = false;
            if(perkfile[j]['name'] == cellperks[1]){
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
        }
        if (found != true){
            var jsonarray = {
              name:cellperks[1],
              amount:cellperks[0]
            }
            perkfile.push(jsonarray);
          }
  }
    if(res.body[build[4]]){
      let cellperks =[]
      cellperks[0] = res.body[build[4]].replace(" Cell","").replace("+","").substr(0,res.body[build[4]].replace(" Cell","").replace("+","").indexOf(" "))
      cellperks[1] = res.body[build[4]].replace(" Cell","").replace("+","").substr(res.body[build[4]].replace(" Cell","").replace("+","").indexOf(" ")+1)
        cellperks[0] = parseInt(cellperks[0])
        for (let j in perkfile){
            var found = false;
            if(perkfile[j]['name'] == cellperks[1]){
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
        }
        if (found != true){
            var jsonarray = {
              name:cellperks[1],
              amount:cellperks[0]
            }
            perkfile.push(jsonarray);
          }
    }
//--------------------------Upgraded bonuses loader----------------------
var regex = new RegExp( res.body[build[1]]+".*", 'i');
if (exoticsarray.indexOf(res.body[build[1]]) >-1){
  var weaponfile = db.get("exotics").find({name:res.body[build[1]]}).value();
  specialfile.push(weaponfile["uniqueeffect"])
  }
else{
var weaponfile = db.get("weapons").find({items:[{name:res.body[build[1]]}]}).value();
console.log(res.body[build[1]])
let weaponindex = weaponfile['items'].findIndex(obj => obj.name == res.body[build[1]])
if(weaponfile['items'][weaponindex]["specials"]!= "None"){
  for (let key in weaponfile['items'][weaponindex]["specials"] ){
    specialfile.push(weaponfile['items'][weaponindex]["specials"][key])
  }
}
for (let key in weaponfile['items'][weaponindex]["upgraded_bonus"]){
  for (let j in perkfile){
      var found = false;
      if(perkfile[j]['name'] == key){
        perkfile[j]["amount"] += weaponfile['items'][weaponindex]["upgraded_bonus"][key]
        found = true;
        break;
      }
  }
  if (found != true){
      var jsonarray = {
        name:key,
        amount:weaponfile['items'][weaponindex]["upgraded_bonus"][key]
      }
      perkfile.push(jsonarray);
    }
  }
}
}
  if (res.body[build[5]]){
      gearstring+= "**Helmet:** " + res.body[build[5]] + " +" +build[6] +"\n"
      if(res.body[build[7]]){
        let cellperks =[]
        cellperks[0] = res.body[build[7]].replace(" Cell","").replace("+","").substr(0,res.body[build[7]].replace(" Cell","").replace("+","").indexOf(" "))
        cellperks[1] = res.body[build[7]].replace(" Cell","").replace("+","").substr(res.body[build[7]].replace(" Cell","").replace("+","").indexOf(" ")+1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile){
              var found = false;
              if(perkfile[j]['name'] == cellperks[1]){
                perkfile[j]["amount"] += cellperks[0]
                found = true;
                break;
              }
          }
          if (found != true){
              var jsonarray = {
                name:cellperks[1],
                amount:cellperks[0]
              }
              perkfile.push(jsonarray);
            }
      }
      //--------------------------Upgraded bonuses loader----------------------
      console.log(res.body[build[5]])
      if (exoticsarray.indexOf(res.body[build[5]])>-1){
        var armourfile = db.get("exotics").find({name:res.body[build[5]]}).value();
        specialfile.push(armourfile["uniqueeffect"])
        }
        else{
      var armourfile = db.get("armour").find({helmet:{name:res.body[build[5]]}}).value();
      console.log(res.body[build[5]])
      for (let key in armourfile['helmet']["upgraded_bonus"]){
        for (let j in perkfile){
            var found = false;
            if(perkfile[j]['name'] == key){
              perkfile[j]["amount"] += armourfile['helmet']["upgraded_bonus"][key]
              found = true;
              break;
            }
        }
        if (found != true){
            var jsonarray = {
              name:key,
              amount:armourfile['helmet']["upgraded_bonus"][key]
            }
            perkfile.push(jsonarray);
          }
  }
}
}
  if (res.body[build[8]]){
      gearstring+= "**Chestplate:** " + res.body[build[8]] +" +" + build[9] +"\n"
      if(res.body[build[10]]){
        let cellperks =[]
        cellperks[0] = res.body[build[10]].replace(" Cell","").replace("+","").substr(0,res.body[build[10]].replace(" Cell","").replace("+","").indexOf(" "))
        cellperks[1] = res.body[build[10]].replace(" Cell","").replace("+","").substr(res.body[build[10]].replace(" Cell","").replace("+","").indexOf(" ")+1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile){
              var found = false;
              if(perkfile[j]['name'] == cellperks[1]){
                perkfile[j]["amount"] += cellperks[0]
                found = true;
                break;
              }
          }
          if (found != true){
              var jsonarray = {
                name:cellperks[1],
                amount:cellperks[0]
              }
              perkfile.push(jsonarray);
            }
      }
      //--------------------------Upgraded bonuses loader----------------------
      var regex = new RegExp( res.body[build[8]]+".*", 'i');
      var armourfile = db.get("armour").find({chestplate:{name:res.body[build[8]]}}).value();
      for (let key in armourfile['chestplate']["upgraded_bonus"]){
        for (let j in perkfile){
            var found = false;
            if(perkfile[j]['name'] == key){
              perkfile[j]["amount"] += armourfile['chestplate']["upgraded_bonus"][key]
              found = true;
              break;
            }
        }
        if (found != true){
            var jsonarray = {
              name:key,
              amount:armourfile['chestplate']["upgraded_bonus"][key]
            }
            perkfile.push(jsonarray);
          }
  }
}
  if (res.body[build[11]]){
      gearstring+= "**Gauntlets:** " + res.body[build[11]] +" +" + build[12] +"\n"
      if(res.body[build[13]]){
        let cellperks =[]
        cellperks[0] = res.body[build[13]].replace(" Cell","").replace("+","").substr(0,res.body[build[13]].replace(" Cell","").replace("+","").indexOf(" "))
        cellperks[1] = res.body[build[13]].replace(" Cell","").replace("+","").substr(res.body[build[13]].replace(" Cell","").replace("+","").indexOf(" ")+1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile){
              var found = false;
              if(perkfile[j]['name'] == cellperks[1]){
                perkfile[j]["amount"] += cellperks[0]
                found = true;
                break;
              }
          }
          if (found != true){
              var jsonarray = {
                name:cellperks[1],
                amount:cellperks[0]
              }
              perkfile.push(jsonarray);
            }
      }
      //--------------------------Upgraded bonuses loader----------------------
      var regex = new RegExp( res.body[build[11]]+".*", 'i');
      var armourfile = db.get("armour").find({gauntlets:{name:res.body[build[11]]}}).value();
      for (let key in armourfile['gauntlets']["upgraded_bonus"]){
        for (let j in perkfile){
            var found = false;
            if(perkfile[j]['name'] == key){
              perkfile[j]["amount"] += armourfile['gauntlets']["upgraded_bonus"][key]
              found = true;
              break;
            }
        }
        if (found != true){
            var jsonarray = {
              name:key,
              amount:armourfile['gauntlets']["upgraded_bonus"][key]
            }
            perkfile.push(jsonarray);
          }
  }
}
  if (res.body[build[14]]){
      gearstring+= "**Greaves:** " + res.body[build[14]] +" +" + build[15] +"\n"
      if(res.body[build[16]]){
          let cellperks =[]
          cellperks[0] = res.body[build[16]].replace(" Cell","").replace("+","").substr(0,res.body[build[16]].replace(" Cell","").replace("+","").indexOf(" "))
          cellperks[1] = res.body[build[16]].replace(" Cell","").replace("+","").substr(res.body[build[16]].replace(" Cell","").replace("+","").indexOf(" ")+1)
          cellperks[0] = parseInt(cellperks[0])
          for (let j in perkfile){
              var found = false;
              if(perkfile[j]['name'] == cellperks[1]){
                perkfile[j]["amount"] += cellperks[0]
                found = true;
                break;
              }
          }
          if (found != true){
              var jsonarray = {
                name:cellperks[1],
                amount:cellperks[0]
              }
              perkfile.push(jsonarray);
            }
      }
      //--------------------------Upgraded bonuses loader----------------------
      var regex = new RegExp( res.body[build[14]]+".*", 'i');
      var armourfile = db.get("armour").find({greaves:{name:res.body[build[14]]}}).value();
      for (let key in armourfile['greaves']["upgraded_bonus"]){
        for (let j in perkfile){
            var found = false;
            if(perkfile[j]['name'] == key){
              perkfile[j]["amount"] += armourfile['greaves']["upgraded_bonus"][key]
              found = true;
              break;
            }
        }
        if (found != true){
            var jsonarray = {
              name:key,
              amount:armourfile['greaves']["upgraded_bonus"][key]
            }
            perkfile.push(jsonarray);
          }
  }
}
  if (res.body[build[17]]){
    gearstring+= "**Lantern:** " + res.body[build[17]] +"\n"
    if(res.body[build[18]]){
      let cellperks =[]
      cellperks[0] = res.body[build[18]].replace(" Cell","").replace("+","").substr(0,res.body[build[18]].replace(" Cell","").replace("+","").indexOf(" "))
      cellperks[1] = res.body[build[18]].replace(" Cell","").replace("+","").substr(res.body[build[18]].replace(" Cell","").replace("+","").indexOf(" ")+1)
      cellperks[0] = parseInt(cellperks[0])
        cellperks[0] = parseInt(cellperks[0])
        for (let j in perkfile){
            var found = false;
            if(perkfile[j]['name'] == cellperks[1]){
              perkfile[j]["amount"] += cellperks[0]
              found = true;
              break;
            }
        }
        if (found != true){
            var jsonarray = {
              name:cellperks[1],
              amount:cellperks[0]
            }
            perkfile.push(jsonarray);
          }
    }
  }
  perkfile.sort((a, b) => b.amount - a.amount);
  for (let key in perkfile){
    if (perkfile[key]["amount"] > 6){
      var celllevel = "level06";
    }
    else{
      var celllevel = `level0${perkfile[key]["amount"]}`
    }
    let cellfile = db.get("cells").find({name:perkfile[key]["name"]}).value();
    perkstring += "__•" + " +" +perkfile[key]['amount'] + " " + perkfile[key]['name']+ "__\n"+ cellfile[celllevel] + "\n";

  }

  if (perkstring !=""){
    embed.setDescription(`[Build on website](${args[0]})\n`+ gearstring + "\n"+ perkstring);
  }
  console.log(specialfile)
  if (specialfile.length != 0){
    let specialstring = "";
    for (let i in specialfile){
      if(specialfile[i].startsWith("• ")){
        specialstring += specialfile[i]
      }
      else{
      specialstring += "• " + specialfile[i]
    }
    specialstring += "\n"
    }
    embed.addField("Unique Effect(s)",specialstring)
  }
  /*  var perks = {};
    var regex = new RegExp( res.body[build[1]]+".*", 'i');
    var weaponfile = db.get("weapons").find({items:[{name:res.body[build[1]]}]}).value();
    let weaponindex = weaponfile['items'].findIndex(obj => obj.name == res.body[build[1]])
    for (let key in weaponfile['items'][weaponindex]["upgraded_bonus"]){
      perks[key] = weaponfile['items'][weaponindex]["upgraded_bonus"][key];
      */
  message.channel.send({embed})
});
}catch(err){
  console.log(err);
  return message.channel.send("Something went wrong! contact Nireon#0001 if you want to resolve the issue")
}
}
exports.conf = {
  name:"dbuilds",
  aliases: ["build","dbuild","db"]
};
