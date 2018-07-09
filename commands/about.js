exports.run = (client, message, args, Discord) => {
  const embed = {
    "title": "Made by: Nireon#0001",
    "description": "was created to ensure Discord users can easily access information about the game dauntless.",
    "url": "https://nireon.me",
    "color": 12341847,
    "thumbnail": {
      "url": "http://nireon.me/dauntlesslogo.png"
    },
    "author": {
      "name": "About"
    },
    "fields": [
      {
        "name": "Repository",
        "value": "[Github](https://github.com/JustNireon/Dauntlessbot)"
      },
      {
        "name": "Credits",
        "value": "• Mentize - Feedback & Data Formatting. He's also in the same guild as me so 👀 [EU Guild if you are looking for one](https://discord.gg/T5uNuDK) \n• Fresh2k - Providing initial Cell, Armour and Weapon information.(developer of: [dauntlessbuilds.com](http://fresh2k.pythonanywhere.com/) ) \n• Jake - for teaching me a lot about how to manage the data.\n• Dauntless Wiki - For giving me a lot of information which i could use with this bot."
      },
      {
        "name": "Invite the bot to your server!",
        "value": "[Invite](https://discordapp.com/oauth2/authorize?client_id=458254594674393101&permissions=388160&scope=bot)"
      }
    ]
  };
  message.channel.send({ embed });
}
exports.conf = {
  name:"about",
  aliases: []
};
