import Settings from "../config"
import { data, drawText, registerOverlay } from "../managers/guimanager"
import dungeonUtils from "../util/dungeonUtils"
import { S32PacketConfirmTransaction } from "../util/utils"
let thingydone = null
let thingycompleted = null
let thingytotal = null
let InP3 = false
let completedat = 0
let playername = null
registerOverlay("TermNoti", { text: () => stuff(), align: "center", colors: true })

function stuff() {
    if(Settings().detailedMode) {
        if(Settings().fullName) return "Fiery - &bTerminal &r&f(&d&l1&f/&d&l7&r&f)"
        else return "Fiery - &bTerm &r&f(&d&l1&f/&d&l7&r&f)"
    }
    else {
        if(Settings().fullName) return "&bTerminal &r&f(&d&l1&f/&d&l7&r&f)"
        else return "&bTerm &r&f(&d&l1&f/&d&l7&r&f)"
    }
}

function resetstuff() {
    thingycompleted = 0
    thingytotal = 7
    thingydone = null
    completedat = 0
    gatenotblown = false
    lastcompleted = 0
    playername = null
}

function registerTriggers(bool) {
    const triggers = [termoverlaystuff, inp3, gatestuff, gatestuff1, corestuff]
    triggers.forEach(trig => {
        if (bool) {
            trig.register();
        } else {
            trig.unregister();
        }
    });
}

register("worldLoad", () => {
    registerTriggers(false)
    resetstuff()
    InP3 = false
})

const chatTrig = register("chat", () => {
    registerTriggers(true)
    resetstuff()
    InP3 = true
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.").unregister()


const corestuff = register("chat", () => {
    thingydone = "&5Core Open!"
    thingytotal = null
    thingycompleted = null
    playername = null
    setTimeout(() => {
        InP3 = false
        completedat = 0
        registerTriggers(false)
    }, 2000);
}).setCriteria("The Core entrance is opening!").unregister()


const gatestuff = register("chat", () => {
    if(!Settings().GateNoti && !gatenotblown) return;
    if(!Settings().KeepTitles) tickListener.register()
    completedat = 40
    thingydone = "&aGate Destroyed"
    thingytotal = null
    thingycompleted = null
    playername = null
}).setCriteria("The gate has been destroyed!").unregister()


const gatestuff1 = register("chat", () => {
    if(!Settings().KeepTitles) tickListener.register()
    completedat = 40
    thingydone = "&cGate: 5s"
    gatenotblown = true
    thingytotal = null
    thingycompleted = null
    playername = null
}).setCriteria("The gate will open in 5 seconds!").unregister()

let lastcompleted = 0


const inp3 = register("chat", (name, action, object, completed, total, event) => {
    if(!Settings().KeepTitles) tickListener.register()
    completedat = 40
    thingycompleted = completed
    thingytotal = total
    playername = name
    switch (object) {
        case "terminal":
            thingydone = Settings().fullName ? "&bTerminal" : "&bTerm"
            lastcompleted = completed
            break;
        case "lever":
            thingydone = "&bLever"
            lastcompleted = completed
            break;
        case "device":
            const playerclass = dungeonUtils.getPlayerClass(name)
            if(lastcompleted == completed) {
                if(!Settings().instaNoti) {
                    completedat = 0
                    thingydone = null
                    thingycompleted = null
                    thingytotal = null
                    playername = null
                    return;
                }
                if(playerclass == "Berserk") {
                    thingydone = "&5I4 Done"
                    thingycompleted = null
                    thingytotal = null
                    break;
                }
                else /*if (playerclass == "Archer")*/ {
                    thingydone = "&5Lights Done"
                    thingycompleted = null
                    thingytotal = null
                    break;
                }
            }
            thingydone = Settings().fullName ? "&5Device" : "&5Dev"
            lastcompleted = completed
            break;
        default:
            break;
    }
}).setCriteria(/(.+) (activated|completed) a (terminal|device|lever)! \((\d)\/(\d)\)/).unregister()

const tickListener = register('packetReceived', () => {
    completedat--;
    if(completedat > 0) return;
    thingydone = null
    thingycompleted = null
    thingytotal = null
    playername = null
    tickListener.unregister()
}).setFilteredClass(S32PacketConfirmTransaction).unregister()

const termoverlaystuff = register("renderOverlay", () => {
    if(!thingydone) return
    let displaytext
    if(thingycompleted && thingytotal) {
        displaytext = thingydone + " &r&f(&d&l" + thingycompleted + "&f/&d&l" + thingytotal + "&r&f)";
        if(Settings().detailedMode) displaytext = `${playername} - ${displaytext}`
    }
    else{
        displaytext = thingydone
    }
    drawText(displaytext, data.TermNoti, true, "TermNoti")
}).unregister();

const blockedPhrases = [
    "activated a terminal!",
    "completed a device!",
    "activated a lever!",
    "destroyed",
    "gate will open in 5 seconds!",
    "core entrance is opening!"
];

const cancelTitlesTrig = register("renderTitle", (title, subtitle, event) => {
    if(!InP3) return;
    if (blockedPhrases.some(phrase => title.toLowerCase().includes(phrase) || subtitle.toLowerCase().includes(phrase))) cancel(event)
}).unregister()

if (Settings().CancelTitles) {
    cancelTitlesTrig.register();
}

if (Settings().TermNoti) {
    chatTrig.register()
    if(dungeonUtils.currentPhase == 3) {
        registerTriggers(true)
        resetstuff()
        InP3 = true
    }
}

Settings().getConfig().registerListener("CancelTitles", (prev, curr) => {
    if (curr) cancelTitlesTrig.register();
    else cancelTitlesTrig.unregister();
})

Settings().getConfig().registerListener("TermNoti", (prev, curr) => {
    if (curr) {
        chatTrig.register()
        if(dungeonUtils.currentPhase == 3) {
            registerTriggers(true)
            resetstuff()
            InP3 = true
        }
    }
    else {
        chatTrig.unregister()
        registerTriggers(false)
        InP3 = false
        resetstuff()
    }
})