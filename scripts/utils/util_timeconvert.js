class TimeConvert {
    TimeConvert(global_context) {
        this.global_context = global_context;
    }

    /*convertTime_inconsistent(time) {
        return this.convertString(this.convertTime((time.days * 86400000 ) + (time.hrs * 3600000) + (time.mins * 60000) + (time.secs * 1000)));
    }

    sumTimes(time1, time2) {
        if(time2.status === -1) {
            return time1;
        }

        time1.days += time2.days;
        time1.hrs += time2.hrs;
        time1.mins += time2.mins;
        time1.secs += time2.secs;

        return time1;
    }

    substractTimes(time1, time2) {
        if(time2.status === -1) {
            return time1;
        }

        time1.days -= time2.days;
        time1.hrs -= time2.hrs;
        time1.mins -= time2.mins;
        time1.secs -= time2.secs;

        return time1;
    }

    convertTime(time) {
        var timeString = "";
        var timeLeft = time;
    
        var ms = timeLeft % 1000;
        timeLeft = (timeLeft - ms) / 1000;
        var secs = timeLeft % 60;
        timeLeft = (timeLeft - secs) / 60;
        var mins = timeLeft % 60;
        timeLeft = (timeLeft - mins) / 60;
        var hrs = timeLeft % 24;
        timeLeft = (timeLeft - hrs) / 24;
        var days = timeLeft % 30;
        timeLeft = (timeLeft - days) / 30;
        var months = timeLeft % 12;
        timeLeft = (timeLeft - months) / 12;
        var years = timeLeft;

        if(years > 0) {
            timeString += years + "y ";
        }

        if(months > 0) {
            timeString += months + "mon ";
        }

        if(days > 0) {
            timeString += days + "d ";
        }
    
        if(hrs > 0) {
            timeString += hrs + "h ";
        }
    
        if(mins > 0) {
            timeString += mins + "m ";
        }
    
        if(secs > 0) {
            timeString += secs + "s ";
        }
    
        timeString = timeString.substring(0, timeString.length - 1);
        
        return timeString;
    }

    convertString(timeString) {
        var prev = 0;
        var timeStringMod = timeString.replace(" ", "");

        var timeDays = timeStringMod.indexOf("d", prev) === -1 ? 0 : timeStringMod.substring(prev, timeStringMod.indexOf("d", prev));
        prev = timeStringMod.indexOf("d", prev) === -1 ? prev : timeStringMod.indexOf("d", prev) + 1;

        var timeHrs = timeStringMod.indexOf("h", prev) === -1 ? 0 : timeStringMod.substring(prev, timeStringMod.indexOf("h", prev));
        prev = timeStringMod.indexOf("h", prev) === -1 ? prev : timeStringMod.indexOf("h", prev) + 1;

        var timeMins = timeStringMod.indexOf("m", prev) === -1 ? 0 : timeStringMod.substring(prev, timeStringMod.indexOf("m", prev));
        prev = timeStringMod.indexOf("m", prev) === -1 ? prev : timeStringMod.indexOf("m", prev) + 1;

        var timeSecs = timeStringMod.indexOf("s", prev) === -1 ? 0 : timeStringMod.substring(prev, timeStringMod.indexOf("s", prev));
        prev = timeStringMod.indexOf("s", prev) === -1 ? prev : timeStringMod.indexOf("s", prev) + 1;

        var timeData = {
            status: 1,
            days: parseInt(timeDays),
            hrs: parseInt(timeHrs),
            mins: parseInt(timeMins),
            secs: parseInt(timeSecs)
        }
        timeData.status = (timeData.days > 0 || timeData.hrs > 0 || timeData.mins > 0 || timeData.secs > 0) &&
                        (isNaN(timeData.days) === false && isNaN(timeData.hrs) === false && isNaN(timeData.mins) === false && isNaN(timeData.secs) === false) ? 1 : -1;
        
        return timeData;
    }

    decideConvertString_yt(timeString) {
        if(timeString === null) {
            return { status: -1 }
        } else if(timeString.includes("PT") === true) {
            return this.convertString_yt(timeString)
        }

        return this.convertString_ytb(timeString);
    }

    convertString_yt(timeString) {
        var prev = 0;
        var timeStringMod = timeString.replace("PT", "");

        var timeDays = timeStringMod.indexOf("D", prev) === -1 ? 0 : timeStringMod.substring(prev, timeStringMod.indexOf("D", prev));
        prev = timeStringMod.indexOf("D", prev) === -1 ? prev : timeStringMod.indexOf("D", prev) + 1;

        var timeHrs = timeStringMod.indexOf("H", prev) === -1 ? 0 : timeStringMod.substring(prev, timeStringMod.indexOf("H", prev));
        prev = timeStringMod.indexOf("H", prev) === -1 ? prev : timeStringMod.indexOf("H", prev) + 1;

        var timeMins = timeStringMod.indexOf("M", prev) === -1 ? 0 : timeStringMod.substring(prev, timeStringMod.indexOf("M", prev));
        prev = timeStringMod.indexOf("M", prev) === -1 ? prev : timeStringMod.indexOf("M", prev) + 1;

        var timeSecs = timeStringMod.indexOf("S", prev) === -1 ? 0 : timeStringMod.substring(prev, timeStringMod.indexOf("S", prev));
        prev = timeStringMod.indexOf("S", prev) === -1 ? prev : timeStringMod.indexOf("S", prev) + 1;

        var timeData = {
            status: 1,
            days: parseInt(timeDays),
            hrs: parseInt(timeHrs),
            mins: parseInt(timeMins),
            secs: parseInt(timeSecs)
        }
        timeData.status = (timeData.days > 0 || timeData.hrs > 0 || timeData.mins > 0 || timeData.secs > 0) &&
                        (isNaN(timeData.days) === false && isNaN(timeData.hrs) === false && isNaN(timeData.mins) === false && isNaN(timeData.secs) === false) ? 1 : -1;
        
        return timeData;
    }

    convertString_ytb(timeString) {
        var timeStringMod = ":" + timeString;
        var count = (timeStringMod.match(/:/g) || []).length;

        var timeSecs = 0;
        var timeMins = 0;
        var timeHrs = 0;
        var timeDays = 0;

        if(count > 1) {
            timeSecs = timeStringMod.substring(timeStringMod.lastIndexOf(":") + 1);
            timeStringMod = timeStringMod.substring(0, timeStringMod.lastIndexOf(":"));
        }

        if(count > 1) {
            timeMins = timeStringMod.substring(timeStringMod.lastIndexOf(":") + 1);
            timeStringMod = timeStringMod.substring(0, timeStringMod.lastIndexOf(":"));
        }

        if(count > 2) {
            timeHrs = timeStringMod.substring(timeStringMod.lastIndexOf(":") + 1);
            timeStringMod = timeStringMod.substring(0, timeStringMod.lastIndexOf(":"));
        }

        if(count > 3) {
            timeDays = timeStringMod.substring(timeStringMod.lastIndexOf(":") + 1);
            timeStringMod = timeStringMod.substring(0, timeStringMod.lastIndexOf(":"));
        }

        var timeData = {
            status: 1,
            days: parseInt(timeDays),
            hrs: parseInt(timeHrs),
            mins: parseInt(timeMins),
            secs: parseInt(timeSecs)
        }
        timeData.status = (timeData.days > 0 || timeData.hrs > 0 || timeData.mins > 0 || timeData.secs > 0) &&
                        (isNaN(timeData.days) === false && isNaN(timeData.hrs) === false && isNaN(timeData.mins) === false && isNaN(timeData.secs) === false) ? 1 : -1;
        
        return timeData;
    }

    convertString_yt2(timeData) {
        if(timeData.status === -1) {
            return "Unknown";
        }

        var timeString = "";

        if(timeData.days != 0) {
            timeString += timeData.days + ":";
        }

        if(timeData.hrs != 0 || (timeData.days > 0)) {
            timeString += timeData.hrs.toString().length < 2 ? "0" + timeData.hrs + ":" : timeData.hrs + ":";
        }

        if(timeData.mins != 0 || (timeData.hrs > 0 || timeData.days > 0)) {
            timeString += timeData.mins.toString().length < 2 ? "0" + timeData.mins + ":" : timeData.mins + ":";
        }

        if(timeData.secs != 0 || (timeData.mins > 0 || timeData.hrs > 0 || timeData.days > 0)) {
            timeString += timeData.secs.toString().length < 2 ? "0" + timeData.secs + ":" : timeData.secs + ":";
        }

        if(timeData.days === 0 && timeData.hrs === 0 && timeData.mins === 0) {
            timeString = "00:" + timeString
        }

        timeString = timeString.endsWith(":") ? timeString.slice(0, timeString.length - 1) : timeString;
        return timeString;
    }*/
}

module.exports = TimeConvert;