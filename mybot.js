const Discord = require('discord.js');
const Enmap = require("enmap");
const client = new Discord.Client();
const config = require("./config.json");

const talkedRecently = new Set();
const SQLite = require("better-sqlite3");
const sqlguild = new SQLite('./data/guildinfo.sqlite')
const sqlrotation = new SQLite('./data/rotation.sqlite')
const sqlcommands = new SQLite('./data/commanddata.sqlite')
const fs = require("fs")
const low = require("lowdb");
const FileSync =   require('lowdb/adapters/FileSync');
const adapter = new FileSync('./data/dauntlessdata.json');
const db = low(adapter);

const DBL = require("dblapi.js");
const dbl = new DBL(config.dbltoken, client);
dbl.on('posted', () => {
  console.log('Server count posted!');
})

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})
//process.on('unhandledRejection', error => console.error(`Uncaught Promise Rejection:\n${error}`) console.log(error.lineNumber));
//------------------------------------------Ready-------------------------------------------------
client.on('ready', () => {
  client.user.setActivity(`on ${client.guilds.size} servers`);
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
  const table = sqlguild.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildinfo';").get();
  if (!table['count(*)']) {
    sqlguild.prepare("CREATE TABLE guildinfo (guildid TEXT UNIQUE, guildprefix TEXT);").run();
    sqlguild.pragma("synchronous = 1");
    sqlguild.pragma("journal_mode = wal");
  }
  client.getGuild = sqlguild.prepare("SELECT * FROM guildinfo WHERE guildid = ?");
  client.setGuild = sqlguild.prepare("INSERT OR REPLACE INTO guildinfo (guildid, guildprefix) VALUES (@guildid, @guildprefix);");
  client.removeGuild = sqlguild.prepare("DELETE FROM guildinfo WHERE guildid = ?;");

  const tablerotation = sqlrotation.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'rotation';").get();
  if (!tablerotation['count(*)']) {
      sqlrotation.prepare("CREATE TABLE rotation (islandname TEXT NOT NULL, time INT NOT NULL);").run();
      sqlrotation.pragma("synchronous = 1");
      sqlrotation.pragma("journal_mode = wal");
    }
  client.getIslands = sqlrotation.prepare("SELECT * FROM rotation ORDER BY time ASC");
  client.getIsland = sqlrotation.prepare("SELECT * FROM rotation WHERE islandname = ?");
  client.setIsland = sqlrotation.prepare("INSERT OR REPLACE INTO rotation (islandname, time) VALUES (?, ?);");
  client.removeIsland = sqlrotation.prepare("DELETE FROM rotation WHERE islandname = ?;");
  const tablecommands = sqlcommands.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'commanddata';").get();
  if (!tablecommands['count(*)']) {
    sqlcommands.prepare("CREATE TABLE commanddata (command TEXT UNIQUE, amount INT);").run();
    sqlcommands.pragma("synchronous = 1");
    sqlcommands.pragma("journal_mode = wal");
  }
  client.getcommand = sqlcommands.prepare("SELECT * FROM commanddata WHERE command = ?")
  client.setcommand = sqlcommands.prepare("INSERT OR REPLACE INTO commanddata (command, amount) VALUES (?, ?);");
  client.getcommands = sqlcommands.prepare("SELECT * FROM commanddata")
  /// discordbots.org server count
  setInterval(() => {
        dbl.postStats(client.guilds.size);
    }, 1800000);
});
//-------------------------------------------------------------------------------------------------
client.commands = new Enmap();
client.aliases = new Enmap();
fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
    console.log(props)
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.conf.name);
    });
  });
});
//-----------------------------------------------Guildcreate---------------------------------------
client.on("guildCreate", guild => {
  client.user.setActivity(`on ${client.guilds.size} servers`);
  let guildinfo;
  if(!guildinfo){
    guildinfo = {
    guildid: guild.id,
    guildprefix: config.prefix
  }
  }
  client.setGuild.run(guildinfo);
});
//-------------------------------------------------------------------------------------------------
//-----------------------------------------------GuildDelete---------------------------------------
client.on("guildDelete", guild => {
  client.user.setActivity(`on ${client.guilds.size} servers`);
  client.removeGuild.run(guild.id);
});

//---------------------------------------------------------------------------------------------
//-----------------------------------------------Message---------------------------------------
client.on('message', message => {
  if (message.channel.type === "dm") return;
  //---------------------------------------------Emergency prefix reset------------------------
  if(message.mentions.users.has(client.user.id) && message.guild.member(message.author).hasPermission(0x00000008) && message.content.includes("prefix")){
    let guildinfo =
      {
        guildid: message.guild.id,
        guildprefix: config.prefix
      }
      client.setGuild.run(guildinfo)
      message.channel.send("Prefix has been set to`` d ``");
  }
  //---------------------------------------------------------------------------------------------
  //----------- ----------------------------------Getting guild prefix------------------------
  var guildinfo = client.getGuild.get(message.guild.id);
  if(!guildinfo){
    guildinfo =
      {
        guildid: message.guild.id,
        guildprefix: config.prefix
      }
      client.setGuild.run(guildinfo)
  }
  //---------------------------------------------------------------------------------------------
  //---------------------------------------------Message cooldown--------------------------------
  if((!message.content.startsWith(guildinfo.guildprefix) && !message.content.startsWith('<@462941257073819668>'))|| message.author.bot) {return;}
      if (talkedRecently.has(message.author.id)) {
          message.channel.send("Wait 3 seconds before sending a new command - " + message.author);
       }
       else {
         if(message.author.id !=94907924828127232){
         talkedRecently.add(message.author.id);
         setTimeout(() => {
            talkedRecently.delete(message.author.id);
          }  , 3000);
        }
    //--------------------------------------------dauntlessbuilder-------------------------------
    if(message.content.startsWith(guildinfo.guildprefix)){
          var  args = message.content.slice(guildinfo.guildprefix.length).trim().split(/ +/g);
          var command = args.shift().toLowerCase();
    }
    else if(message.content.startsWith('<@462941257073819668>'))
    {
      var  args = message.content.slice(21).trim().split(/ +/g);
      var command = args.shift().toLowerCase();
    }
          if (command == "dbuilds"|| command == "db" || command == "build" || command == "dbuild"){
            let cmddata = client.getcommand.get('dbuilds')
            if (!cmddata){
              client.setcommand.run("dbuilds",1)
            }
            else{
              client.setcommand.run("dbuilds",++cmddata.amount)
            }

            var commandFile = require(`./commands/dbuilds.js`);
            commandFile.run(client, message, args, Discord);
            return;
          }
          args = args.join('|').toLowerCase().split('|');



    //---------------------------------------------------------------------------------------------
    //---------------------------------------------Check if it's a behemoth name command-----------
    try {
      var regex = new RegExp( command+".*", 'i');
      let bm = db.get('behemoths').find(behemoth => regex.test(behemoth.namedb)).value();;
      if (bm){
        if (bm.namedb.indexOf(args[0])>-1){
          args.splice(0,1);
        }
        var commandbm;
        var argcheck = true;
        switch(args[0]){
          case "info":
            commandbm = "behemoth";
            break;
          case "behemoth":
            commandbm = "behemoth";
            break;
          case "armour":
            commandbm = "armour";
            break;
          case "weapon":
            commandbm = "weapon";
            break;
          case "lantern":
            commandbm = "lantern";
            break;
        }
        let armorarray=['helmet','chestplate','gauntlets','greaves'];
        let weaponarray= ['axe','sword','chainblades','warpike','hammer']
        if (armorarray.indexOf(args[0]) > -1){

          commandbm = "armour";
          argcheck = false;
        }
        if (weaponarray.indexOf(args[0]) > -1){
          commandbm = "weapon";
          argcheck = false;
        }
        if(!args[0]) {
          commandbm = "behemoth";
        }
        args.unshift(command.toLowerCase());
        if (argcheck){
        args.splice(1,1);
      }
        command = commandbm;
        if (!command){
          let guildinfo = client.getGuild.get(message.guild.id);
          let reply =`Please use one of the following commands:\n\`${guildinfo.guildprefix}Behemoth Info\` - General information about a specific behemoth\n\`${guildinfo.guildprefix}Behemoth Armour <BodyPart>\` - Specific information about armour from a behemoth\n• Replace <BodyPart> with \`Helmet\`, \`Chestplate\`, \`Legs\`, or \`Greaves\`\n\`${guildinfo.guildprefix}Behemoth <WeaponType>\` - Specific information about weapons from a behemoth\n• Replace <WeaponType> with \`Sword\`, \`Hammer\`, \`Chain Blades\`, \`Axe\`, or \`Warpike\`\n\`${guildinfo.guildprefix}Behemoth Lantern\` - Specific information about lantern from a behemoth\nTo see a list of Behemoth Names, type \`${guildinfo.guildprefix}Behemoth List\`\n`;

          message.channel.send(reply);
          return;
        }
        else{
        var commandFile = require(`./commands/${command}.js`);
      }

      }
      else {
        if (client.commands.has(command)) {
            commandFile = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            commandFile = client.commands.get(client.aliases.get(command));
          }
    }

    //---------------------Running the command------------------------------------------
      if(!commandFile){
        message.channel.send(`Please choose a valid command or a valid behemoth you can find a list of all the commands at \`${guildinfo.guildprefix}help\` and a list of all the behemoths if you type \`${guildinfo.guildprefix}behemoth list\``)
        return;
      }
      let cmddata = client.getcommand.get(commandFile.conf.name)
      if (!cmddata){
        client.setcommand.run(commandFile.conf.name,1)
      }
      else{
        client.setcommand.run(commandFile.conf.name,++cmddata.amount)
      }
      commandFile.run(client, message, args, Discord);
    }
    catch (err)  {
      console.log(err);
      message.channel.send(`Please choose a valid command or a valid behemoth you can find a list of all the commands at \`${guildinfo.guildprefix}help\` and a list of all the behemoths if you type \`${guildinfo.guildprefix}behemoth list\``)
      return;
    }
}
});

//-------------------------------------------------------------------------------------------------
//-----------------------------------------------Rotation updating---------------------------------
setInterval(function() {let rotation = client.getIslands.all();
  if (rotation[0]["time"]+ 604800000*2 < Date.now()){
    console.log(rotation[0]["islandname"]);
  client.removeIsland.run(rotation[0]["islandname"]);
}},150000);
client.login(config.token);
