import dungeonUtils from "../util/dungeonUtils";
import Settings from "../config"
import StarMob from "../util/starMobUtils";
import { AxisAlignedBB, EntityArmorStand, EntityBat, EntityOtherPlayerMP, EntityWither, getColorOdin, RenderUtils, shouldHighlight } from "../util/utils";

const starMobRegex = /§6✯ (?:§.)*(.+)§r.+§c❤$|^(Shadow Assassin)$/
let starMobs = new Set()
let trackedStands = new Set()
let shadowAssassins = []
let secretBats = []
let pests = []

let validStarMobs = false
let validBats = false
let validSAs = false
let validPests = false

function validEntity(entity) {
    if (!entity) return false
    else if ((entity instanceof EntityArmorStand) || (entity instanceof EntityWither) || entity == Player.getPlayer()) return false;
    else return true;
}

function inGarden() {
    let index = TabList?.getNames()?.findIndex(line => line?.removeFormatting()?.toLowerCase()?.includes("area: garden"))
    if (index > -1) return true;
    return false;
}

const tickScanner = register("tick", () => {
    if (!(dungeonUtils.inDungeon()) || dungeonUtils.inBoss) {
        trackedStands.clear()
        starMobs.clear()
        shadowAssassins = []
        secretBats = []
        return;
    }
    trackedStands.clear()
    starMobs.clear()
    shadowAssassins = []
    secretBats = []
    let SAsFound = []
    let armorStands = World.getAllEntitiesOfType(EntityArmorStand)
    let entities = World.getAllEntitiesOfType(EntityOtherPlayerMP)

    if (Settings().starMobESP) {
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
        if (trackedStands.size) validStarMobs = true
        else validStarMobs = false

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
        if (shadowAssassins.length) validSAs = true
        else validSAs = false
    }

    if (Settings().batESP) {
        let bats = World.getAllEntitiesOfType(EntityBat)
        let batsFound = []
        let hp = [100.0, 200.0, 220.0, 400.0, 800.0]
        for (let i = 0; i < bats.length; ++i) {
            let bat = bats[i]
            if (hp.includes(bat.entity.func_110138_aP())) batsFound.push(bat)
        }
        secretBats = batsFound
        if (secretBats.length) validBats = true
        else validBats = false
    }

    if (trackedStands.size || shadowAssassins.length || secretBats.length) mobRenderer.register()
    else mobRenderer.unregister()
}).unregister()


register("chat", () => {
    if (Settings().pestESP) gardenTickChecker.register();
}).setCriteria(/.+! \d ൠ Pest have spawned in Plot - .+!/)

const gardenTickChecker = register("tick", () => {

    if (!Settings().pestESP || !inGarden()) return;

    // Pests
    if (Settings().pestESP) {
        let pestsFound = []
        let armorStands = World.getAllEntitiesOfType(EntityArmorStand)
        for (let i = 0; i < armorStands.length; ++i) {
            let armorStand = armorStands[i]
            let helmet = armorStand.entity.func_82169_q(3)
            if (!helmet) continue
            let helmetName = ChatLib.removeFormatting(new Item(helmet).getName());
            if (helmetName == "Head") {
                pestsFound.push(armorStand)
            }
        }

        pests = pestsFound

        if (pests.length) {
            pestEsp = true
        } else {
            pestEsp = false
        }
    }

    if (pestEsp) {
        mobRenderer.register()
    } else {
        mobRenderer.unregister()
    }

}).unregister();

const mobRenderer = register("renderWorld", () => {
    const phase = Settings().starMobESPThruBlocks == 0
    const w = Settings().starHighlightSize;
    const highlighttype = Settings().starHighlightType == 1
    if (validStarMobs) {
        const normalColor = getColorOdin(Settings().starMobESPColor);
        const felColor = getColorOdin(Settings().starMobESPColorFel);

        for (let mob of starMobs) {
            if (!mob.entity) continue;
            let x = mob.entity.getRenderX()
            let y = mob.entity.getRenderY() - mob.height
            let z = mob.entity.getRenderZ()
            let h = mob.height

            let color = normalColor;
            if (mob.mobType === "fel") color = felColor;

            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)

            if (shouldHighlight(Settings().starMobESPThruBlocks, mob.entity, w, h)) {
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, color, 2, phase, true)
                if (highlighttype) RenderUtils.INSTANCE.drawFilledAABB(newBox, color, phase)
            }
        }
    }

    if (validSAs) {
        const SAColor = getColorOdin(Settings().starMobESPColorSA)
        for (let i = 0; i < shadowAssassins.length; i++) {
            let sa = shadowAssassins[i]
            let [x, y, z] = [sa.getRenderX(), sa.getRenderY(), sa.getRenderZ()]
            let h = 1.8

            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)

            if (shouldHighlight(Settings().starMobESPThruBlocks, sa, w, h)) {
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, SAColor, 2, phase, true)
                if (highlighttype) RenderUtils.INSTANCE.drawFilledAABB(newBox, SAColor, phase)
            }
        }
    }

    if (validBats) {
        let color = getColorOdin(Settings().batESPColor)
        let w = 0.6
        let h = 0.9
        
        for (let i = 0; i < secretBats.length; ++i) {
            let bat = secretBats[i]
            let [x, y, z] = [bat.getRenderX(), bat.getRenderY(), bat.getRenderZ()]
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(Settings().batESPThruBlocks, bat, w, h)) {
                if (Settings().batHighlightType) RenderUtils.INSTANCE.drawFilledAABB(newBox, color, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, color, 2, phase, true)
            }
        }
    }

    if (validPests) {
        const pestOutlineWidth = 1
        const pestTracerWidth = 1

        let outlineColor = makeColor([244, 0, 25, 96])
        let fillColor = makeColor([244, 0, 25, 96])
        let tracerColor = makeColor([244, 0, 25, 96])

        const playerY = Player.getRenderY() + (Player.isSneaking() ? 1.54 : 1.62)
    
        for (let i = 0; i < pests.length; ++i) {
            let pest = pests[i]
            let [x, y, z] = [pest.getRenderX(), pest.getRenderY() + 1.2, pest.getRenderZ()]
            let w = 0.8
            let h = 0.8
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(pest, 1, 1)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, pestOutlineWidth, phase, true)
            }

            if (config.pestTracer && config.mode == 2) {
                let vec1 = new Vec3(Player.getRenderX(), playerY, Player.getRenderZ())
                let vec2 = new Vec3(x, y, z)
                let points = new ArrayList()
                points.add(vec1)
                points.add(vec2)
                RenderUtils.INSTANCE.drawLines(points, tracerColor, pestTracerWidth, true)
            }
        }
    }
}).unregister()

register("worldUnload", () => {
    starMobs.clear()
    trackedStands.clear()
    shadowAssassins = []
    secretBats = []
    pestsFound = []
    validStarMobs = false
    validBats = false
    validSAs = false
    validPests = false
    gardenTickChecker.unregister()
})

if (Settings().starMobESP) tickScanner.register()

if (Settings().batESP) tickScanner.register()

Settings().getConfig().registerListener("starMobESP", (prev, curr) => {
    if (curr) {
        tickScanner.register()
    } else {
        if (!Settings().batESP) {
            tickScanner.unregister()
            mobRenderer.unregister()
        }
        starMobs.clear()
        trackedStands.clear()
        shadowAssassins = []
        validSAs = false
        validStarMobs = false
    }
})

Settings().getConfig().registerListener("batESP", (prev, curr) => {
    if (curr) {
        tickScanner.register()
    } else {
        if (!Settings().starMobESP) {
            tickScanner.unregister()
            mobRenderer.unregister()
        }
        secretBats = []
        validBats = false
    }
})

