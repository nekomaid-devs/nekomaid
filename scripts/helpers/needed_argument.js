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

        let argument = command_data.args[this.position - 1];
        switch(this.type) {
            case "mention":
                if(argument.startsWith("<@!") === false || argument.endsWith(">") === false || argument.length !== 22) {
                    command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
                    return false;
                }
                break;

            case "int>0":
                if(isNaN(parseInt(argument))) {
                    command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
                    return false;
                } else if(parseInt(argument) < 0) {
                    embedError.fields[0].value = "Value must be a number above 0.";
                    command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
                    return false;
                }
                break;

            case "float>0":
                if(isNaN(parseFloat(argument))) {
                    command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
                    return false;
                } else if(parseFloat(argument) < 0) {
                    embedError.fields[0].value = "Value must be a number above 0.";
                    command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
                    return false;
                }
                break;
        }

        return true;
    }

    getEmbed(command_data, command) {
        let usage = `\`${command_data.server_config.prefix}${command.name} ${command.helpUsage}\n\`${command_data.server_config.prefix}${command.name} ${command.exampleUsage}\``;
        usage = usage.split("/user_tag/").join(`@${command_data.msg.author.tag}`);
        usage = usage.split("/username/").join(command_data.msg.author.username);
        let embedError = {
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