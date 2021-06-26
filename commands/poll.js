const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "poll",
    category: "Utility",
    description: "Creates a poll-",
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
    async execute(command_data) {
        let a = (command_data.total_argument.match(/"/g) || []).length;
        if(a === 0 || a % 2 != 0) {
            command_data.msg.channel.send("Check your syntax before trying to create a poll again-").catch(e => { console.log(e); });
            return;
        }

        let total_argument = command_data.total_argument;
        let parts = [];
        while((total_argument.match(/"/g) || []).length > 0) {
            let b = total_argument.indexOf('"') + '"'.length;
            let part = total_argument.substring(b, total_argument.indexOf('"', b));
            total_argument = total_argument.slice(part.length + b + 1);

            parts.push(part);
        }

        if(parts.length > 11) {
            command_data.msg.channel.send("Maximum number of answers is `10`!").catch(e => { console.log(e); });
            return;
        } else if(parts.length === 1) {
            parts = [parts.shift(), "A", "B", "C"]
        }
        
        let question = parts.shift();
        let description = parts.reduce((acc, curr) => {
            acc += "**" + (i + 1) + ")** " + curr + "\n"; return acc;
        }, "");

        let embedPoll = {
            title: `<:n_poll:771902338646278174> Poll: ${question}`,
            description: description
        }
        let message = await command_data.msg.channel.send("", { embed: embedPoll }).catch(e => { console.log(e); });
        let reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        parts.forEach((part, i) => {
            message.react(reactions[i]);
        });
    },
};