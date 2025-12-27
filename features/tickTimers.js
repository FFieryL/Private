import Settings from "../config"
import { data, drawText, registerOverlay } from "../managers/guimanager"
import { chat, S32PacketConfirmTransaction } from "../util/utils"
registerOverlay("StormTimer", { text: () => "0.00", align: "center"})
registerOverlay("P3Timer", { text: () => "0.00", align: "center", colors: false})
registerOverlay("pyLBTimer", { text: () => "10.00", align: "center"})
registerOverlay("StormDeathTime", { text: () => "36.20", align: "center"})

let deathTime = 0;


const stormTickListener = register("packetReceived", (packet, event) => {
    if (packet.func_148890_d() > -1) return;
    global.stormTicks++;
}).setFilteredClass(S32PacketConfirmTransaction).unregister()

const goldorTickListener = register("packetReceived", (packet, event) => {
    if (packet.func_148890_d() > -1) return;
    if (Settings().goldorTimerType == 0) {
        if (global.goldorTicks > 60) {
            global.goldorLoop = Math.floor(global.goldorTicks / 60)
            global.goldorTicks = global.goldorTicks % 60
        }
        if (--global.goldorTicks == 0) {
            global.goldorTicks = 60
            global.goldorLoop++
        }
    } else {
        global.goldorTicks++
        global.goldorLoop = Math.floor(global.goldorTicks / 60)
    }
}).setFilteredClass(S32PacketConfirmTransaction).unregister()

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
    global.goldorLoop = 0
    goldorTickListener.unregister()
    goldorOverlay.unregister()
}

const chatTrig2 = register("chat", () => {
    if (Settings().goldorTimerType == 0) global.goldorTicks = 60;
    else global.goldorTicks = 0
    global.goldorLoop = 0
    goldorTickListener.register()
    goldorOverlay.register();
}).setCriteria("[BOSS] Goldor: Who dares trespass into my domain?").unregister()

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
    chatTrig2.register()
    chatTrig3.register()
    worldLoad.register()
}

Settings().getConfig().registerListener("goldorTimer", (prev, curr) => {
    resetStuffGoldor()
    if(curr) {
        chatTrig2.register()
        chatTrig3.register()
        worldLoad.register()
    }
    else {
        chatTrig2.unregister()
        chatTrig3.unregister()
        if(Settings().stormTimer || Settings().pyLBTimer) return;
        worldLoad.unregister()
    }
})