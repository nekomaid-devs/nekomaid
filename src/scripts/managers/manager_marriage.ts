/* Types */
import { GlobalContext } from "../../ts/base";
import { MarriageProposal } from "../../ts/marriage";
import { Message, TextChannel, User } from "discord.js";

class MarriageManager {
    marriage_proposals: Map<string, MarriageProposal>;
    timeout_proposals: Map<string, any>;

    constructor() {
        this.marriage_proposals = new Map();
        this.timeout_proposals = new Map();
    }

    check_marriage_proposals(global_context: GlobalContext, message: Message) {
        if (message.member === null || !(message.channel instanceof TextChannel)) {
            return;
        }
        const marriage_proposal = this.marriage_proposals.get(message.member.id);
        if (marriage_proposal === undefined || message.channel.id !== marriage_proposal.channel_ID) {
            return;
        }

        if (message.content.toLowerCase() === "yes") {
            this.accept_marriage_proposal(global_context, marriage_proposal, message.channel);
        } else if (message.content.toLowerCase() === "no") {
            this.remove_marriage_proposal(global_context, marriage_proposal, message.channel, 3);
        }
    }

    async accept_marriage_proposal(global_context: GlobalContext, marriage_proposal: MarriageProposal, channel: TextChannel) {
        const source_user_config = await global_context.neko_modules_clients.db.fetch_global_user(marriage_proposal.source_ID, false, false);
        if (source_user_config === null) {
            return;
        }
        source_user_config.married_ID = marriage_proposal.target_ID;
        global_context.neko_modules_clients.db.edit_global_user(source_user_config);

        const target_user_config = await global_context.neko_modules_clients.db.fetch_global_user(marriage_proposal.target_ID, false, false);
        if (target_user_config === null) {
            return;
        }
        target_user_config.married_ID = marriage_proposal.source_ID;
        global_context.neko_modules_clients.db.edit_global_user(target_user_config);

        channel.send(`\`${marriage_proposal.source_tag}\` married \`${marriage_proposal.target_tag}\`!`).catch((e: Error) => {
            global_context.logger.api_error(e);
        });

        this.remove_marriage_proposal(global_context, marriage_proposal, channel);
        this.remove_marriage_proposal_backwards(global_context, marriage_proposal, channel);
    }

    add_marriage_proposal(global_context: GlobalContext, source_user: User, target_user: User, channel: TextChannel) {
        const marriage_proposal = this.marriage_proposals.get(target_user.id);
        if (marriage_proposal === undefined) {
            return;
        }
        if (marriage_proposal.source_ID === source_user.id) {
            channel.send("You've already proposed to this user.").catch((e: Error) => {
                global_context.logger.api_error(e);
            });
            return;
        }

        channel.send(`\`${source_user.tag}\` wants to marry \`${target_user.tag}\`! They have 120s to accept the proposal.`).catch((e: Error) => {
            global_context.logger.api_error(e);
        });
        channel.send(`${target_user.toString()} type yes to accept the proposal.`).catch((e: Error) => {
            global_context.logger.api_error(e);
        });

        const new_marriage_proposal = {
            source_ID: source_user.id,
            source_tag: source_user.tag,
            target_ID: target_user.id,
            target_tag: target_user.tag,
            channel_ID: channel.id
        };

        this.marriage_proposals.set(target_user.id, new_marriage_proposal);
        this.timeout_marriage_proposal(global_context, new_marriage_proposal, channel);

        return marriage_proposal;
    }

    timeout_marriage_proposal(global_context: GlobalContext, marriage_proposal: MarriageProposal, channel: TextChannel) {
        if (this.timeout_proposals.has(marriage_proposal.target_ID)) {
            clearTimeout(this.timeout_proposals.get(marriage_proposal.target_ID));
        }

        const timeout_proposal = setTimeout(() => {
            this.remove_marriage_proposal(global_context, marriage_proposal, channel, 1);
        }, 120000);
        this.timeout_proposals.set(marriage_proposal.target_ID, timeout_proposal);
    }

    remove_marriage_proposal(global_context: GlobalContext, marriage_proposal: MarriageProposal, channel: TextChannel, log = -1) {
        switch (log) {
            case 1:
                channel.send(`Marriage proposal from \`${marriage_proposal.source_tag}\` to \`${marriage_proposal.target_tag}\` expired.`).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                break;

            case 2:
                channel.send(`Marriage proposal from \`${marriage_proposal.source_tag}\` to \`${marriage_proposal.target_tag}\` was cancelled.`).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                break;

            case 3:
                channel.send(`Marriage proposal from \`${marriage_proposal.source_tag}\` to \`${marriage_proposal.target_tag}\` was refused.`).catch((e: Error) => {
                    global_context.logger.api_error(e);
                });
                break;
        }

        this.marriage_proposals.delete(marriage_proposal.target_ID);
    }

    remove_marriage_proposal_backwards(global_context: GlobalContext, marriage_proposal: MarriageProposal, channel: TextChannel) {
        Array.from(this.marriage_proposals.values())
            .filter((e) => {
                return e.source_ID === marriage_proposal.source_ID;
            })
            .forEach((e) => {
                this.remove_marriage_proposal(global_context, e, channel, 2);
            });
    }
}

export default MarriageManager;
