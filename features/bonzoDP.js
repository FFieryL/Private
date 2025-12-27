import Settings from "../config"
import { data, drawText, registerOverlay } from "../managers/guimanager";
import dungeonUtils from "../util/dungeonUtils"
import { chat, S32PacketConfirmTransaction } from "../util/utils";
registerOverlay("BonzoDP", { text: () => "Bonzo Double Proc ✓", align: "center"})

let ticks = 0
const INITIAL_TICK = 1;
const TOLERANCE = 1;

register("chat", () => {
    const loop = global.goldorLoop ?? 0;
    const goldorTicks = global.goldorTicks % 60;
    const expectedTick = (INITIAL_TICK - 2 * loop + 60) % 60;
    const validTicks = [...Array(TOLERANCE + 1).keys()]
    .map(offset => (expectedTick - offset + 60) % 60);

    if (expectedTick === 1 && goldorTicks === 0) {
        validTicks.push(0); // tick 0 counts for the previous loop
    }

    chat("popped at loop " + loop + ", tick " + goldorTicks + " (expected " + expectedTick + ")");
    Client.showTitle("", goldorTicks, 0, 40, 0)
    if (!validTicks.includes(goldorTicks) || dungeonUtils.getPhase() !== 3 || !Settings().bonzoDP) return;
    ticks = 0
    bonzoDP.register()
    tickListener.register()
}).setCriteria(/Your (?:⚚ )?Bonzo's Mask saved your life!/)

const bonzoDP = register("renderOverlay", () => {
    const displayText = "Bonzo Double Proc ✓"
    drawText(displayText, data.BonzoDP, true, "BonzoDP")
})

const tickListener = register("packetReceived", () => {
    ticks++
    if (ticks > 60) {
        ticks = 0
        bonzoDP.unregister()
        tickListener.unregister()
    }
}).setFilteredClass(S32PacketConfirmTransaction).unregister()

register("worldLoad", () => {
    ticks = 0
    bonzoDP.unregister()
    tickListener.unregister()
})