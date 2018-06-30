exports.run = (client, message, args, Discord) => {
    let commandFile = require(`./behemoth.js`);
    commandFile.run(client, message, args, Discord);
}