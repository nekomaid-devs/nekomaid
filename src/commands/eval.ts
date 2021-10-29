import { CommandData, ExtraPermission } from "../ts/types";

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
        const eval_query = command_data.total_argument;

        const url = command_data.global_context.bot.user.avatarURL({ format: "png", dynamic: true, size: 1024 });
        if(url === null) { return; }
        const embedEval: any = {
            author: {
                name: "Result for eval (current context)",
                icon_url: url,
            },
            description: "Waiting...",
            footer: { text: "🕒 Took X ms..." },
        };
        let embedFiles: any[] = [];
        const message = await command_data.msg.channel.send({ embeds: [embedEval] }).catch((e: Error) => {
            command_data.global_context.logger.api_error(e);
            return null;
        });
        if(message === null) { return; }

        try {
            const t_start = command_data.global_context.modules.performance.now();
            const result = await eval(eval_query);
            const t_end = command_data.global_context.modules.performance.now();

            embedEval.description = result === undefined ? "Undefined" : JSON.stringify(result);
            if (embedEval.description.length > 2048) {
                embedFiles = [embedEval.description];
                embedEval.description = undefined;
            }
            embedEval.footer = { text: `🕒 Took ${(t_end - t_start).toFixed(1)}ms...` };
            message.edit({ embeds: [embedEval], files: embedFiles }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        } catch (err) {
            embedEval.description = err;
            message.edit({ embeds: [embedEval] }).catch((e: Error) => {
                command_data.global_context.logger.api_error(e);
            });
        }
    },
};
