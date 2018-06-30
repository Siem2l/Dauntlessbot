exports.run = (client, message, args, Discord) => {
  const SQLite = require("better-sqlite3");
  const sql = new SQLite('./data/guildinfo.sqlite');
  const config = require("../config.json");
  var guildinfo = client.getGuild.get(message.guild.id);

if (message.guild.member(message.author).hasPermission(0x00000008)){
  if (args[0] == null) {args[0] = config.prefix}
  guildinfo =
      {
        guildid: message.guild.id,
        guildprefix: args[0]
    }

  client.setGuild.run(guildinfo);

  message.channel.send("Prefix has been set to``"+ args[0] + "``");
}
else{
  let guildinfo = client.getGuild.get(message.guild.id)
  message.channel.send("You need the admin permission to set the prefix, Current prefix is:\`\` "+ guildinfo["guildprefix"]+" \`\`");
}
}
