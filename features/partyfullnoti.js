import Settings from "../config"
import PartyV2 from "../../BloomCore/PartyV2"

let notified = false;
let timerstarted = 0;
let counter = 0
let inAlarm = false
let lastPartySize = 0;
let tries = 0

function inskyblock() {
    if((Server.getIP() == "localhost" || !Server.getIP().includes("hypixel"))) return;
    let isinskyblock = Scoreboard.getTitle().removeFormatting().toLowerCase().includes("skyblock")
    if(!isinskyblock){
        tries++
        if(tries > 5) return;
        setTimeout(() => {
            inskyblock()
        }, 5000);
    }
    else {
        stepTrig.register()
        return;
    }
}

const alarm = register("renderOverlay", () => {
    World.playSound("random.orb", Settings().partyNotiVolume, 0);
    inAlarm = true
    if (Date.now() - timerstarted > (Settings().partyNotiTime * 1000)) {
        inAlarm = false
        alarm.unregister()
    }
}).unregister()

const stepTrig = register("step", () => {
    if(counter > 5) {
        stepTrig.unregister()
        return;
    }
    const names = TabList.getNames();
    if (!names) return;
    const area = names.find(tab => tab.includes("Area") || tab.includes("Cata"));
    if(!area || !area.includes("Dungeon Hub")) return counter++;

    counter = 0
    const partyline = names.find(line => line.includes("Party: "));
    if(!partyline) return;

    if(partyline.match(/§r§b§lParty: §r§7No party§r/)) {
        notified = false;
        lastPartySize = 0;
        alarm.unregister()
    }

    const match = partyline.match(/§r§b§lParty: §r§f\((\d+)\/5\)§r/)
    if(!match) return;
    const partySize = parseInt(match[1])

    if (partySize < 5) {
        notified = false;
        alarm.unregister()
    }
    if(partySize == 5 && lastPartySize < 5 && (!Settings().partyLeaderOnly || (PartyV2.leader == Player.getName())) && !notified) {
        notified = true;
        alarm.register()
        timerstarted = Date.now()
    }

    lastPartySize = partySize
}).setDelay(5).unregister()

const chatTrig = register("chat", () => {
    if(inAlarm) return;
    alarm.register()
    timerstarted = Date.now()
}).setCriteria("Party Finder > Your group has been removed from the party finder!").unregister()

const chatTrig1 = register("chat", () => {
    alarm.register()
    timerstarted = Date.now()
}).setCriteria("The party was disbanded because all invites expired and the party was empty.").unregister()

const worldLoadTrig = register("worldLoad", () => {
    inAlarm = false
    counter = 0
    tries = 0
    alarm.unregister()
    inskyblock()
}).unregister()


if (Settings().partyFullNoti) {
    inAlarm = false
    counter = 0
    tries = 0
    worldLoadTrig.register()
    inskyblock()
}

if(Settings().partyDequeuedAlarm) {
    chatTrig.register()
    chatTrig1.register()
}

Settings().getConfig().registerListener("partyDequeuedAlarm", (prev, curr) => {
    if (curr) {
        chatTrig.register()
        chatTrig1.register()
    }
    else {
        chatTrig1.unregister()
        chatTrig.unregister()
        alarm.unregister()
    }
})

Settings().getConfig().registerListener("partyFullNoti", (prev, curr) => {
    if (curr) {
        inAlarm = false
        counter = 0
        tries = 0
        inskyblock()
        worldLoadTrig.register()
    }
    else {
        stepTrig.unregister();
        worldLoadTrig.unregister()
        alarm.unregister()
    }
})
