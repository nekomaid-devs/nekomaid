const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "bonk",
    category: "Utility",
    description: "Bonks somebody-",
    helpUsage: "[mention/url]`",
    exampleUsage: "/userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to mention somebody/type an url-", "none")
    ],
    permissionsNeeded: [],
    nsfw: false,
    execute(command_data) {
        // TODO: re-factor command
        return;
        if(command_data.msg.guild.me.hasPermission("MANAGE_MESSAGES") === true) {
            command_data.msg.suppressEmbeds(true);
        }

        var imageURL = "";

        if(command_data.msg.mentions.users.array().length < 1) {
            imageURL = command_data.args[0];

            if(imageURL.startsWith("<")) {
                imageURL = imageURL.replace("<", "").replace(">", "")
            }
        } else {
            imageURL = command_data.msg.mentions.users.array()[0].avatarURL({ format: "png", dynamic: true, size: 1024 });
        }

        command_data.bot.jimp.read({
            url: imageURL,
            headers: {}
        }).then(image => {
            var t0 = Date.now();

            image.writeAsync("image.jpg").then(function() {
                command_data.bot.gm()
                            .in('-geometry', '+0+0')
                            .in('./image.jpg')
                            .implode(-0.4)
                            .in('-geometry', ((image.bitmap.width / 364) * 100) + '%x' + (((image.bitmap.height / 228) * 100) / 2.5) + '%+0+0')
                            .in('./bonk.png')
                            .flatten()
                            .write('image.jpg', function () {
                            var t1 = Date.now();
                            var secTaken = ((t1 - t0) / 1000).toFixed(3);

                            //Construct embed
                            let embedImage = new command_data.global_context.modules.Discord.MessageEmbed()
                            .setTitle("bonk-")
                            .setColor(8388736)
                            .attachFiles(['./image.jpg'])
                            .setImage('attachment://image.jpg')
                            .setFooter(`Requested by ${command_data.msg.author.tag} - Took ${secTaken}s...`);
                    
                            //Send message
                            command_data.msg.channel.send("", { embed: embedImage });
                    });
            });
        })
        .catch(err => {
            console.error(err);
            command_data.msg.reply("Sorry, couldn't process that image-");
        })
    },
};