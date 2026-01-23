import Settings from "../config"
import dungeonUtils from "../util/dungeonUtils"
import { AxisAlignedBB, bossnames, EntityWither, getColorOdin, RenderUtils, shouldHighlight, Tracer } from "../util/utils"

const worldTrig = register("worldUnload", () => {
    renderTrig.unregister()
}).unregister()

const chatTrig = register("chat", (name, event) => {
    name = name.removeFormatting();
    if (name === "Wither King") {
        renderTrig.unregister()
        return;
    }
    if (bossnames.some(boss => boss.includes(name))) renderTrig.register()
}).setCriteria("[BOSS] ${name}: ${*}").unregister()


const renderTrig = register("renderWorld", () => {
    const wither = World.getAllEntitiesOfType(EntityWither).find(entity => !entity.isInvisible() && entity.entity.func_82212_n() != 800)
    if (!wither) return
    let [x, y, z] = [wither.getRenderX(), wither.getRenderY(), wither.getRenderZ()]
    const colorBox = getColorOdin(Settings().witherESPColorBox)
    const colorFill = getColorOdin(Settings().witherESPColorFill)
    const h = 3.4
    const w = 1
    const phase = Settings().witherThruBlocks == 0
    let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
    if (shouldHighlight(Settings().witherThruBlocks, wither, w, h)) {
        if(Settings().espWitherType == 1) RenderUtils.INSTANCE.drawFilledAABB(newBox, colorFill, phase)
        RenderUtils.INSTANCE.drawOutlinedAABB(newBox, colorBox, 2, phase, true)
    }
    if(Settings().witherTracer && dungeonUtils.currentPhase == 3 && dungeonUtils.currentStage == 5) Tracer(x, y + wither.getHeight() / 2, z, Settings().witherESPColorBox[0], Settings().witherESPColorBox[1], Settings().witherESPColorBox[2], 2)
}).unregister()

if (Settings().espWither) {
    if((dungeonUtils.currentPhase > 0 && dungeonUtils.currentPhase < 5)) renderTrig.register()
    chatTrig.register()
}

Settings().getConfig().registerListener("espWither", (prev, curr) => {
    if (curr) {
        if((dungeonUtils.currentPhase > 0 && dungeonUtils.currentPhase < 5)) renderTrig.register()
        chatTrig.register()
        worldTrig.register()
    }
    else {
        renderTrig.unregister()
        chatTrig.unregister()
        worldTrig.unregister()
    }
})
