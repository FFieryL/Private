import Settings from "../config"
import { data, drawText, registerOverlay } from "../managers/guimanager"
import { chat, S03PacketTimeUpdate, S08PacketPlayerPosLook, S32PacketConfirmTransaction } from "../util/utils"
registerOverlay("StormTimer", { text: () => "0.00", align: "center"})
registerOverlay("P3Timer", { text: () => "0.00", align: "center", colors: false})
registerOverlay("pyLBTimer", { text: () => "10.00", align: "center"})
registerOverlay("StormDeathTime", { text: () => "36.20", align: "center"})
registerOverlay("DeathTickTimer", { text: () => "0.00", align: "center", colors: false})

let deathTime = 0;
let goldorStarted = false
let stormEnded = false

const stormTickListener = register("packetReceived", (packet, event) => {
    if (packet.func_148888_e()) return;
    global.stormTicks++;
}).setFilteredClass(S32PacketConfirmTransaction).unregister()

register("packetReceived", (packet, event) => {
    if (packet.func_148888_e()) return;
    
    if (stormEnded) {
        if (--global.goldorTicks <= 0) stormEnded = false
    }
    if (!goldorStarted) return
    
    global.goldorTotal++

    if (Settings().goldorTimerType == 0) {
        if (global.goldorTicks > 60) {
            global.goldorTicks = 60 - (global.goldorTicks % 60)
        }
        if (--global.goldorTicks <= 0) {
            global.goldorTicks = 60
        }
    } else {
        global.goldorTicks++
    }
}).setFilteredClass(S32PacketConfirmTransaction)

const worldLoad = register("worldUnload", () => {
    resetStuffStorm()
    resetStuffGoldor()
    LBTimer.unregister()
}).unregister()

register("chat", () => {
    global.stormTicks = 0
    if (Settings().pyLBTimer || Settings().stormTimer) {
        stormTickListener.register()
        if (Settings().stormTimer) {
            overlay.register();
        }
    }
}).setCriteria("[BOSS] Storm: Pathetic Maxor, just like expected.")

register("chat", () => {
    resetStuffStorm()
    LBTimer.unregister()
    if (!Settings().goldorStartTimer) return;
    global.goldorTicks = 104
    stormEnded = true
    goldorStartOverlay.register()
}).setCriteria("[BOSS] Storm: I should have known that I stood no chance.")


// Storm Timer

function resetStuffStorm() {
    global.stormTicks = 0
    stormTickListener.unregister()
    overlay.unregister()
}

const overlay = register("renderOverlay", () => {
    const displayText = (global.stormTicks / 20).toFixed(2).toString()
    drawText(displayText, data.StormTimer, true, "StormTimer")
}).unregister()


// P3 timer

function resetStuffGoldor() {
    global.goldorTicks = 0
    global.goldorTotal = 0
    goldorStarted = false
    goldorOverlay.unregister()
}

register("chat", () => {
    stormEnded = false
    if (!Settings().goldorTimer) return;
    if (Settings().goldorTimerType == 0) global.goldorTicks = 60;
    else global.goldorTicks = 0
    global.goldorTotal = 0
    goldorStarted = true
    goldorOverlay.register();
    goldorStartOverlay.unregister()
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?")

const chatTrig3 = register("chat", () => {
    resetStuffGoldor()
}).setCriteria("The Core entrance is opening!").unregister()

const goldorOverlay = register("renderOverlay", () => {
    const timeT = global.goldorTicks
    const timeS = (timeT / 20)
    let color
    if(Settings().goldorTimerType == 0) color = (timeT > 40 ? "&a" : timeT > 20 ? "&6" : "&c")
    else {
        const deathtick = timeT % 60
        color = (deathtick < 20 ? "&a" : deathtick < 40 ? "&6" : "&c")
    }
    global.goldorColor = color
    let displayText = color + timeS.toFixed(2).toString()
    if (Settings().goldorTimerTicks) displayText = color + timeT
    drawText(displayText, data.P3Timer, true, "P3Timer")
}).unregister()

const goldorStartOverlay = register("renderOverlay", () => {
    const timeT = global.goldorTicks
    if (timeT <= 0) goldorStartOverlay.unregister()
    const timeS = (timeT / 20)
    let color = (timeT > 52 ? "&a" : timeT > 26 ? "&6" : "&c")

    const displayText = color + timeS.toFixed(2).toString()
    drawText(displayText, data.P3Timer, true, "P3Timer")
}).unregister()





//Timer for perfect LB release

const chatTrig1 = register("chat", () => {
    LBTimer.register()
}).setCriteria(/\[BOSS\] Storm: (ENERGY HEED MY CALL!|THUNDER LET ME BE YOUR CATALYST!)/).unregister()


const LBTimer = register("renderOverlay", () => {

    const targetTicks = parseFloat(Settings().pyLBTimerSeconds) * 20

    if(global.stormTicks > 0) {
        let displayText = ""
        if (global.stormTicks >= targetTicks) {
            displayText = "RELEASE NOW"
            const heldItemName = Player?.getHeldItem()?.getName()?.toLowerCase();
            if (!heldItemName) return;
            if(!heldItemName.toLowerCase().includes("last breath")) {
                LBTimer.unregister()
            }
        }
        else {
            const remainingTicks = targetTicks - global.stormTicks
            const remainingSeconds = (remainingTicks / 20).toFixed(2)

            const color = remainingTicks < 40 ? "&c" : "&e";
            displayText = `${color}${remainingSeconds}`
        }

        drawText(displayText, data.pyLBTimer, true, "pyLBTimer");
    }
}).unregister()


register("chat", () => {
    if (!Settings().sendStormTime) return;
    deathTime = global.stormTicks
    chat(`&aStorm died at &e${(global.stormTicks / 20).toFixed(2)}s&r.`)
    stormDeathTime.register()
    setTimeout(() => {
        stormDeathTime.unregister()
    }, 2000);

}).setCriteria("⚠ Storm is enraged! ⚠")

const stormDeathTime = register("renderOverlay", () => {
    let displayText = (deathTime / 20).toFixed(2)
    drawText(displayText, data.StormDeathTime, true, "StormDeathTime")
}).unregister()




// Death Tick Timer
let deathTicks = -1;
let spawnPos = null

const serverTick = register("packetReceived", () => {
    --deathTicks;
    if (deathTicks <= 0) deathTicks = 40
}).setFilteredClass(S32PacketConfirmTransaction).unregister();

let S03;
let S08 = register("packetReceived", () => {
    S03 = register("packetReceived", (packet) => {
        const totalWorldTime = packet.func_149366_c();
        if (!totalWorldTime) return;

        deathTicks = 40 - (totalWorldTime % 40);
        serverTick.register();
        if (Settings().deathTickTimer && spawnPos != null) deathTickOverlay.register()
        return;
    }).setFilteredClass(S03PacketTimeUpdate);

    S08.unregister();
    return;
}).setFilteredClass(S08PacketPlayerPosLook);


const spawnPosition = register('packetReceived', (packet) => {
    const [px, py, pz] = [packet.func_148932_c(), packet.func_148928_d(), packet.func_148933_e()];
    if (py !== 75.5 && py !== 76.5) return;

    spawnPos = [px, py, pz];
    spawnPosition.unregister();
    return;
}).setFilteredClass(S08PacketPlayerPosLook);

register("chat", (message) => {
    if (message == "[NPC] Mort: Here, I found this map when I first entered the dungeon." || message == "[NPC] Mort: Good luck.") {
        spawnPos = null
        serverTick.unregister()
        deathTickOverlay.unregister()
    }
    if (!message.includes("Sending to server")) return;
    deathTicks = -1;
    spawnPos = null;
    spawnPosition.register()
}).setCriteria("${message}")

const deathTickOverlay = register("renderOverlay", () => {
    const timeT = deathTicks
    const timeS = (timeT / 20).toFixed(2)
    let color;
    if(timeT > 20) color = "&a"
    else if (timeT > 10) color = "&6"
    else color = "&c";
    const displayText = Settings().deathTickTimerType ? color + timeS.toString() : color + timeT.toString()
    drawText(displayText, data.DeathTickTimer, true, "DeathTickTimer")
}).unregister()

register("worldUnload", () => {
    deathTicks = -1;
    serverTick.register();
    deathTickOverlay.unregister()
    S08.register();
});

if (Settings().pyLBTimer) {
    resetStuffStorm()
    worldLoad.register()
    chatTrig1.register()
    LBTimer.unregister()
}


if (Settings().stormTimer) {
    resetStuffStorm()
    worldLoad.register()
}


Settings().getConfig().registerListener("pyLBTimer", (prev, curr) => {
    resetStuffStorm()
    if(curr) {
        chatTrig1.register()
        LBTimer.unregister()
    }
    else {
        chatTrig1.unregister()
        LBTimer.unregister()
        if(Settings().goldorTimer || Settings().stormTimer) return;
        worldLoad.unregister()
    }
})

Settings().getConfig().registerListener("stormTimer", (prev, curr) => {
    resetStuffStorm()
    if(curr) {
        worldLoad.register()
    }
    else {
        if(Settings().goldorTimer || Settings().pyLBTimer) return;
        worldLoad.unregister()
    }
})


if (Settings().goldorTimer) {
    resetStuffGoldor()
    chatTrig3.register()
    worldLoad.register()
}

Settings().getConfig().registerListener("goldorTimer", (prev, curr) => {
    resetStuffGoldor()
    if(curr) {
        chatTrig3.register()
        worldLoad.register()
    }
    else {
        chatTrig3.unregister()
        if(Settings().stormTimer || Settings().pyLBTimer) return;
        worldLoad.unregister()
    }
})
