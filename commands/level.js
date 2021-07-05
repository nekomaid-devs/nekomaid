const RecommendedArgument = require("../scripts/helpers/recommended_argument");

module.exports = {
    name: "level",
    category: "Leveling",
    description: "Displays the tagged user's server profile.",
    helpUsage: "[mention?]` *(optional argument)*",
    exampleUsage: "/user_tag/",
    hidden: false,
    aliases: ["lvl"],
    subcommandHelp: new Map(),
    argumentsNeeded: [],
    argumentsRecommended: [
        new RecommendedArgument(1, "Argument needs to be a mention.", "mention")
    ],
    permissionsNeeded: [],
    nsfw: false,
    async execute(command_data) {
        if(command_data.server_config.module_level_enabled == false) {
            command_data.msg.reply(`Leveling isn't enabled on this server- (see \`${command_data.server_config.prefix}leveling\` for help)`);
            return;
        }

        let items = await command_data.global_context.neko_modules_clients.sb.get_top_server_level(command_data.global_context, command_data.server_config, command_data.msg.guild);
        let author_pos = -1;
        let author_config = -1;
        for(let i = 0; i < items.length; i += 1) {
            let user = items[i];
            if(user.userID === command_data.tagged_user.id) {
                author_config = user;
                author_pos = i;
                break;
            }
        }

        author_pos += 1;
        let xp = author_config.xp;
        let level = author_config.level;
        let level_XP = command_data.server_config.module_level_level_exp;
        for(let i = 1; i < author_config.level; i += 1) {
            level_XP *= command_data.server_config.module_level_level_multiplier;
        }

        let url = command_data.tagged_user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        let embedLevel = {
            color: 8388736,
            author: {
                name: `${command_data.tagged_user.tag}'s Profile (${author_pos}#)`,
                icon_url: url
            },
            fields: [ 
                {
                    name: '⚡    Server Level:',
                    value: `${level} (XP: ${Math.round(xp)}/${Math.round(level_XP)})`
                }
            ],
            thumbnail: {
                url: url
            },
            footer: {
                text: `Requested by ${command_data.msg.author.tag}`
            },
        }
        command_data.msg.channel.send("", { embed: embedLevel }).catch(e => { console.log(e); });
    },
};