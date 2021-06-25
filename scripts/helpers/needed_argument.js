class NeededArgument {
    constructor(pos, reply, type, invalidReply) {
        this.position = pos;
        this.reply = reply;
        this.type = type;
        this.invalidReply = invalidReply;
    }

    passes(msg, args, command, prefix) {
        const embedError = this.getEmbed(msg, args, command, prefix);
        if(args.length < this.position) {
            msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
            return false;
        }

        switch(this.type) {
            case "mention1":
                if(Array.from(msg.mentions.members.values()).length < this.position) {
                    msg.channel.send("", { embed: embedError }).catch(e => { console.log(e); });
                    return false;
                }
                break;
        }

        return true;
    }

    getEmbed(msg, args, command, prefix) {
        //Construct embed
        let usage = "`" + prefix + command.name + " " + command.helpUsage + "\n`" + prefix + command.name + " " + command.exampleUsage + "`"
        usage = usage.split("/userTag/").join("@" + msg.author.username)
        usage = usage.split("/username/").join(msg.author.username)
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