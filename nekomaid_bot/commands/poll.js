const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'poll',
    category: 'Utility',
    description: 'Creates a poll-',
    helpUsage: '"[question]" "[option1?]" "[option2?] ..."`',
    exampleUsage: '"Does pineapple belong on pizza?" "Yes!" "No..."',
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in a question-", "string")
    ],
    permissionsNeeded: [],
    nsfw: false,
    async execute(data) {
        //Get poll parts
        const a = (data.totalArgument.match(/"/g) || []).length;
        if(a === 0 || a % 2 != 0) {
            data.channel.send("Check your syntax before trying to create a poll again-").catch(e => { console.log(e); });
            return;
        }

        let totalArg = data.totalArgument;
        var parts = [];
        while((totalArg.match(/"/g) || []).length > 0) {
            const b = totalArg.indexOf('"') + '"'.length;
            const content = totalArg.substring(b, totalArg.indexOf('"', b));
            totalArg = totalArg.slice(content.length + b + 1);

            parts.push(content);
        }

        if(parts.length > 11) {
            data.channel.send("Maximum number of answers is `10`!").catch(e => { console.log(e); });
            return;
        } else if(parts.length === 1) {
            parts = [parts.shift(), "A", "B", "C"]
        }

        //Construct embed
        const question = parts.shift();
        let desc = "";
        parts.forEach((part, i) => {
            desc += "**" + (i + 1) + ")** " + part + "\n";
        });

        const embedPoll = {
            title: "<:n_poll:771902338646278174> Poll: " + question,
            description: desc
        }

        //Send and add reactions
        var message = await data.channel.send("", { embed: embedPoll }).catch(e => { console.log(e); });
        const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
        parts.forEach((part, i) => {
            message.react(reactions[i]);
        });
    },
};