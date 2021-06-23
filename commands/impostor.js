module.exports = {
    name: 'impostor',
    category: 'Fun',
    description: "I wasn't the impostor...",
    helpUsage: "[mention?]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(data) {
        if(data.msg.guild.me.hasPermission("MANAGE_MESSAGES") === true) {
            data.msg.suppressEmbeds(true);
        }

        const impostor = data.bot.pickRandom([true, false]);
        data.bot.jimp.read((impostor ? './data/wasImpostor.png' : './data/wasntImpostor.png')).then(image => {
            data.bot.jimp.loadFont('./data/font.fnt').then(async(font) => {
                image.print(font, 325 - data.bot.jimp.measureText(font, data.taggedUser.username), 157, data.taggedUser.username);
                //Construct embed
                var embedImage = new data.bot.Discord.MessageEmbed()
                .setTitle(data.taggedUserTag + " was " + (impostor ? "" : "not ") + "the impostor-")
                .setColor(8388736)
                .attachFiles([{ attachment: await image.getBufferAsync("image/png"), name: "image.png" }])
                .setImage('attachment://image.png')
                .setFooter(`Requested by ${data.authorTag}`);
        
                //Send message
                data.channel.send("", { embed: embedImage }).catch(e => { console.log(e); });
            });
        });
    },
};