import { Guild, GuildMember, TextChannel, User } from "discord.js-light";
import { BotData, GlobalContext, MessageCreateGuildData, UserData, UserGuildData } from "./base";

export type GuildLevelingData = {
    global_context: GlobalContext;

    guild: Guild;
    guild_data: MessageCreateGuildData;
    channel: TextChannel;
    member: GuildMember;
    user_data: UserGuildData;

    log: boolean;
    xp: number;
};

export type LevelingData = {
    global_context: GlobalContext;

    bot_data: BotData;
    user: User;
    user_data: UserData;

    xp: number;
};
