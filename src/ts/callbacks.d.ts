/* Types */
import { GuildMuteData } from "./base";
import { GuildMember } from "discord.js-light";

export type MemberMuteAddEventData = {
    member: GuildMember;
    moderator: GuildMember;
    reason: string | null;

    start: number;
    duration: number;
    end: number;
};

export type MemberMuteRemoveEventData = {
    member: GuildMember;
    moderator: GuildMember;
    reason: string | null;

    previous_mute: GuildMuteData;
};

export type MemberWarnAddEventData = {
    member: GuildMember;
    moderator: GuildMember;
    reason: string | null;

    start: number;
    num_of_warnings: number;
};

export type ClearWarnsEventData = {
    member: GuildMember;
    moderator: GuildMember;
    reason: string | null;

    num_of_warnings: number;
};
