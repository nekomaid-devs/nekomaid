export function ms_to_string(time: number) {
    let time_string = "";
    let time_left = time;

    const ms = time_left % 1000;
    time_left = (time_left - ms) / 1000;
    const secs = time_left % 60;
    time_left = (time_left - secs) / 60;
    const mins = time_left % 60;
    time_left = (time_left - mins) / 60;
    const hrs = time_left % 24;
    time_left = (time_left - hrs) / 24;
    const days = time_left % 30;
    time_left = (time_left - days) / 30;
    const months = time_left % 12;
    time_left = (time_left - months) / 12;
    const years = time_left;

    time_string += years > 0 ? `${years}y ` : "";
    time_string += months > 0 ? `${months}mon  ` : "";
    time_string += hrs > 0 ? `${hrs}h ` : "";
    time_string += mins > 0 ? `${mins}m ` : "";
    time_string += secs > 0 ? `${secs}s ` : "";
    time_string = time_string.substring(0, time_string.length - 1);
    if (time_string.length < 1) {
        time_string = "0s";
    }

    return time_string;
}
export function ms_to_string_yt(time: number) {
    let time_string = "";
    let time_left = time;

    const ms = time_left % 1000;
    time_left = (time_left - ms) / 1000;
    const secs = time_left % 60;
    time_left = (time_left - secs) / 60;
    const mins = time_left % 60;
    time_left = (time_left - mins) / 60;
    const hrs = time_left % 24;
    time_left = (time_left - hrs) / 24;
    const days = time_left % 30;
    time_left = (time_left - days) / 30;
    const months = time_left % 12;
    time_left = (time_left - months) / 12;
    const years = time_left;

    time_string += years > 0 ? `${years}y ` : "";
    time_string += months > 0 ? `${months}mon  ` : "";
    time_string += hrs > 0 ? `${hrs}h ` : "";
    time_string += mins > 0 ? `${mins}m ` : "";
    time_string += secs > 0 ? `${secs}s ` : "";
    time_string = time_string.substring(0, time_string.length - 1);
    if (time_string.length < 1) {
        time_string = "0s";
    }

    return time_string;
}

export function convert_string_to_ms(time_string: string) {
    let prev = 0;
    const time_string_mod = time_string.replace(" ", "");

    const days = time_string_mod.indexOf("d", prev) === -1 ? "0" : time_string_mod.substring(prev, time_string_mod.indexOf("d", prev));
    prev = time_string_mod.indexOf("d", prev) === -1 ? prev : time_string_mod.indexOf("d", prev) + 1;
    const hrs = time_string_mod.indexOf("h", prev) === -1 ? "0" : time_string_mod.substring(prev, time_string_mod.indexOf("h", prev));
    prev = time_string_mod.indexOf("h", prev) === -1 ? prev : time_string_mod.indexOf("h", prev) + 1;
    const mins = time_string_mod.indexOf("m", prev) === -1 ? "0" : time_string_mod.substring(prev, time_string_mod.indexOf("m", prev));
    prev = time_string_mod.indexOf("m", prev) === -1 ? prev : time_string_mod.indexOf("m", prev) + 1;
    const secs = time_string_mod.indexOf("s", prev) === -1 ? "0" : time_string_mod.substring(prev, time_string_mod.indexOf("s", prev));
    prev = time_string_mod.indexOf("s", prev) === -1 ? prev : time_string_mod.indexOf("s", prev) + 1;

    return parseInt(days) * (1000 * 60 * 60 * 24) * parseInt(hrs) * (1000 * 60 * 60) * parseInt(mins) * (1000 * 60) * parseInt(secs) * 1000;
}
