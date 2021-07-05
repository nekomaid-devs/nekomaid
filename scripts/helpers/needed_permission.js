class NeededPermission {
    constructor(user_type, permission) {
        this.user_type = user_type;
        this.permission = permission;
    }

    passes(command_data, command) {
        switch(this.user_type) {
            case "author": {
                let pass = true;
                if(this.permission === "BOT_OWNER") {
                    pass = command_data.global_context.bot_config.botOwners.includes(command_data.msg.author.id);
                    if(pass === false) { command_data.msg.reply(`You can't use this Command (permission: \`${this.permission}\`)-`) }
                } else {
                    pass = command_data.msg.member.hasPermission(this.permission);
                    if(pass === false) { command_data.msg.reply(`You can't use this Command (permission: \`${this.permission}\`)-`) }
                }
                return pass;
            }

            case "me": {
                let pass = command_data.msg.guild.me.hasPermission(this.permission);
                if(pass === false) { command_data.msg.reply(`The bot doesn't have required permissions to do this - \`${this.permission}\`\nPlease add required permissions and try again-`) }
                return pass;
            }

            default:
                global_context.logger.error(`Invalid permission type - ${this.user_type}`);
                return false;
        }
    }
}

module.exports = NeededPermission;