import RenderLibV2J from "../util/render/render"
import Settings from "../config"
import dungeonUtils from "../util/dungeonUtils"
import { bossnames, EntityWither, Tracer } from "../util/utils"

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

    const rgb = [Settings().witherESPColor[0] / 255, Settings().witherESPColor[1] / 255, Settings().witherESPColor[2] / 255]
    const alpha = Settings().witherESPColor[3] / 255
    const height = 3.4
    const width = 1
    if(Settings().espWitherType == 1)RenderLibV2J.drawInnerEspBoxV2(wither.getRenderX(), wither.getRenderY(), wither.getRenderZ(), width, height, width, ...rgb, alpha, Settings().witherThruBlocks)
    RenderLibV2J.drawEspBoxV2(wither.getRenderX(), wither.getRenderY(), wither.getRenderZ(), width, height, width, ...rgb, 1, Settings().witherThruBlocks)
    if(Settings().witherTracer && dungeonUtils.currentPhase == 3 && dungeonUtils.currentStage == 5) Tracer(wither.getRenderX(), wither.getRenderY() + wither.getHeight() / 2, wither.getRenderZ(), Settings().witherESPColor[0], Settings().witherESPColor[1], Settings().witherESPColor[2], 2)
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