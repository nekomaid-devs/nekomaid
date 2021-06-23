const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'getemote',
    category: 'Utility',
    description: 'Copies emote on the server-',
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
    async execute(data) {
        var text = data.totalArgument;

        if(data.args.length < 2 && text.includes("https://") === true) {
            data.reply("You need to type in an emote name for links-");
            return;
        }

        data.args.shift();
        var link = data.totalArgument.substring(0, data.totalArgument.indexOf(" "));
        var emoteName = data.args.length > 0 ? data.args.join(" ") : text.substring(text.indexOf(":") + 1, text.indexOf(":", text.indexOf(":") + 1))
        var a = text.indexOf(":", text.indexOf(":") + 1) + 1
        var emoteID = text.substring(a, text.indexOf(">", a))

        if(text.includes("https://") === false && emoteID.length != 18) {
            data.msg.reply("Invalid emoteID length - (" + emoteID + ", " + emoteID.length + "/18)");
            return;
        }

        try {
            var emote = await data.guild.emojis.create(link.includes("https://") === true ? link : "https://cdn.discordapp.com/emojis/" + emoteID, emoteName)

            //Construct message and send it
            var embedEmote = {
                color: 6732650,
                description: "Created new emote `" + emoteName + "` - " + emote.toString()
            }
        } catch(e) {
            const embedError = {
                title: "<:n_error:771852301413384192> No image found at specified location!",
                description: text
            }

            data.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
        }

        data.channel.send("", { embed: embedEmote }).catch(e => { console.log(e); });
    },
};