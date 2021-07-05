const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "impostor",
    category: "Fun",
    description: "I wasn't the impostor...",
    helpUsage: "[mention?]`",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a mention.", "mention")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: make impostors change colors
        let impostor = command_data.global_context.utils.pick_random([true, false]);
        command_data.global_context.modules.jimp.read((impostor ? './data/wasImpostor.png' : './data/wasntImpostor.png')).then(image => {
            command_data.global_context.modules.jimp.loadFont('./data/font.fnt').then(async(font) => {
                image.print(font, 325 - command_data.global_context.modules.jimp.measureText(font, command_data.tagged_user.username), 157, command_data.tagged_user.username);

                let embedImage = new command_data.global_context.modules.Discord.MessageEmbed()
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