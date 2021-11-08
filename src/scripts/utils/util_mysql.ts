/* Types */
import { GuildFetchType } from "../../ts/mysql";

/* Node Imports */
import { Connection, FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise";

export async function fetch_data(connection: Connection, query: string, queryData: any[], formattingFunc: ((e: any) => any) | null, creatingFunc: (() => any) | null) {
    let result = await connection.execute(query, queryData);
    if (!is_valid(result)) {
        if (creatingFunc === null) {
            return null;
        }

        await creatingFunc();
        result = await connection.execute(query, queryData);
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

export function guild_fetch_type_to_selector(type: GuildFetchType) {
    switch (type) {
        case GuildFetchType.AUDIT:
            return "*";

        case GuildFetchType.MESSAGE_CREATE:
            return "*";

        case GuildFetchType.ALL:
            return "*";
    }
}

function is_valid(result: [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]]): result is [RowDataPacket[], FieldPacket[]] {
    return Array.isArray(result[0]) && result[0].length > 0;
}
