class Argument {
    constructor(_position, _reply, _type, _invalid_reply, _is_needed) {
        this.position = _position;
        this.reply = _reply;
        this.type = _type;
        this.invalid_reply = _invalid_reply;
        this.is_needed = _is_needed;
    }

    passes(command_data, command) {
        let embedError = this.getEmbed(command_data, command);
        if(command_data.args.length < this.position) {
            if(this.is_needed === true) {
                command_data.msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
                return false;
            } else {
                return true;
            }
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

                // TODO: add heads/tails
                // TODO: add int>0/all/half
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

module.exports = Argument;