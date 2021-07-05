const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "getemote",
    category: "Utility",
    description: "Copies emote on the server.",
    helpUsage: "[emote or emote url] [?name]` *(1 optional argument)*",
    exampleUsage: "",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in an emote.", "none")
    ],
    argumentsRecommended: [
        new RecommendedArgument(2, "Argument needs to be a name.", "none")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_EMOJIS"),
        new NeededPermission("me", "MANAGE_EMOJIS")
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: check for required 2-32 emote name
        let text = command_data.total_argument;
        if(command_data.args.length < 2 && text.includes("https://") === true) {
            command_data.msg.reply("You need to type in an emote name for links-");
            return;
        }

        command_data.args.shift();
        let link = command_data.total_argument.substring(0, command_data.total_argument.indexOf(" "));
        let emote_name = command_data.args.length > 0 ? command_data.args.join(" ") : text.substring(text.indexOf(":") + 1, text.indexOf(":", text.indexOf(":") + 1))
        let a = text.indexOf(":", text.indexOf(":") + 1) + 1;
        let emote_ID = text.substring(a, text.indexOf(">", a));

        if(text.includes("https://") === false && emote_ID.length != 18) {
            command_data.msg.reply(`Invalid emoteID length - (${emote_ID}, ${emote_ID.length}/18)`);
            return;
        }

        try {
            let emote = await command_data.msg.guild.emojis.create(link.includes("https://") === true ? link : `https://cdn.discordapp.com/emojis/${emote_ID}`, emote_name);
            let embedEmote = {
                color: 6732650,
                description: `Created new emote \`${emote_name}\` - ${emote.toString()}`
            }
            command_data.msg.channel.send("", { embed: embedEmote }).catch(e => { console.log(e); });
        } catch(e) {
            let embedError = {
                title: "<:n_error:771852301413384192> No image found at specified location!",
                description: link
            }
            console.log(emote_name);

            command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
        }
    },
};