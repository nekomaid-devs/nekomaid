class NeededArgument {
    constructor(pos, reply, type, invalid_reply) {
        this.position = pos;
        this.reply = reply;
        this.type = type;
        this.invalid_reply = invalid_reply;
    }

    passes(command_data, command) {
        let embedError = this.getEmbed(command_data, command);
        if(command_data.args.length < this.position) {
            command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
            return false;
        }

        switch(this.type) {
            case "mention1":
                if(Array.from(command_data.msg.mentions.members.values()).length < this.position) {
                    command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
                    return false;
                }
                break;
        }

        return true;
    }

    getEmbed(command_data, command) {
        let usage = `\`${command_data.server_config.prefix}${command.name} ${command.helpUsage}\n\`${command_data.server_config.prefix}${command.name} ${command.exampleUsage}\``;
        usage = usage.split("/userTag/").join(`@${command_data.msg.author.username}`);
        usage = usage.split("/username/").join(command_data.msg.author.username);
        const embedError = {
            title: "❌ Wrong arguments",
            color: 8388736,
            fields: [ 
                {
                    name: 'Problem:',
                    value: `${this.reply}`
                },
                {
                    name: 'Usage:',
                    value: usage
                }
            ]
        }

        return embedError;
    }
}

module.exports = NeededArgument;