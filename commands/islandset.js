exports.run = (client, message, args, Discord) => {
try {
if(message.author.id !=94907924828127232){return;}
console.log(args)
if (args[0] === 'add'){
  args[1] = args[1].charAt(0).toUpperCase() + args[1].slice(1)
  client.setIsland.run(args[1],parseInt(args[2]))
  return message.channel.send(`Island: ${args[1]} time of entrance(ms): ${args[2]} Has been added`);
}
else if(args[0] === 'remove'){
  args[1] = args[1].charAt(0).toUpperCase() + args[1].slice(1)
  client.removeIsland.run(args[1])
  return message.channel.send(`Island: ${args[1]} has been removed`)
}
}catch(err){
  console.log(err)
}
}
exports.conf = {
  name:"islandset",
  aliases: []
};
