import { Client, GuildMember, Message, User } from "discord.js";

export type GlobalContext = {
    config: any;
    bot_config: any;

    bot: Client;

    commands: any;
    command_aliases: any;

    modules: any;
    modules_clients: any;

    neko_data: any;
    neko_modules: any;
    neko_modules_clients: any;

    logger: any;
    utils: any;
    data: any;
};

export type Command = {
    name: string;
    helpUsage: string;
    exampleUsage: string;
};

export type CommandData = {
    global_context: GlobalContext;
    msg: Message;

    args: string[];
    total_argument: string;

    tagged_users: User[];
    tagged_user: User;
    tagged_user_tags: string;

    tagged_members: GuildMember[];
    tagged_member: GuildMember;

    server_config: any;
    server_bans: any[];
    server_mutes: any[];
    server_warns: any[];

    author_user_config: any;
    author_server_user_config: any;

    tagged_user_config: any;
    tagged_server_user_config: any;
};

export enum ExtraPermission { BOT_OWNER }