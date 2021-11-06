/* Types */
import { CommandData, Command, ExtraPermission } from "../ts/base";

/* Local Imports */
import NeededPermission from "../scripts/helpers/needed_permission";
import NeededArgument from "../scripts/helpers/needed_argument";

export default {
    name: "eval",
    category: "Utility",
    description: "Returns result of eval.",
    helpUsage: "[script]`",
    exampleUsage: "this.token",
    hidden: true,
    aliases: [],
    subcommandHelp: new Map(),
    argumentsNeeded: [new NeededArgument(1, "You need to type in script to execute.", "none")],
    argumentsRecommended: [],
    permissionsNeeded: [new NeededPermission("author", ExtraPermission.BOT_OWNER)],
    nsfw: false,
    cooldown: 1500,
    async execute(command_data: CommandData) {
        if (command_data.msg.guild === null || command_data.global_context.bot.user === null) {
            return;
        }
        const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });

        const embedEvalLoading = {
            author: {
                name: "Result for eval (current context)",
                icon_url: url === null ? undefined : url,
            },
            footer: { text: "🕒 Took X ms..." },
        };
        const message = await command_data.msg.channel.send({ embeds: [embedEvalLoading] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if (message === null) {
            return;
        }

        try {
            const t_start = command_data.global_context.modules.performance.now();
            const result = await eval(command_data.total_argument);
            const t_end = command_data.global_context.modules.performance.now();

            const embedEval = {
                author: {
                    name: "Result for eval (current context)",
                    icon_url: url === null ? undefined : url,
                },
                description: result === undefined ? "Undefined" : JSON.stringify(result),
                footer: { text: "🕒 Took X ms..." },
            };
            embedEval.footer = { text: `🕒 Took ${(t_end - t_start).toFixed(1)}ms...` };
            message.edit({ embeds: [embedEval] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } catch (e: any) {
            const embedEval = {
                author: {
                    name: "Result for eval (current context)",
                    icon_url: url === null ? undefined : url,
                },
                description: e.toString(),
                footer: { text: "🕒 Took ?? ms..." },
            };
            message.edit({ embeds: [embedEval] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
} as Command;
