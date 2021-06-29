const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "getemote",
    category: "Utility",
    description: "Copies emote on the server-",
    helpUsage: "[emote or emote url] [?name]` *(1 optional argument)*",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an emote-", "none")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_EMOJIS"),
        new NeededPermission("me", "MANAGE_EMOJIS")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: re-factor command
        var text = command_data.total_argument;

        if(command_data.args.length < 2 && text.includes("https://") === true) {
            command_data.msg.reply("You need to type in an emote name for links-");
            return;
        }

        command_data.args.shift();
        var link = command_data.total_argument.substring(0, command_data.total_argument.indexOf(" "));
        var emoteName = command_data.args.length > 0 ? command_data.args.join(" ") : text.substring(text.indexOf(":") + 1, text.indexOf(":", text.indexOf(":") + 1))
        var a = text.indexOf(":", text.indexOf(":") + 1) + 1
        var emoteID = text.substring(a, text.indexOf(">", a))

        if(text.includes("https://") === false && emoteID.length != 18) {
            command_data.msg.reply("Invalid emoteID length - (" + emoteID + ", " + emoteID.length + "/18)");
            return;
        }

        try {
            var emote = await command_data.msg.guild.emojis.create(link.includes("https://") === true ? link : "https://cdn.discordapp.com/emojis/" + emoteID, emoteName)

            //Construct message and send it
            let embedEmote = {
                color: 6732650,
                description: "Created new emote `" + emoteName + "` - " + emote.toString()
            }
        } catch(e) {
            const embedError = {
                title: "<:n_error:771852301413384192> No image found at specified location!",
                description: text
            }

            command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
        }

        command_data.msg.channel.send("", { embed: embedEmote }).catch(e => { console.log(e); });
    },
};