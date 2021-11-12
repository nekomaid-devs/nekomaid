/* Types */
import { ShardClientUtil } from "discord.js-light";

/* Node Imports */
import * as Sentry from "@sentry/node";

/* Local Imports */
import { get_formatted_time } from "../utils/util_general";

export default class Logger {
    colors: string[];
    color_shard: string;
    color_message: string;
    color_api_error: string;
    color_error: string;
    color_time: string;

    shard_ID: number;
    sentry_enabled: boolean;

    constructor(shard: ShardClientUtil | null, sentry_enabled: boolean) {
        this.colors = ["\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m", "\x1b[37m", "\x1b[90m", "\x1b[93m", "\x1b[95m", "\x1b[96m", "\x1b[97m"];
        this.color_shard = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.color_message = "\x1b[92m";
        this.color_api_error = "\x1b[94m";
        this.color_error = "\x1b[31m";
        this.color_time = "\x1b[91m";

        this.shard_ID = shard === null ? -1 : shard.ids[0];
        this.sentry_enabled = sentry_enabled;
    }

    log(message: string) {
        process.stdout.write(`${this.color_time}[${get_formatted_time()}] ${this.color_shard}[shard_${this.shard_ID}] ${this.color_message}${message}\x1b[0m\n`);
    }

    api_error(e: Error | string) {
        const message = e instanceof Error ? e.stack : e;
        process.stderr.write(`${this.color_time}[${get_formatted_time()}] [API Error] ${this.color_shard}[shard_${this.shard_ID}] ${this.color_api_error}${message}\x1b[0m\n`);
        if (this.sentry_enabled === true) {
            Sentry.captureException(message);
        }
    }

    neko_api_error(e: Error | string) {
        const message = e instanceof Error ? e.stack : e;
        process.stderr.write(`${this.color_time}[${get_formatted_time()}] [Neko API Error] ${this.color_shard}[shard_${this.shard_ID}] ${this.color_api_error}${message}\x1b[0m\n`);
        if (this.sentry_enabled === true) {
            Sentry.captureException(message);
        }
    }

    error(e: Error | string) {
        const message = e instanceof Error ? e.stack : e;
        process.stderr.write(`${this.color_time}[${get_formatted_time()}] [Error] ${this.color_shard}[shard_${this.shard_ID}] ${this.color_error}${message}\x1b[0m\n`);
        if (this.sentry_enabled === true) {
            Sentry.captureException(message);
        }
    }
}
