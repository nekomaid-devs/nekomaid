const NeededPermission = require("../scripts/helpers/needed_permission");
const NeededArgument = require("../scripts/helpers/needed_argument");

module.exports = {
    name: 'zahando',
    category: 'Moderation',
    description: 'Uses zahando and deletes messages in current channel-',
    helpUsage: "[numberOfMessages] [mention?]` *(1 optional argument)*",
    exampleUsage: "99 /userTag/",
    hidden: false,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [
        new NeededArgument(1, "You need to type in number of messages-", "int>0<100")
    ],
    permissionsNeeded: [
        new NeededPermission("author", "MANAGE_MESSAGES"),
        new NeededPermission("me", "MANAGE_MESSAGES")
    ],
    nsfw: false,
    execute(data) {
        var numOfMessages = parseInt(data.args[0]);
        if(numOfMessages > 99) {
            data.reply(`Cannot delete more than 99 messages~`);
            return;
        }

        //Check for deleteType
        if(data.msg.mentions.users.array().length > 0) {
            //Deleting with filtering
            var targetUser = data.msg.mentions.users.array()[0];
            var targetDisplayName = targetUser.username + "#" + targetUser.discriminator

            //Get messages and remove last one (clear command)
            var messages = Array.from(data.channel.messages.cache.values());
            messages.pop();

            //Filter messages
            var targetMessages = messages.filter(m =>
                m.author.id === targetUser.id
            )
            
            //Get number of filtered messages
            targetMessages = targetMessages.slice(targetMessages.length - numOfMessages, targetMessages.length + 1);
            console.log(`[zahando] Deleting ${targetMessages.length} messages from User(id: ${targetUser.id}) in ${data.channel.name}...`);

            //Remove last one (clear command) and then targetMessages
            data.channel.bulkDelete(1, true).catch(e => { console.log(e) })
            data.channel.bulkDelete(targetMessages, true).then(messages => {
                data.channel.send("Oi Josuke, I used Za Hando and deleted `" + messages.size + "` messages from **" + targetDisplayName + "**- Aint that neat?").then(message => 
                    message.delete({ timeout: 3000 }).catch(e => { console.log(e) })
                ).catch(e => { console.log(e); });
            }).catch(e => { console.log(e) })
        } else {
            //Regular deleting without mention
            console.log(`[zahando] Deleting ${numOfMessages} messages in ${data.channel.name}...`);

            //Remove last one (clear command) and then numOfMessages
            data.channel.bulkDelete(numOfMessages + 1, true).then(messages => {
                var deleteMessagesSize = messages.size - 1;
                data.channel.send("Oi Josuke, I used Za Hando and deleted `" + deleteMessagesSize + "` messages- Aint that neat?").then(message => 
                    message.delete({ timeout: 3000 }).catch(e => { console.log(e) })
                ).catch(e => { console.log(e); });
            }).catch(e => { console.log(e) })
        }
    },
};