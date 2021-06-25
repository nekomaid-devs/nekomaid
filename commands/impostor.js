module.exports = {
    name: "impostor",
    category: "Fun",
    description: "I wasn't the impostor...",
    helpUsage: "[mention?]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        if(data.msg.guild.me.hasPermission("MANAGE_MESSAGES") === true) {
            data.msg.suppressEmbeds(true);
        }

        let impostor = command_data.global_context.utils.pick_random([true, false]);
        data.bot.jimp.read((impostor ? './data/wasImpostor.png' : './data/wasntImpostor.png')).then(image => {
            data.bot.jimp.loadFont('./data/font.fnt').then(async(font) => {
                image.print(font, 325 - data.bot.jimp.measureText(font, command_data.tagged_user.username), 157, command_data.tagged_user.username);

                let embedImage = new data.bot.Discord.MessageEmbed()
                .setTitle(command_data.tagged_user.tag + " was " + (impostor ? "" : "not ") + "the impostor-")
                .setColor(8388736)
                .attachFiles([{ attachment: await image.getBufferAsync("image/png"), name: "image.png" }])
                .setImage('attachment://image.png')
                .setFooter(`Requested by ${command_data.msg.author.tag}`);
                
                command_data.msg.channel.send("", { embed: embedImage }).catch(e => { console.log(e); });
            });
        });
    },
};