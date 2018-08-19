exports.run = (client, message, args, Discord) => {

  let guildinfo = client.getGuild.get(message.guild.id);
  var reply = `__User Commands:__\n\n**Behemoth Information:**\n \`${guildinfo.guildprefix}Behemoth Info\` - General information about a specific behemoth\n*Example:* \`${guildinfo.guildprefix}Shockjaw Info\` or \`${guildinfo.guildprefix}Behemoth Shockjaw\`\n\`${guildinfo.guildprefix}Behemoth BodyPart\` - Specific information about armour from a behemoth\n*Example:* \`${guildinfo.guildprefix}Shockjaw Armour Chestplate\` or \`${guildinfo.guildprefix}behemoth shockjaw Armour Chestplate\`\n\`${guildinfo.guildprefix}Behemoth Weapon Type\` - Specific information about weapons from a behemoth\n*Example:* \`${guildinfo.guildprefix}Shockjaw Weapon Axe\` or \`${guildinfo.guildprefix}behemoth shockjaw Weapon Axe\`\n\`${guildinfo.guildprefix}Behemoth Lantern\` - Specific information about lantern from a behemoth\n*Example:* \`${guildinfo.guildprefix}Drask lantern\` or \`${guildinfo.guildprefix}lantern Shrike\`\n\n**Cell Information:**\n\`${guildinfo.guildprefix}Cell CellName\` - Specific information about a specific cell\n*Example:* \`${guildinfo.guildprefix}Cell Medic\``
  var reply2 = `**Armour and Weapon Information:**
\`\`${guildinfo.guildprefix}armour BehemothName Bodypart\`\` - Information about a armourpart (bodyparts are \`\`Helmet\`\`, \`\`Chestplate\`\`, \`\`Gauntlets\`\`, \`\`Greaves\`\`)
*example:* \`\`${guildinfo.guildprefix}armour Drask Helmet\`\`
\`\`${guildinfo.guildprefix}armour ArmourName\`\` - Information about a armourpart
*example:* \`\`${guildinfo.guildprefix}armour Skarn helm\`\`
\`\`${guildinfo.guildprefix}weapon BehemothName WeaponType\`\` - Information about a weapon (Weapontypes are \`\`Sword\`\`, \`\`Chainblades\`\`, \`\`Hammer\`\`, \`\`Axe\`\`, \`\`Warpike\`\` )
*example:* \`\`${guildinfo.guildprefix}weapon Drask axe\`\`
\`\`${guildinfo.guildprefix}weapon WeaponName\`\` - Information about a weapon
*example:* \`\`${guildinfo.guildprefix}weapon StormCutter\`\`
**Exotics also work with these commands**`
  var reply1 = `\n\n**Admin Commands:**\n\`${guildinfo.guildprefix}Prefix\` - Change the bots prefix\n*Example:* \`${guildinfo.guildprefix}Prefix $\`\n\`@Bot Prefix\` - Reset the bots prefix to \`!\`\n\n\nIf you still need help you can join this Discord server!\nhttps:\/\/discord.gg\/tqGBgeY\n`
  var finalreply = `\n\n**Island Information:**\n\`${guildinfo.guildprefix}Island IslandName\` - Specific information about an island or location\n*Example:* \`${guildinfo.guildprefix}Island Amber-22\`\n\`${guildinfo.guildprefix}Rotation\` - Displays the behemoths currently available in the Maelstrom & which behemoths are coming next\n\`${guildinfo.guildprefix}Gatherable GatherableName\` - Shows list of islands where Gatherable is located\n*Example:* \`${guildinfo.guildprefix}Gatherable Slayer\'s Boon\`\n\n**Informational Commands:**\n\`${guildinfo.guildprefix}Behemoth List\` – Lists all available behemoths\n\`${guildinfo.guildprefix}Cell List\` – Lists all available cells\n\`${guildinfo.guildprefix}Island List\` – Lists all available islands\n\`${guildinfo.guildprefix}Gatherable List\` – Lists all available Gatherables\n\`${guildinfo.guildprefix}About\` – Lists general information about the bot`

  var recipeexotic = `**Exotic Recipe Information:**\n\`${guildinfo.guildprefix}Recipe ExoticName Base\` – Specific information about the materials required to craft an exotic for the first time\n*Example:* \`${guildinfo.guildprefix}Recipe Prismatic Grace Base\`\n\`${guildinfo.guildprefix}Recipe ExoticName Total\` – Specific information about the materials required to craft an exotic & upgrade it fully\n*Example:* \`${guildinfo.guildprefix}Recipe Tragic Echo Total\`\n\`${guildinfo.guildprefix}Recipe ExoticName <Lower> <Upper>\` – Specific information about the materials required to craft & upgrade an exotic\n• \`<Lower>\` Refers to the lowest level of the item you will be crafting\n• \`<Upper>\` Refers to the higher level of the item you will be crafting\nExample: \`${guildinfo.guildprefix}Recipe The Hunger +2 +8\`\n\n`
  var recipearmorandwepaon   = `**Armour Recipe Information:**\n\`${guildinfo.guildprefix}Recipe <BehemothName> <BodyPart> Base\` – Specific information about the materials required to craft an item for the first time\n• Replace \`<BodyPart>\` with either Helmet, Chest Plate, Gauntlets, or Greaves\n*Example:* \`${guildinfo.guildprefix}Recipe Drask Helmet Base\`\n\`${guildinfo.guildprefix}Recipe <BehemothName> <BodyPart> Total\`  – Specific information about the materials required to craft an item & upgrade it fully\n*Example:* \`${guildinfo.guildprefix}Recipe Drask Greaves Total\`\n\`${guildinfo.guildprefix}Recipe <Behemoth Name> <BodyPart> <Lower> <Upper>\` – Specific information about the materials required to craft & upgrade an item\n• \`<Lower>\` Refers to the lowest level of the item you will be crafting\n• \`<Upper>\` Refers to the higher level of the item you will be crafting\nExample: \`${guildinfo.guildprefix}Recipe Drask Gauntlets +4 +9\`\n**Weapon Recipe Information:**\n\`${guildinfo.guildprefix}Recipe <BehemothName> <WeaponType> Base\` – Specific information about the materials required to craft an item for the first time\n• Replace \`<WeaponType>\` with either Sword, Hammer, Chain Blades, Axe, or Warpike\n*Example:* \`${guildinfo.guildprefix}Recipe Drask Axe Base\`\n\`${guildinfo.guildprefix}Recipe <BehemothName> <WeaponType> Total\`  – Specific information about the materials required to craft an item & upgrade it fully\n*Example:* \`${guildinfo.guildprefix}Recipe Drask Warpike Total\`\n\`${guildinfo.guildprefix}Recipe <BehemothName> <WeaponType> <Lower> <Upper>\` – Specific information about the materials required to craft & upgrade an item\n• \`<Lower>\` Refers to the lowest level of the item you will be crafting\n• \`<Upper>\` Refers to the higher level of the item you will be crafting\nExample: \`${guildinfo.guildprefix}Recipe Drask Sword +4 +9\``
if (args[0] == "server"&&message.guild.id != 254109857819525132){
  message.channel.send(reply)
  message.channel.send(recipeexotic)
  message.channel.send(recipearmorandwepaon)
  message.channel.send(finalreply)
  message.channel.send(reply1)
  return;
}
else{
  message.author.send(reply)
  message.author.send(reply2)
  message.author.send(recipeexotic)
  message.author.send(recipearmorandwepaon)
  message.author.send(finalreply)
    message.author.send(reply1)
  message.channel.send("Sent you a private message with information about the commands!")
  return;
}
}
exports.conf = {
  name:"help",
  aliases: ["commands"]

};
