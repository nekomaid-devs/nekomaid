const RecommendedArgument = require("../scripts/helpers/recommended_argument");
const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: "clear",
    category: "Moderation",
    description: "Deletes messages in current channel.",
    helpUsage: "[numberOfMessages] [mention?]` *(1 optional argument)*",
    exampleUsage: "99 /user_tag/",
    hidden: false,
    aliases: ["purge"],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in number of messages.", "int>0")
    ],
    argumentsRecommended: [
        new RecommendedArgument(2, "Argument needs to be a mention.", "mention")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_MESSAGES"),
        new NeededPermission("me", "MANAGE_MESSAGES"),
    ],
    nsfw: false,
    async execute(command_data) {
        // TODO: support swapping arguments (or improve the format)
        let num_messages = parseInt(command_data.args[0]);
        if(num_messages > 99) {
            command_data.msg.reply(`Cannot delete more than 99 messages.`);
            return;
        }

        if(command_data.msg.mentions.users.array().length > 0) {
            let target_user = command_data.msg.mentions.users.array()[0];
            let messages = await command_data.msg.channel.messages.fetch({ limit: 99 }).catch(e => { command_data.global_context.logger.api_error(e); });
            messages = Array.from(messages.values());
            
            messages.pop();
            let target_messages = messages.filter(m =>
                m.author.id === target_user.id
            );
            target_messages = target_messages.slice(target_messages.length - num_messages, target_messages.length + 1);

            command_data.msg.channel.bulkDelete(1, true).catch(e => { command_data.global_context.logger.api_error(e); })
            command_data.msg.channel.bulkDelete(target_messages, true).then(messages => {
                command_data.msg.channel.send(`Deleted \`${messages.size}\` messages from **${target_user.tag}**.`).then(message => 
                    message.delete({ timeout: 3000 }).catch(e => { command_data.global_context.logger.api_error(e); })
                ).catch(e => { command_data.global_context.logger.api_error(e); });
            }).catch(e => { command_data.global_context.logger.api_error(e); })
        } else {
            command_data.msg.channel.bulkDelete(num_messages + 1, true).then(messages => {
                let delete_messages_size = messages.size - 1;
                command_data.msg.channel.send(`Deleted \`${delete_messages_size}\` messages.`).then(message => 
                    message.delete({ timeout: 3000 }).catch(e => { command_data.global_context.logger.api_error(e); })
                ).catch(e => { command_data.global_context.logger.api_error(e); });
            }).catch(e => { command_data.global_context.logger.api_error(e); })
        }
    },
};