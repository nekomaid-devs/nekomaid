/* Types */
import { Command, CommandData } from "../../ts/base";
import { Message } from "discord.js-light";

export function get_8ball_answers() {
    return [
        "Yes, 100%",
        "Signs point to yes",
        "Yes, definitely",
        "Yes",
        "Probably yes",
        "Most likely",
        "Maybe",
        "I'm not sure but maybe yes",

        "I don't think so",
        "No chance",
        "No way",
        "Very doubtful",
        "My sources say no",
        "No",
        "Nope",

        "I have no idea",
        "I don't know",
        "Please ask again",
        "Good question",
        "Better not tell you now",
        "It's obvious",
    ];
}

export function get_angry_gifs() {
    return ["https://i.imgur.com/S9GQ9tC.gif"];
}

export function get_arrest_gifs() {
    return ["https://i.imgur.com/zpyh599.gif", "https://i.imgur.com/erqEvRm.gif", "https://i.imgur.com/WVYmbTf.gif", "https://i.imgur.com/hqCkyKy.gif"];
}

export function get_bite_gifs() {
    return [
        "https://i.imgur.com/bpFX4QQ.gif",
        "https://i.imgur.com/2kJraQN.gif",
        "https://i.imgur.com/yRpRk55.gif",
        "https://i.imgur.com/kXdfZqv.gif",
        "https://i.imgur.com/ECZ1siG.gif",
        "https://i.imgur.com/VQUGcMM.gif",
        "https://i.imgur.com/ii0PzdA.gif",
        "https://i.imgur.com/YKtpj8U.gif",
        "https://i.imgur.com/bBDO6X1.gif",
        "https://i.imgur.com/fGPAulI.gif",
        "https://i.imgur.com/Jp8mOWA.gif",
        "https://i.imgur.com/v5ntzUV.gif",
        "https://i.imgur.com/EPMkKhU.gif",
    ];
}

export function get_blush_gifs() {
    return [
        "https://i.imgur.com/tXGt8Re.gif",
        "https://i.imgur.com/H5WtLJ3.gif",
        "https://i.imgur.com/0WifSJ8.gif",
        "https://i.imgur.com/JBlkT36.gif",
        "https://i.imgur.com/atlrSUE.gif",
        "https://i.imgur.com/K3hjezm.gif",
        "https://i.imgur.com/7NXzUon.gif",
        "https://i.imgur.com/otQG40K.gif",
        "https://i.imgur.com/6BWJSbW.gif",
        "https://i.imgur.com/q9SaK6K.gif",
        "https://i.imgur.com/KZZEHtP.gif",
        "https://i.imgur.com/9FXF0Yw.gif",
        "https://i.imgur.com/qXMmjI3.gif",
        "https://i.imgur.com/49kAafw.gif",
    ];
}

export function get_borgar_gifs() {
    return ["https://i.imgur.com/ABEPwfx.gif", "https://i.imgur.com/D2h6sWy.gif", "https://i.imgur.com/qsLCxVT.gif", "https://i.imgur.com/OkVM7h9.gif"];
}

export function get_cry_gifs() {
    return [
        "https://i.imgur.com/40cB83v.gif",
        "https://i.imgur.com/JG9ZwWB.gif",
        "https://i.imgur.com/7WIpcIH.gif",
        "https://i.imgur.com/lLterh2.gif",
        "https://i.imgur.com/vgYqrMd.gif",
        "https://i.imgur.com/f2269jf.gif",
        "https://i.imgur.com/jxswV38.gif",
        "https://i.imgur.com/XFOBDjc.gif",
        "https://i.imgur.com/kuhFca7.gif",
        "https://i.imgur.com/wYWgggM.gif",
        "https://i.imgur.com/S0ZIL9x.gif",
        "https://i.imgur.com/FrvmmIW.gif",
        "https://i.imgur.com/cchBAUv.gif",
    ];
}

export function get_cuddle_gifs() {
    return [
        "https://i.imgur.com/QJx9VvV.gif",
        "https://i.imgur.com/TMw0mBz.gif",
        "https://i.imgur.com/un3UUAV.gif",
        "https://i.imgur.com/xp8AUko.gif",
        "https://i.imgur.com/podFk4Y.gif",
        "https://i.imgur.com/p12Llh0.gif",
        "https://i.imgur.com/d0oOLd3.gif",
        "https://i.imgur.com/PhULVhR.gif",
        "https://i.imgur.com/zqfsgFl.gif",
        "https://i.imgur.com/lniDHSB.gif",
        "https://i.imgur.com/KwKMJx4.gif",
        "https://i.imgur.com/0kOwoWZ.gif",
        "https://i.imgur.com/gXhEGyj.gif",
        "https://i.imgur.com/WJoVNyR.gif",
    ];
}

export function get_dance_gifs() {
    return [
        "https://i.imgur.com/OVNuLon.gif",
        "https://i.imgur.com/ft7Pyna.gif",
        "https://i.imgur.com/jICKolG.gif",
        "https://i.imgur.com/iAtoSNU.gif",
        "https://i.imgur.com/nZUkQzT.gif",
        "https://i.imgur.com/s73jset.gif",
        "https://i.imgur.com/hC41vSu.gif",
        "https://i.imgur.com/u6tGH3p.gif",
        "https://i.imgur.com/hU2hGYe.gif",
        "https://i.imgur.com/iKUXg7G.gif",
        "https://i.imgur.com/IBxwAQ2.gif",
        "https://i.imgur.com/NRDoRbV.gif",
        "https://i.imgur.com/YlviseJ.gif",
        "https://i.imgur.com/AltqYRY.gif",
        "https://i.imgur.com/NIBOhwP.gif",
        "https://i.imgur.com/p3039Mg.gif",
        "https://i.imgur.com/qvORXs1.gif",
        "https://i.imgur.com/BCanBC2.gif",
    ];
}

export function get_hug_gifs() {
    return [
        "https://i.imgur.com/qjTg0fr.gif",
        "https://i.imgur.com/2b4rvXF.gif",
        "https://i.imgur.com/vM3J81o.gif",
        "https://i.imgur.com/gDVpCCu.gif",
        "https://i.imgur.com/9qxRzZq.gif",
        "https://i.imgur.com/HPrswRt.gif",
        "https://i.imgur.com/GpYVnkl.gif",
        "https://i.imgur.com/Fb1HSy7.gif",
        "https://i.imgur.com/HqDqfp5.gif",
        "https://i.imgur.com/E8GbgJc.gif",
        "https://i.imgur.com/ZMnkgCk.gif",
        "https://i.imgur.com/ld4ll8Z.gif",
        "https://i.imgur.com/mkN1fUD.gif",
        "https://i.imgur.com/cS4KVcw.gif",
        "https://i.imgur.com/TwwzYbz.gif",
    ];
}

export function get_kill_gifs() {
    return ["https://i.imgur.com/Ln8uBGd.gif", "https://i.imgur.com/l4ghSPV.gif", "https://i.imgur.com/wUCtWqP.gif", "https://i.imgur.com/jcsUpO1.gif"];
}

export function get_kiss_gifs() {
    return [
        "https://i.imgur.com/S1CfaqK.gif",
        "https://i.imgur.com/vPXhMoQ.gif",
        "https://i.imgur.com/ayci9tb.gif",
        "https://i.imgur.com/oqlnRgn.gif",
        "https://i.imgur.com/hVe30wE.gif",
        "https://i.imgur.com/Ucgwgg5.gif",
        "https://i.imgur.com/io8IEoZ.gif",
        "https://i.imgur.com/wxqT93o.gif",
        "https://i.imgur.com/34uoGOH.gif",
        "https://i.imgur.com/oOdwxbi.gif",
        "https://i.imgur.com/P9pxS3z.gif",
        "https://i.imgur.com/256J9Nt.gif",
        "https://i.imgur.com/iagndyp.gif",
        "https://i.imgur.com/Nm95DOq.gif",
        "https://i.imgur.com/ziYf2om.gif",
        "https://i.imgur.com/nPnVx0h.gif",
        "https://i.imgur.com/Oz0VioF.gif",
        "https://i.imgur.com/lvgXFFU.gif",
    ];
}

export function get_lewd_gifs() {
    return [
        "https://i.imgur.com/sp39EQG.gif",
        "https://i.imgur.com/h5TvR6W.gif",
        "https://i.imgur.com/9Bp9Ey7.gif",
        "https://i.imgur.com/urSavq4.gif",
        "https://i.imgur.com/q1z1CMp.gif",
        "https://i.imgur.com/Aivfzmv.gif",
        "https://i.imgur.com/OWrnLsb.gif",
        "https://i.imgur.com/Q2VH62P.gif",
        "https://i.imgur.com/8sPpbA1.gif",
        "https://i.imgur.com/OYEuMgp.gif",
        "https://i.imgur.com/uWoLN3w.gif",
        "https://i.imgur.com/z8QdApD.gif",
        "https://i.imgur.com/70B6ZqI.gif",
        "https://i.imgur.com/wZzy49c.gif",
    ];
}

export function get_lick_gifs() {
    return [
        "https://i.imgur.com/KSSYrUS.gif",
        "https://i.imgur.com/vvUW0Io.gif",
        "https://i.imgur.com/YtnjxPM.gif",
        "https://i.imgur.com/XDDz6Cr.gif",
        "https://i.imgur.com/wZ8g4h0.gif",
        "https://i.imgur.com/VSdqFJv.gif",
        "https://i.imgur.com/s9KweAi.gif",
        "https://i.imgur.com/hmxYQJW.gif",
        "https://i.imgur.com/cOlhigJ.gif",
        "https://i.imgur.com/zw8a0tU.gif",
        "https://i.imgur.com/N7MibL0.gif",
    ];
}

export function get_nom_gifs() {
    return ["https://i.imgur.com/LyDB1JX.gif", "https://i.imgur.com/iIVYgGn.gif", "https://i.imgur.com/gCTrFZa.gif", "https://i.imgur.com/gpxUcs9.gif", "https://i.imgur.com/zgHo7X2.gif", "https://i.imgur.com/dr3Lln0.gif"];
}

export function get_pat_gifs() {
    return [
        "https://i.imgur.com/J5WhZb7.gif",
        "https://i.imgur.com/Avh1WVR.gif",
        "https://i.imgur.com/uljHTR0.gif",
        "https://i.imgur.com/Z9Vqivt.gif",
        "https://i.imgur.com/GLWoiCx.gif",
        "https://i.imgur.com/BnOgqQC.gif",
        "https://i.imgur.com/vxLRi25.gif",
        "https://i.imgur.com/fRvhzwf.gif",
        "https://i.imgur.com/LMA7NKb.gif",
        "https://i.imgur.com/vajWoK0.gif",
        "https://i.imgur.com/Z4aTh1v.gif",
        "https://i.imgur.com/qWTbefD.gif",
        "https://i.imgur.com/ZbYvc4I.gif",
        "https://i.imgur.com/NiyXAMn.gif",
        "https://i.imgur.com/cNNjYhL.gif",
        "https://i.imgur.com/nrBrSDg.gif",
        "https://i.imgur.com/EzkG5xg.gif",
        "https://i.imgur.com/EGIGytI.gif",
        "https://i.imgur.com/JONnIw1.gif",
        "https://i.imgur.com/T1vupxt.gif",
        "https://i.imgur.com/JDC5xSq.gif",
        "https://i.imgur.com/UaKSw9Y.gif",
    ];
}

export function get_poke_gifs() {
    return [
        "https://i.imgur.com/zdGdpBt.gif",
        "https://i.imgur.com/dpWKqpz.gif",
        "https://i.imgur.com/QVmagT5.gif",
        "https://i.imgur.com/Y0JygFl.gif",
        "https://i.imgur.com/maWWyft.gif",
        "https://i.imgur.com/QhJW0Sq.gif",
        "https://i.imgur.com/Kz6kpuX.gif",
        "https://i.imgur.com/vAA5ehy.gif",
        "https://i.imgur.com/ZsNCtY1.gif",
        "https://i.imgur.com/DMGwIW6.gif",
        "https://i.imgur.com/F3TS1il.gif",
    ];
}

export function get_pout_gifs() {
    return [
        "https://i.imgur.com/upWvtSK.gif",
        "https://i.imgur.com/t5QrtaQ.gif",
        "https://i.imgur.com/6ReI2dd.gif",
        "https://i.imgur.com/zbNmjOt.gif",
        "https://i.imgur.com/EI1flOg.gif",
        "https://i.imgur.com/okpWqAZ.gif",
        "https://i.imgur.com/qncZEGm.gif",
        "https://i.imgur.com/MnTffj8.gif",
        "https://i.imgur.com/sGXJZEz.gif",
        "https://i.imgur.com/dqyuyvh.gif",
        "https://i.imgur.com/j3CJUnr.gif",
    ];
}

export function get_shrug_gifs() {
    return ["https://i.imgur.com/az36ZoI.gif", "https://i.imgur.com/P8DowRQ.gif", "https://i.imgur.com/AGA5A0v.gif", "https://i.imgur.com/9VKlRNh.gif", "https://i.imgur.com/L3mqxwD.gif", "https://i.imgur.com/NZcl6TE.gif"];
}

export function get_slap_gifs() {
    return [
        "https://i.imgur.com/PiB2eZQ.gif",
        "https://i.imgur.com/E8siRIC.gif",
        "https://i.imgur.com/WFS7viK.gif",
        "https://i.imgur.com/yORkfD7.gif",
        "https://i.imgur.com/WjixYgX.gif",
        "https://i.imgur.com/aU88XL5.gif",
        "https://i.imgur.com/MvwUHBw.gif",
        "https://i.imgur.com/DIoz2TT.gif",
        "https://i.imgur.com/rGIXUdi.gif",
        "https://i.imgur.com/2V7CD4U.gif",
        "https://i.imgur.com/o2hhRn8.gif",
        "https://i.imgur.com/xP6LNdp.gif",
        "https://i.imgur.com/CGsPAUT.gif",
        "https://i.imgur.com/JMYtV3p.gif",
        "https://i.imgur.com/NXOo7Yz.gif",
    ];
}

export function get_sleepy_gifs() {
    return [
        "https://i.imgur.com/Bd00gm0.gif",
        "https://i.imgur.com/eq97h3b.gif",
        "https://i.imgur.com/iyfxlda.gif",
        "https://i.imgur.com/Rg5xQyE.gif",
        "https://i.imgur.com/T318QbO.gif",
        "https://i.imgur.com/lZn4mR7.gif",
        "https://i.imgur.com/qJf9Z6Y.gif",
        "https://i.imgur.com/32bXHzq.gif",
        "https://i.imgur.com/9ASSlKB.gif",
        "https://i.imgur.com/R9TEgrb.gif",
        "https://i.imgur.com/1uC3C6w.gif",
        "https://i.imgur.com/Nui6iCP.gif",
        "https://i.imgur.com/SVeev3V.gif",
    ];
}

export function get_smile_gifs() {
    return [
        "https://i.imgur.com/DHvgRdB.gif",
        "https://i.imgur.com/pBxsOA4.gif",
        "https://i.imgur.com/poc4LzN.gif",
        "https://i.imgur.com/i9goxrh.gif",
        "https://i.imgur.com/nXooOSa.gif",
        "https://i.imgur.com/dgtwM7o.gif",
        "https://i.imgur.com/KLHyCE4.gif",
        "https://i.imgur.com/DOS4h8Y.gif",
        "https://i.imgur.com/ep6D4uP.gif",
        "https://i.imgur.com/qnstrl0.gif",
        "https://i.imgur.com/OBH9J3v.gif",
        "https://i.imgur.com/eOwq3IK.gif",
        "https://i.imgur.com/5wKf2zl.gif",
    ];
}

export function get_smug_gifs() {
    return [
        "https://i.imgur.com/LlVW9qF.gif",
        "https://i.imgur.com/UrULhAk.gif",
        "https://i.imgur.com/K8qZwrk.gif",
        "https://i.imgur.com/drbVS0d.gif",
        "https://i.imgur.com/k8Nkftn.gif",
        "https://i.imgur.com/ysJSIRx.gif",
        "https://i.imgur.com/lwM3sBJ.gif",
        "https://i.imgur.com/UMUjlGU.gif",
        "https://i.imgur.com/cEFp0fU.gif",
        "https://i.imgur.com/HAx6ntE.gif",
        "https://i.imgur.com/WUpOS7w.gif",
        "https://i.imgur.com/49w3zKB.gif",
        "https://i.imgur.com/XlsPTtW.gif",
    ];
}

export function get_think_gifs() {
    return ["https://i.imgur.com/6FGx1NM.gif", "https://i.imgur.com/JoByx01.gif", "https://i.imgur.com/BKh3Xry.gif", "https://i.imgur.com/vM6sH8D.gif", "https://i.imgur.com/MD9pT3Y.gif", "https://i.imgur.com/iLd8uVA.gif"];
}

export function get_tickle_gifs() {
    return [
        "https://i.imgur.com/eXbI4Ac.gif",
        "https://i.imgur.com/jee3bsx.gif",
        "https://i.imgur.com/i4gj4Iv.gif",
        "https://i.imgur.com/2FVzQ9D.gif",
        "https://i.imgur.com/Yx8wTvM.gif",
        "https://i.imgur.com/qoCSS2a.gif",
        "https://i.imgur.com/T9fbzG1.gif",
        "https://i.imgur.com/vfl0cvX.gif",
        "https://i.imgur.com/HGoPzsq.gif",
    ];
}

export function get_tieup_gifs() {
    return ["https://i.imgur.com/QaIfZSl.gif", "https://i.imgur.com/PdlUOqE.gif", "https://i.imgur.com/x0SnvSZ.gif", "https://i.imgur.com/zs5FliT.gif"];
}

export function get_error_embed(msg: Message, prefix: string, command: Command, problem: string, usage_detailed: string) {
    let usage = `\`${prefix}${command.name} ${command.helpUsage}\n\`${prefix}${command.name} ${usage_detailed}\``;
    usage = usage.split("/user_tag/").join(`@${msg.author.tag}`);
    usage = usage.split("/username/").join(msg.author.username);
    const embedError = {
        title: "❌ Wrong arguments",
        color: 8388736,
        fields: [
            {
                name: "Problem:",
                value: problem,
            },
            {
                name: "Usage:",
                value: usage,
            },
        ],
    };

    return embedError;
}

export function get_building_price(level: number, building_name: string) {
    const prices: Record<string, number[]> = {
        b_city_hall: [0, 25000, 50000, 100000, 150000, 300000, 500000, 1000000, 2500000, 5000000, 10000000, 0],
        b_bank: [0, 10000, 25000, 40000, 75000, 100000, 125000, 250000, 500000, 1000000, 3000000, 0],
        b_lab: [0, 20000, 75000, 100000, 125000, 150000, 250000, 275000, 600000, 1250000, 3500000, 0],
        b_sanctuary: [0, 15000, 35000, 50000, 90000, 110000, 135000, 265000, 540000, 1100000, 3250000, 0],
        b_pancakes: [0, 25000, 50000, 100000, 150000, 300000, 500000, 1000000, 1300000, 2000000, 3500000, 0],
        b_crime_den: [0, 30000, 75000, 150000, 250000, 450000, 750000, 1400000, 1950000, 2600000, 40000000, 0],
        b_lewd_services: [0, 45000, 70000, 125000, 250000, 500000, 700000, 1300000, 2000000, 3000000, 4500000, 0],
        b_casino: [0, 50000, 100000, 175000, 350000, 650000, 950000, 1800000, 2500000, 3750000, 50000000, 0],
        b_scrapyard: [0, 100000, 150000, 250000, 500000, 750000, 1500000, 2500000, 4500000, 7500000, 10000000, 0],
        b_pawn_shop: [0, 80000, 125000, 225000, 450000, 700000, 1250000, 2000000, 3800000, 5000000, 7500000, 0],

        b_mayor_house: [0, 250000, 450000, 1250000, 3000000, 5000000, 25000000, 50000000, 100000000, 125000000, 300000000, 0],
        b_shrine: [0, 100000, 210000, 700000, 1500000, 2250000, 10000000, 25000000, 60000000, 100000000, 250000000, 0],
        b_community_center: [0, 125000, 275000, 750000, 1750000, 2500000, 12500000, 27500000, 65000000, 105000000, 260000000, 0],
        b_quantum_pancakes: [0, 150000, 350000, 900000, 2500000, 4000000, 18000000, 35000000, 75000000, 115000000, 280000000, 0],
        b_crime_monopoly: [0, 200000, 400000, 1100000, 3000000, 4500000, 20000000, 40000000, 90000000, 120000000, 295000000, 0],
        b_pet_shelter: [0, 140000, 300000, 775000, 2000000, 3000000, 15000000, 30000000, 70000000, 110000000, 275000000, 0],
    };

    return prices[building_name][level + 1];
}

export function get_building_description(building_field: string) {
    const descriptions: Record<string, string> = {
        b_city_hall: "`[🧱]` Unlocks more upgrades, special roles and lottery.",
        b_bank: "`[⭐]` Unlocks bank and bigger capacity for it.",
        b_lab: "`[🧱]` Unlocks special perks/bonuses for certain actions.",
        b_sanctuary: "`[🧱]` Unlocks pets and improves bonuses from them.",
        b_pancakes: "`[⭐]` This is the main building for work, improves payouts from work and chance for double/triple payouts.",
        b_crime_den: "`[⭐]` This is the main building for crime, improves payouts from crime and lowers the chance of getting caught.",
        b_lewd_services: "`[⭐]` Unlocks idle hourly payouts, even if you're not active.",
        b_casino: "`[⭐]` Unlocks bigger idle hourly payouts, even if you're not active.",
        b_scrapyard: "`[⭐]` Unlocks a neko that finds items at specific intervals, upgrading makes it faster and able to find better rarity items.",
        b_pawn_shop: "`[⭐]` Unlocks a neko that sells items, each sell takes a specific amount of time, upgrading makes it faster and improves the payouts for all items sold.",

        b_mayor_house: "`[🧱]` Unlocks bonuses for mayor and more upgrades for global buildings.",
        b_shrine: "`[⭐]` Unlocks bonuses for all players.",
        b_community_center: "`[🧱]` Unlocks events and improves payouts from them.",
        b_quantum_pancakes: "`[⭐]` Improves payouts from work for all players.",
        b_crime_monopoly: "`[⭐]` Improves payouts from crime for all players.",
        b_pet_shelter: "`[🧱]` Unlocks pets and improves the rate at which they're available for sale and rarity of them. All players will be able to buy pets from this.",
    };

    return descriptions[building_field];
}

export function get_buildings_guide_embed(command_data: CommandData) {
    const embed = {
        title: "Buildings - General Guide",
        description:
            "`🧱 Neko's City Hall` - Unlocks more upgrades, special roles and lottery.\n" +
            "`⭐ Neko's Bank` - Unlocks bank and bigger capacity for it.\n" +
            "`🧱 Neko's Lab` - Unlocks special perks/bonuses for certain actions.\n" +
            "`🧱 Neko's Sanctuary` - Unlocks pets and improves bonuses from them.\n" +
            "`⭐ Neko's Pancakes` - This is the main building for work, improves payouts from work and chance for double/triple payouts.\n" +
            "`⭐ Neko's Crime Den` - This is the main building for crime, improves payouts from crime and lowers the chance of getting caught.\n" +
            "`⭐ Neko's Lewd Services` - Unlocks idle hourly payouts, even if you're not active.\n" +
            "`⭐ Neko's Casino` - Unlocks bigger idle hourly payouts, even if you're not active.\n" +
            "`⭐ Neko's Scrapyard` - Unlocks a neko that finds items at specific intervals, upgrading makes it faster and able to find better rarity items.\n" +
            "`⭐ Neko's Pawn Shop` - Unlocks a neko that sells items, each sell takes a specific amount of time, upgrading makes it faster and improves the payouts for all items sold.\n\n" +
            "`🧱 Neko's Mayor House` - Unlocks bonuses for mayor and more upgrades for global buildings.\n" +
            "`⭐ Neko's Shrine` - Unlocks bonuses for all players.\n" +
            "`🧱 Neko's Community Center` - Unlocks events and improves payouts from them.\n" +
            "`⭐ Neko's Quantum Pancakes` - Improves payouts from work for all players.\n" +
            "`⭐ Neko's Crime Monopoly` - Improves payouts from crime for all players.\n" +
            "`🧱 Neko's Pet Shelter` - Unlocks pets and improves the rate at which they're available for sale and rarity of them. All players will be able to buy pets from this.",
        footer: { text: `You can view more detailed information about a building with - ${command_data.guild_data.prefix}building "building_name"` },
    };

    return embed;
}

export function get_economy_guide_embed(command_data: CommandData) {
    const embed = {
        title: "Economy - General Guide",
        description:
            `\`[❤️]\` Hey there ${command_data.message.author}. You want to know more about the economy? Okay, let's get started!\n` +
            `\`[🔎]\` First of all here are some basics. You can see all your profile information with \`${command_data.guild_data.prefix}profile\` and your balance with \`${command_data.guild_data.prefix}bal\`.\n` +
            `If you want to see your items, you can do \`${command_data.guild_data.prefix}inventory\` or use items with \`${command_data.guild_data.prefix}use\`.\n` +
            `You can also send money to other people with \`${command_data.guild_data.prefix}transfer\` or give them reputation with \`${command_data.guild_data.prefix}rep\`.\n` +
            `Also you can marry them with \`${command_data.guild_data.prefix}marry\` or divorce them \`${command_data.guild_data.prefix}divorce\`, if they get really annoying.\n` +
            `If you want to know who is the richest, you might want to check out \`${command_data.guild_data.prefix}top\` or \`${command_data.guild_data.prefix}top -server\`.\n\n` +
            "`[🪙]` Now then, how to make money? That's a good question! There are a few ways...\n" +
            `You can work at your city's pancake shop with \`${command_data.guild_data.prefix}work\` or help the nekos with their shady plans with \`${command_data.guild_data.prefix}crime\`.\n` +
            `If you're really down bad, you can also beg people for money with \`${command_data.guild_data.prefix}beg\` or steal from somebody with \`${command_data.guild_data.prefix}steal\`.\n` +
            `Also vote with \`${command_data.guild_data.prefix}vote\`, it gives you goodies aswell (>w<).\n` +
            `Also, if you're feeling really lucky, you can gamble with \`${command_data.guild_data.prefix}coinflip\`, \`${command_data.guild_data.prefix}slots\` or \`${command_data.guild_data.prefix}roll\`.\n\n` +
            "`[💵]` Now that you're rich and all, you might want to know how to get even richer! That's where you can get into expanding your own city.\n" +
            "All the time you are making pancakes or crimes, that's where your city comes to play. And improving your city also improves how much you make and unlocks cool perks and bonuses.\n" +
            `You can see how big your city is with \`${command_data.guild_data.prefix}buildings\` or look at individual building's progress with \`${command_data.guild_data.prefix}build building_name\`.\n\n` +
            `\`[🏗️]\` There is probably a lot of buildings and you don't know what to do first, but that's fine. You can see general description of all buildings with \`${command_data.guild_data.prefix}buildingsguide\`.\n` +
            `Once you decide what building you want to work on, progress with the construction with \`${command_data.guild_data.prefix}build building_name amount_of_credits\`.\n` +
            `If you have progressed enough (you can check with \`${command_data.guild_data.prefix}build building_name\`, if you forgot), you can do \`${command_data.guild_data.prefix}upgrade building_name\` to upgrade a building.\n` +
            "Now you're on your way to become the best pancake seller, criminal overlord or casino owner in the city!\n\n" +
            "`[👾]` If you would want to go even further, you can help everyone work on global buildings aswell. The concept is the very same, except that everyone can build and benefit from these!\n" +
            "You could also aim to be the mayor and decide on important decisions in the city. But that's for some other time...",
        footer: { text: `If you have any questions, ask in the support server - ${command_data.guild_data.prefix}support` },
    };

    return embed;
}

export function get_building_field(building_name: string) {
    const buildings: Record<string, string> = {
        "neko's city hall": "b_city_hall",
        "neko's bank": "b_bank",
        "neko's lab": "b_lab",
        "neko's sanctuary": "b_sanctuary",
        "neko's pancakes": "b_pancakes",
        "neko's crime den": "b_crime_den",
        "neko's lewd services": "b_lewd_services",
        "neko's casino": "b_casino",
        "neko's scrapyard": "b_scrapyard",
        "neko's pawn shop": "b_pawn_shop",
    };

    return buildings[building_name];
}

export function get_global_building_field(building_name: string) {
    const buildings: Record<string, string> = {
        "neko's mayor house": "b_mayor_house",
        "neko's shrine": "b_shrine",
        "neko's community center": "b_community_center",
        "neko's quantum pancakes": "b_quantum_pancakes",
        "neko's crime monopoly": "b_crime_monopoly",
        "neko's pet shelter": "b_pet_shelter",
    };

    return buildings[building_name];
}

export function get_items() {
    const items = new Map();
    items.set("1", { id: "0", type: "box", display_name: "Common Box", box_payouts: [50, 100, 150], description: "A common lootbox with a cash prize inside~", rarity: "common" });
    items.set("2", { id: "1", type: "box", display_name: "Uncommon Box", box_payouts: [100, 150, 200, 300], description: "An uncommon lootbox with a cash prize inside~", rarity: "uncommon" });
    items.set("0", { id: "2", type: "box", display_name: "Rare Box", box_payouts: [300, 500, 750], description: "A rare lootbox with a cash prize inside~", rarity: "rare" });
    items.set("3", { id: "3", type: "box", display_name: "Legendary Box", box_payouts: [1500, 1700, 1900, 2250], description: "A legendary lootbox with a cash prize inside~", rarity: "legendary" });
    items.set("4", { id: "4", type: "cash", display_name: "Cash Stack", cash_payout: 500, description: "A cash stack you can use to get cash~", rarity: "common" });
    items.set("5", { id: "5", type: "cash_others", display_name: "Mystery Cash Stack", cash_payout: 500, description: "A cash stack you can use on somebody else to give them cash~", rarity: "common" });
    items.set("8", {
        id: "8",
        type: "party_popper",
        display_name: "Small Party Popper",
        cash_payout: 250,
        users: 3,
        description: "A party popper you can use to start a party~ 3 random people will have the chance to get a cash reward~",
        rarity: "common",
    });
    items.set("9", {
        id: "9",
        type: "party_popper",
        display_name: "Medium Party Popper",
        cash_payout: 500,
        users: 3,
        description: "A party popper you can use to start a party~ 3 random people will have the chance to get a cash reward~",
        rarity: "uncommon",
    });
    items.set("10", {
        id: "10",
        type: "party_popper",
        display_name: "Large Party Popper",
        cash_payout: 500,
        users: 5,
        description: "A party popper you can use to start a party~ 5 random people will have the chance to get a cash reward~",
        rarity: "rare",
    });
    items.set("11", {
        id: "11",
        type: "confetti_ball",
        display_name: "Small Confetti Ball",
        cash_payout: 250,
        users: 3,
        description: "A confetti ball you can open and give 3 random people in the server a cash reward~",
        rarity: "common",
    });
    items.set("12", {
        id: "12",
        type: "confetti_ball",
        display_name: "Medium Confetti Ball",
        cash_payout: 500,
        users: 3,
        description: "A confetti ball you can open and give 3 random people in the server a cash reward~",
        rarity: "uncommon",
    });
    items.set("13", {
        id: "13",
        type: "confetti_ball",
        display_name: "Large Confetti Ball",
        cash_payout: 500,
        users: 5,
        description: "A confetti ball you can open and give 5 random people in the server a cash reward~",
        rarity: "rare",
    });
    items.set("14", { id: "14", type: "shield", display_name: "Shield", description: "A single-use shield that protects you from thieves~", rarity: "common" });
    items.set("15", { id: "15", type: "book_red", display_name: "Red Book", description: "A red book~", can_be_scavanged: true, rarity: "common" });
    items.set("16", { id: "16", type: "book_blue", display_name: "Blue Book", description: "A blue book~", can_be_scavanged: true, rarity: "uncommon" });
    items.set("17", { id: "17", type: "book_orange", display_name: "Orange Book", description: "A orange book~", can_be_scavanged: true, rarity: "uncommon" });
    items.set("18", { id: "18", type: "book_yellow", display_name: "Yellow Book", description: "A yellow book~", can_be_scavanged: true, rarity: "legendary" });
    items.set("19", { id: "19", type: "book_purple", display_name: "Purple Book", description: "A purple book~", can_be_scavanged: true, rarity: "rare" });
    items.set("20", { id: "20", type: "bomb", display_name: "Bomb", description: "A bomb~", can_be_scavanged: true, rarity: "uncommon" });
    items.set("21", { id: "21", type: "crystal_ball", display_name: "Crystal Ball", description: "A crystal ball~", can_be_scavanged: true, rarity: "common" });
    items.set("22", { id: "22", type: "balloon", display_name: "Balloon", description: "A balloon~", can_be_scavanged: true, rarity: "common" });
    items.set("23", { id: "23", type: "magic_wand", display_name: "Magic Wand", description: "A magic wand~", can_be_scavanged: true, rarity: "uncommon" });
    items.set("24", { id: "24", type: "teddy_bear", display_name: "Teddy Bear", description: "A teddy bear~", can_be_scavanged: true, rarity: "common" });
    items.set("25", { id: "25", type: "pinata", display_name: "Piñata", description: "A piñata~", can_be_scavanged: true, rarity: "uncommon" });
    items.set("26", { id: "26", type: "yarn", display_name: "Yarn", description: "A yarn~", can_be_scavanged: true, rarity: "uncommon" });
    items.set("27", { id: "27", type: "laptop", display_name: "Laptop", description: "A laptop~", can_be_scavanged: true, rarity: "legendary" });
    items.set("28", { id: "28", type: "floppy", display_name: "Floppy Disk", description: "A floppy~", can_be_scavanged: true, rarity: "common" });
    items.set("29", { id: "29", type: "flashlight", display_name: "Flashlight", description: "A flashlight~", can_be_scavanged: true, rarity: "common" });
    items.set("30", { id: "30", type: "scroll", display_name: "Scroll", description: "A scroll~", can_be_scavanged: true, rarity: "uncommon" });
    items.set("31", { id: "31", type: "credit_card", display_name: "Credit Card", description: "A credit card~", can_be_scavanged: true, rarity: "rare" });
    items.set("32", { id: "32", type: "key", display_name: "Key", description: "A key~", can_be_scavanged: true, rarity: "rare" });
    items.set("33", { id: "33", type: "bread", display_name: "Bread", description: "A bread~", can_be_scavanged: true, rarity: "common" });
    items.set("34", { id: "34", type: "pizza", display_name: "Pizza", description: "A pizza~", can_be_scavanged: true, rarity: "common" });
    items.set("35", { id: "35", type: "fish", display_name: "Fish", description: "A fish~", can_be_scavanged: true, rarity: "common" });
    items.set("36", { id: "36", type: "cookie", display_name: "Cookie", description: "A cookie~", can_be_scavanged: true, rarity: "common" });
    items.set("37", { id: "37", type: "medal", display_name: "Medal", description: "A medal~", can_be_scavanged: true, rarity: "rare" });
    items.set("38", { id: "38", type: "trophy", display_name: "Trophy", description: "A trophy~", can_be_scavanged: true, rarity: "rare" });
    items.set("39", { id: "39", type: "lewd_object", display_name: "Pink Lewd Object", description: "A pink lewd obejct~", can_be_scavanged: true, rarity: "common" });
    items.set("40", { id: "40", type: "lollipop", display_name: "Lollipop", description: "A lollipop~", can_be_scavanged: true, rarity: "common" });
    items.set("41", { id: "41", type: "lewd_object", display_name: "Black Lewd Object", description: "A black lewd object~", can_be_scavanged: true, rarity: "legendary" });
    items.set("42", { id: "42", type: "lewd_object", display_name: "Red Lewd Object", description: "A red lewd object~", can_be_scavanged: true, rarity: "rare" });

    return items;
}

export function get_shop_items() {
    return new Map();
}
