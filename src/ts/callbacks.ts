/* Types */
import { GuildMuteData } from "./base";
import { GuildMember } from "discord.js-light";

export type ClearWarnsEventData = {
    member: GuildMember;
    moderator: GuildMember;
    reason: string | null;

    num_of_warnings: number;
};

export type MemberMuteExtensionEventData = {
    member: GuildMember;
    moderator: GuildMember;
    reason: string | null;

    prev_duration: string;
    next_duration: string;
    mute_start: number;
    time: number;
    mute_end: number;
};

export type MemberMuteRemoveEventData = {
    member: GuildMember;
    moderator: GuildMember;
    reason: string | null;

    previous_mute: GuildMuteData;
};

export type MemberMuteEventData = {
    member: GuildMember;
    moderator: GuildMember;
    reason: string | null;

    duration: string;
    mute_start: number;
    time: number;
    mute_end: number;
};

export type MemberWarnEventData = {
    member: GuildMember;
    moderator: GuildMember;
    reason: string | null;

    num_of_warnings: number;
};
