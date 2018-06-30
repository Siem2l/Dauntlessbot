exports.run = (client, message, args, Discord) => {
    let commandFile = require(`./armour.js`);
    commandFile.run(client, message, args, Discord);
}
