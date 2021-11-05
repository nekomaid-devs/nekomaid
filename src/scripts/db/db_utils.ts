/* Types */
import { GlobalContext, GuildData } from "../../ts/base";

/* Node Imports */
import { Connection, FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export async function fetch_data(connection: Connection, query: string, queryData: any[], formattingFunc: ((e: any) => any) | null, creatingFunc: (() => any) | null) {
    let result = await connection.execute(query, queryData);
    if (!is_valid(result)) {
        if (creatingFunc === null) {
            return null;
        }

        result = await creatingFunc();
        if (!is_valid(result)) {
            console.error(`Error executing creating function - '${query}'!`);
            return null;
        }
    }

    result = formattingFunc === null ? result[0][0] : await formattingFunc(result[0][0]);

    return result as any;
}

export async function fetch_multiple_data(connection: Connection, query: string, queryData: any[], formattingFunc: ((e: any) => any) | null) {
    let result = await connection.execute(query, queryData);
    if (!is_valid(result)) {
        return [];
    }

    result = result[0].reduce((acc: any, curr: any) => {
        acc.push(formattingFunc === null ? curr : formattingFunc(curr));
        return acc;
    }, []);
    for (let i = 0; i < result.length; i++) {
        result[i] = await result[i];
    }

    return result as any[];
}

export enum GuildFetchType {
    ALL,
    MINIMAL,
    AUDIT,
}
export function guild_fetch_type_to_selector(type: GuildFetchType) {
    switch (type) {
        case GuildFetchType.ALL:
            return "*";

        case GuildFetchType.MINIMAL:
            return "*";

        case GuildFetchType.AUDIT:
            return "*";
    }
}

export enum GuildEditType {
    ALL,
    AUDIT,
}
export function guild_edit_type_to_query(type: GuildEditType) {
    switch (type) {
        case GuildEditType.ALL:
            return `UPDATE servers SET
                prefix=?, say_command=?, case_ID=?, mute_role_ID=?, invites=?, banned_words=?,
                auto_roles=?,
                welcome_messages=?, welcome_messages_channel=?, welcome_messages_ping=?, welcome_messages_format=?,
                leave_messages=?, leave_messages_channel=?, leave_messages_format=?,
                module_level_enabled=?, module_level_message_exp=?, module_level_level_exp=?, module_level_level_multiplier=?, module_level_levelup_messages=?, module_level_levelup_messages_channel=?, module_level_levelup_messages_format=?, module_level_levelup_messages_ping=?, module_level_ignored_channels=?,
                audit_channel=?, audit_bans=?, audit_mutes=?, audit_kicks=?, audit_warns=?, audit_nicknames=?, audit_deleted_messages=?, audit_edited_messages=?
                WHERE server_ID=?`;

        case GuildEditType.AUDIT:
            return "UPDATE servers SET caseID=? WHERE server_ID=?";
    }
}
export function guild_edit_type_to_query_data(item: GuildData, type: GuildEditType) {
    switch (type) {
        case GuildEditType.ALL:
            return [
                item.prefix,
                item.say_command,
                item.case_ID,
                item.mute_role_ID,
                item.invites,
                item.banned_words.join(","),

                item.auto_roles.join(","),

                item.welcome_messages,
                item.welcome_messages_channel,
                item.welcome_messages_ping,
                item.welcome_messages_format,

                item.leave_messages,
                item.leave_messages_format,
                item.leave_messages_channel,

                item.module_level_enabled,
                item.module_level_message_exp,
                item.module_level_level_exp,
                item.module_level_level_multiplier,
                item.module_level_levelup_messages,
                item.module_level_levelup_messages_channel,
                item.module_level_levelup_messages_ping,
                item.module_level_levelup_messages_format,
                item.module_level_ignored_channels.join(","),

                item.audit_channel,
                item.audit_bans,
                item.audit_kicks,
                item.audit_mutes,
                item.audit_warns,
                item.audit_nicknames,
                item.audit_deleted_messages,
                item.audit_edited_messages,

                item.server_ID,
            ];

        case GuildEditType.AUDIT:
            return [item.case_ID, item.server_ID];
    }
}

function is_valid(result: [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]): result is [RowDataPacket[], FieldPacket[]] {
    return Array.isArray(result[0]);
}
