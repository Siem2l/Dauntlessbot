exports.run = (client, message, args, Discord) => {
    let commandFile = require(`./cells.js`);
    commandFile.run(client, message, args, Discord);
}