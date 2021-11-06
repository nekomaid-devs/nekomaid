/* Types */
import { BotData, GlobalUserData, GuildData, ServerUserData } from "../../ts/base";

export function pick_random(array: any[]) {
    return array[Math.floor(Math.random() * array.length)];
}

export function shuffle_array(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export function format_number(n: number) {
    /*
     *if (n < 1e3) { return n; }
     *if (n >= 1e3 && n < 1e6) { return +(n / 1e3).toFixed(2) + "K"; }
     *if (n >= 1e6 && n < 1e9) { return +(n / 1e6).toFixed(2) + "M"; }
     *if (n >= 1e9 && n < 1e12) { return +(n / 1e9).toFixed(2) + "B"; }
     *if (n >= 1e12) { return +(n / 1e12).toFixed(2) + "T"; }
     */

    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function get_server_level_XP(server_config: GuildData, author_config: ServerUserData) {
    let level_XP = server_config.module_level_level_exp;
    for (let i = 1; i < author_config.level; i++) {
        level_XP *= server_config.module_level_level_multiplier;
    }

    return level_XP;
}

export function get_level_XP(bot_config: BotData, author_config: GlobalUserData) {
    return bot_config.level_XP;
}

export function get_formatted_time() {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    return `${h < 10 ? `0${h.toString()}` : h.toString()}:${m < 10 ? `0${m.toString()}` : m.toString()}`;
}
