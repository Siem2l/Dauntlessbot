const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const talkedRecently = new Set();
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/guildinfo.sqlite')
const sqlrotation = new SQLite('./data/rotation.sqlite')
const fs = require("fs")
const low = require("lowdb");
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./data/dauntlessdata.json');
const db = low(adapter);
//------------------------------------------Ready-------------------------------------------------
client.on('ready', () => {
  client.user.setActivity(`on ${client.guilds.size} servers`);
  console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildinfo';").get();
  if (!table['count(*)']) {
    sql.prepare("CREATE TABLE guildinfo (guildid TEXT UNIQUE, guildprefix TEXT);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }
  client.getGuild = sql.prepare("SELECT * FROM guildinfo WHERE guildid = ?");
  client.setGuild = sql.prepare("INSERT OR REPLACE INTO guildinfo (guildid, guildprefix) VALUES (@guildid, @guildprefix);");
  client.removeGuild = sql.prepare("DELETE FROM guildinfo WHERE guildid = ?;");

  const tablerotation = sqlrotation.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'rotation';").get();
  if (!tablerotation['count(*)']) {
      sqlrotation.prepare("CREATE TABLE rotation (islandname TEXT NOT NULL, time INT NOT NULL);").run();
      sqlrotation.pragma("synchronous = 1");
      sqlrotation.pragma("journal_mode = wal");
    }
  client.getIslands = sqlrotation.prepare("SELECT * FROM rotation ORDER BY time ASC");
  client.getIsland = sqlrotation.prepare("SELECT * FROM rotation WHERE islandname = ?");
  client.setIsland = sqlrotation.prepare("INSERT OR REPLACE INTO rotation (islandname, time) VALUES (@islandname, @time);");
  client.removeIsland = sqlrotation.prepare("DELETE FROM rotation WHERE islandname = ?;");
});
//-------------------------------------------------------------------------------------------------
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
      message.channel.send("Prefix has been set to`` ! ``");
  }
  //---------------------------------------------------------------------------------------------
  //---------------------------------------------Getting guild prefix------------------------
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
  if(!message.content.startsWith(guildinfo.guildprefix)|| message.author.bot) {return;}
      if (talkedRecently.has(message.author.id)) {
          message.channel.send("Wait 3 seconds before sending a new command - " + message.author);
       }
       else {
         talkedRecently.add(message.author.id);
         setTimeout(() => {
            talkedRecently.delete(message.author.id);
          }  , 3000);
          var  args = message.content.toLowerCase().slice(guildinfo.guildprefix.length).trim().split(/ +/g);
          var command = args.shift().toLowerCase();

    //---------------------------------------------------------------------------------------------
    //---------------------------------------------Check if it's a behemoth name command-----------
    try {
      var regex = new RegExp( command+".*", 'i');
      let bm = db.get('behemoths').find(behemoth => regex.test(behemoth.namedb)).value();;
      if (bm){
        var commandbm;
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
        if (args == null){
          args[0] = "behemoth";
        }
        args.unshift(command.toLowerCase());
        args.splice(1,1);
        command = commandbm;
        if (!command){
          message.channel.send("Please choose a valid behemoth and then one of these 4 options `info`, `armour`, `weapon`, `lantern`")
          return;
        }
        else{
        var commandFile = require(`./commands/${command}.js`);
      }

      }
      else {
      var commandFile = require(`./commands/${command}.js`);
    }

    //---------------------Running the command------------------------------------------
      commandFile.run(client, message, args, Discord);
    }
    catch (err)  {
      console.log(err);
      message.channel.send(`Please choose a valid command or a valid behemoth you can find a list of all the commands at \`${guildinfo.guildprefix}help\` and a list of all the behemoths if you type \`${guildinfo.guildprefix}behemoth\`\'`)
    }
}
});

//-------------------------------------------------------------------------------------------------
//-----------------------------------------------Rotation updating---------------------------------
setInterval(function() {let rotation = client.getIslands.all();
  if (rotation[1]["time"]+ 597600000*2 < Date.now()){
  client.removeIsland.run(rotation[0]["islandname"]);
}},30000);
client.login(config.token);
