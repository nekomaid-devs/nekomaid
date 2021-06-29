module.exports = {
    name: "dog",
    category: "Fun",
    description: "Sends a random image of a dog-",
    helpUsage: "`",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        var obj = await command_data.bot.neko.sfw.woof();
        let embedDog = {
            title: "Here's a dog, just for you-",
            color: 8388736,
            image: {
                url: obj.url
            },
            footer: {
                text: "Requested by " + command_data.msg.author.tag
            }
        }
        
        command_data.msg.channel.send("", { embed: embedDog }).catch(e => { console.log(e); });
    },
};