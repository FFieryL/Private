import dungeonUtils from "../util/dungeonUtils";
import Settings from "../config"
import RenderLibV2J from "../util/render/render";
import StarMob from "../util/starMobUtils";
import { EntityArmorStand, EntityOtherPlayerMP, EntityWither } from "../util/utils";

const starMobRegex = /§6✯ (?:§.)*(.+)§r.+§c❤$|^(Shadow Assassin)$/
let starMobs = new Set()
let trackedStands = new Set()
let shadowAssassins = []

function validEntity(entity) {
    if (!entity) return false
    else if ((entity instanceof EntityArmorStand) || (entity instanceof EntityWither) || entity == Player.getPlayer()) return false;
    else return true;
}

const tickScanner = register("tick", () => {
    if (!(dungeonUtils.inDungeon()) || dungeonUtils.inBoss) {
        trackedStands.clear()
        starMobs.clear()
        shadowAssassins = []
        return;
    }
    trackedStands.clear()
    starMobs.clear()
    let SAsFound = []
    let armorStands = World.getAllEntitiesOfType(EntityArmorStand)
    let entities = World.getAllEntitiesOfType(EntityOtherPlayerMP)

    for (let i = 0; i < armorStands.length; i++) {
        let armorStand = armorStands[i]
        if (armorStand.getName().includes("✯")) {
            let nearbyMobs = World.getWorld().func_72839_b(armorStand.entity, armorStand.entity.func_174813_aQ().func_72317_d(0.0, -1.0, 0.0))
            for (let mob of nearbyMobs) {
                if (validEntity(mob)) {
                    let match = armorStand.getName().match(starMobRegex)
                    if (!match) continue;

                    let starMob = new StarMob(armorStand)
                    let [_, mobName, sa] = match

                    let height = 2
                    if (!sa) {
                        if (mobName.includes("Fels")) {
                            height = 3;
                        }
                        if (mobName.includes("Withermancer")) height = 2.5
                    }
                    else {
                        height = 1.8
                    }
                    starMob.height = height

                    trackedStands.add(armorStand)
                    starMobs.add(starMob)

                }
            }
        }
    }
    for (let i = 0; i < entities.length; ++i) {
        let entity = entities[i]
        if (!entity.entity.func_82169_q(0)) continue
        if (!entity.entity.func_70694_bm()) continue
        let boots = new Item(entity.entity.func_82169_q(0))
        let bootsNbt = boots?.getNBT()?.toString()
        let heldItem = entity.entity.func_70694_bm().func_82833_r()
        if (heldItem.includes("Silent Death") && bootsNbt.includes("color:6029470")) {
            SAsFound.push(entity)
        }
    }
    shadowAssassins = SAsFound;

    if (trackedStands.size || shadowAssassins.length) mobRenderer.register()
    else mobRenderer.unregister()
}).unregister()

const mobRenderer = register("renderWorld", () => {
    const normalColor = Settings().starMobESPColor.map(v => v / 255);
    const SAColor = Settings().starMobESPColorSA.map(v => v / 255);
    const felColor = Settings().starMobESPColorFel.map(v => v / 255);
    const highlighttype = Settings().starHighlightType == 1
    const w = Settings().starHighlightSize;
    for (let mob of starMobs) {
        let x = mob.entity.getRenderX()
        let y = mob.entity.getRenderY() - mob.height
        let z = mob.entity.getRenderZ()
        let h = mob.height
        let color = normalColor;
        if (mob.mobType === "fel") color = felColor;
        RenderLibV2J.drawEspBoxV2(x, y, z, w, h, w, ...color, Settings().starMobESPThruBlocks);
        if (highlighttype) RenderLibV2J.drawInnerEspBoxV2(x, y, z, w, h, w, color[0], color[1], color[2], color[3] / 5, Settings().starMobESPThruBlocks);
    }

    for (let i = 0; i < shadowAssassins.length; i++) {
        let sa = shadowAssassins[i]
        let [x, y, z] = [sa.getRenderX(), sa.getRenderY(), sa.getRenderZ()]
        let h = 1.8
        RenderLibV2J.drawEspBoxV2(x, y, z, w, h, w, ...SAColor, Settings().starMobESPThruBlocks);
        if (highlighttype) RenderLibV2J.drawInnerEspBoxV2(x, y, z, w, h, w, SAColor[0], SAColor[1], SAColor[2], SAColor[3] / 5, Settings().starMobESPThruBlocks);
    }
}).unregister()

register("worldUnload", () => {
    starMobs.clear()
    trackedStands.clear()
    shadowAssassins = []
})

if (Settings().starMobESP) {
    tickScanner.register()
}

Settings().getConfig().registerListener("starMobESP", (prev, curr) => {
    if (curr) {
        tickScanner.register()
    } else {
        tickScanner.unregister()
        starMobs.clear()
        trackedStands.clear()
        shadowAssassins = []
        mobRenderer.unregister()
    }
})