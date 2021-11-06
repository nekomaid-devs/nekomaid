export function convert_time_inconsistent(time: any) {
    return convert_string_to_time_data(convert_time(time.days * 86400000 + time.hrs * 3600000 + time.mins * 60000 + time.secs * 1000));
}

export function sum_times(time_1: any, time_2: any) {
    if (time_2.status === -1) {
        return time_1;
    }

    time_1.days += time_2.days;
    time_1.hrs += time_2.hrs;
    time_1.mins += time_2.mins;
    time_1.secs += time_2.secs;

    return time_1;
}

export function sub_times(time_1: any, time_2: any) {
    if (time_2.status === -1) {
        return time_1;
    }

    time_1.days -= time_2.days;
    time_1.hrs -= time_2.hrs;
    time_1.mins -= time_2.mins;
    time_1.secs -= time_2.secs;

    return time_1;
}

export function convert_time(time: number) {
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

export function convert_string_to_time_data(time_string: string) {
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

    const time_data = {
        status: 1,
        days: parseInt(days),
        hrs: parseInt(hrs),
        mins: parseInt(mins),
        secs: parseInt(secs),
    };
    time_data.status =
        (time_data.days > 0 || time_data.hrs > 0 || time_data.mins > 0 || time_data.secs > 0) && isNaN(time_data.days) === false && isNaN(time_data.hrs) === false && isNaN(time_data.mins) === false && isNaN(time_data.secs) === false
            ? 1
            : -1;

    return time_data;
}

export function convert_youtube_string_to_time_data(time_string: string) {
    if (time_string === null) {
        return { status: -1 };
    } else if (time_string.includes("PT") === true) {
        return convert_youtube_string_to_time_data_0(time_string);
    }

    return convert_youtube_string_to_time_data_1(time_string);
}

export function convert_youtube_string_to_time_data_0(time_string: string) {
    let prev = 0;
    const time_string_mod = time_string.replace("PT", "");

    const days = time_string_mod.indexOf("D", prev) === -1 ? "0" : time_string_mod.substring(prev, time_string_mod.indexOf("D", prev));
    prev = time_string_mod.indexOf("D", prev) === -1 ? prev : time_string_mod.indexOf("D", prev) + 1;
    const hrs = time_string_mod.indexOf("H", prev) === -1 ? "0" : time_string_mod.substring(prev, time_string_mod.indexOf("H", prev));
    prev = time_string_mod.indexOf("H", prev) === -1 ? prev : time_string_mod.indexOf("H", prev) + 1;
    const mins = time_string_mod.indexOf("M", prev) === -1 ? "0" : time_string_mod.substring(prev, time_string_mod.indexOf("M", prev));
    prev = time_string_mod.indexOf("M", prev) === -1 ? prev : time_string_mod.indexOf("M", prev) + 1;
    const secs = time_string_mod.indexOf("S", prev) === -1 ? "0" : time_string_mod.substring(prev, time_string_mod.indexOf("S", prev));
    prev = time_string_mod.indexOf("S", prev) === -1 ? prev : time_string_mod.indexOf("S", prev) + 1;

    const time_data = {
        status: 1,
        days: parseInt(days),
        hrs: parseInt(hrs),
        mins: parseInt(mins),
        secs: parseInt(secs),
    };
    time_data.status =
        (time_data.days > 0 || time_data.hrs > 0 || time_data.mins > 0 || time_data.secs > 0) && isNaN(time_data.days) === false && isNaN(time_data.hrs) === false && isNaN(time_data.mins) === false && isNaN(time_data.secs) === false
            ? 1
            : -1;

    return time_data;
}

export function convert_youtube_string_to_time_data_1(time_string: string) {
    let time_string_mod = `:${time_string}`;
    const count = (time_string_mod.match(/:/g) || []).length;

    let secs = "0";
    let mins = "0";
    let hrs = "0";
    let days = "0";
    if (count > 1) {
        secs = time_string_mod.substring(time_string_mod.lastIndexOf(":") + 1);
        time_string_mod = time_string_mod.substring(0, time_string_mod.lastIndexOf(":"));
    }
    if (count > 1) {
        mins = time_string_mod.substring(time_string_mod.lastIndexOf(":") + 1);
        time_string_mod = time_string_mod.substring(0, time_string_mod.lastIndexOf(":"));
    }
    if (count > 2) {
        hrs = time_string_mod.substring(time_string_mod.lastIndexOf(":") + 1);
        time_string_mod = time_string_mod.substring(0, time_string_mod.lastIndexOf(":"));
    }
    if (count > 3) {
        days = time_string_mod.substring(time_string_mod.lastIndexOf(":") + 1);
        time_string_mod = time_string_mod.substring(0, time_string_mod.lastIndexOf(":"));
    }

    const time_data = {
        status: 1,
        days: parseInt(days),
        hrs: parseInt(hrs),
        mins: parseInt(mins),
        secs: parseInt(secs),
    };
    time_data.status =
        (time_data.days > 0 || time_data.hrs > 0 || time_data.mins > 0 || time_data.secs > 0) && isNaN(time_data.days) === false && isNaN(time_data.hrs) === false && isNaN(time_data.mins) === false && isNaN(time_data.secs) === false
            ? 1
            : -1;

    return time_data;
}

export function convert_time_data_to_string(time_data: any) {
    if (time_data.status === -1) {
        return "Unknown";
    }

    let time_string = "";
    if (time_data.days !== 0) {
        time_string += `${time_data.days}:`;
    }
    if (time_data.hrs !== 0 || time_data.days > 0) {
        time_string += time_data.hrs.toString().length < 2 ? `0${time_data.hrs}:` : `${time_data.hrs}:`;
    }
    if (time_data.mins !== 0 || time_data.hrs > 0 || time_data.days > 0) {
        time_string += time_data.mins.toString().length < 2 ? `0${time_data.mins}:` : `${time_data.mins}:`;
    }
    if (time_data.secs !== 0 || time_data.mins > 0 || time_data.hrs > 0 || time_data.days > 0) {
        time_string += time_data.secs.toString().length < 2 ? `0${time_data.secs}:` : `${time_data.secs}:`;
    }
    if (time_data.days === 0 && time_data.hrs === 0 && time_data.mins === 0) {
        time_string = `00:${time_string}`;
    }

    time_string = time_string.endsWith(":") ? time_string.slice(0, time_string.length - 1) : time_string;
    return time_string;
}
