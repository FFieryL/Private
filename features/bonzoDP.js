import Settings from "../config"
import { data, drawText, registerOverlay } from "../managers/guimanager"
import { chat, S32PacketConfirmTransaction } from "../util/utils"

registerOverlay("BonzoTimer", {
    text: () => "0.00 &cX",
    align: "center"
})

const MAX_INVINCIBILITY = 60

let activeTime = 0
let bonzoResult = false

// ---------------- SERVER TICK ----------------
register("packetReceived", (packet, event) => {
    if (packet.func_148888_e()) return;
    if (activeTime < 0) {
        running.unregister()
        return;
    }
    if (activeTime >= 0) activeTime--


}).setFilteredClass(S32PacketConfirmTransaction)

// ---------------- BONZO PROC ----------------
register("chat", () => {
    if (!Settings().bonzoDP) return

    activeTime = MAX_INVINCIBILITY
    bonzoResult = false

    running.register()
    let goldorTick = global.goldorTicks
    if (Settings().goldorTimerType != 0) goldorTick = 60 - (goldorTick % 60)
    //chat(`&bBonzo Mask Procced at ${goldorTick}! (total ${global.goldorTotal})`)

    const logMsg = `Bonzo Mask Procced at ${goldorTick}! (total ${global.goldorTotal})`
    chat(`&b${logMsg}`)

    // try {
    //     const time = new Date().toLocaleString();
    //     const dataToSave = `[${time}] Bonzo Proc at: ${goldorTick} ticks (${(goldorTick / 20).toFixed(2)}) | Total: ${global.goldorTotal} ticks (${(global.goldorTotal / 20).toFixed(2)}) | Loop: ${Math.floor(global.goldorTotal / 60) + 1}\n`;
    //     FileLib.append("./config/ChatTriggers/modules/PrivateASF/data/bonzo_logs.txt", dataToSave);
    // } catch (e) {
    //     console.log("Failed to log Bonzo Proc: " + e);
    // }
}).setCriteria(/Your (?:⚚ )?Bonzo's Mask saved your life!/)

// ---------------- OVERLAY ----------------
const running = register("renderOverlay", () => {
    if (!Settings().bonzoDP || activeTime <= 0) return

    let color = activeTime > 40 ? "&a" : activeTime > 20 ? "&6" : "&c"
    let text = `${(activeTime / 20).toFixed(2)}`

    
    let goldorTicks = global.goldorTicks
    if (Settings().goldorTimerType != 0) goldorTicks = 60 - (goldorTicks % 60)
    
    const check = goldorTicks === activeTime || goldorTicks === activeTime + 1

    if (!bonzoResult && check) {
        bonzoResult = true
    }

    text += bonzoResult
        ? " &a✔"
        : ` &cX`

    drawText(
        `${color}${text}`,
        data.BonzoTimer,
        true,
        "BonzoTimer"
    )
}).unregister()


// ---------------- WORLD RESET ----------------
register("worldLoad", () => {
    activeTime = 0
    bonzoResult = false
    running.unregister()
})
