import Settings from "../config";
import { getScoreboard, removeUnicode } from "../../BloomCore/utils/Utils";
import { data, drawText, registerOverlay } from "../managers/guimanager";
import dungeonUtils from "../util/dungeonUtils";
import { chat } from "../util/utils";
registerOverlay("DupeClass", { text: () => "DUPE ARCHER DETECTED", align: "center", colors: true})

let displayText = "DUPE CLASS DETECTED"

const chatTrig = register("chat", () => {
    if (!Settings().dupeClass) return;
    let classes = new Set();
    const sb = getScoreboard(false);
    if (!sb) return;
    for (let i = 0; i < sb.length; ++i) {
        let line = removeUnicode(sb[i]);
        let match = line.match(/\[\S\] \w+ .+/);
        if (match) {
            let c = match[0].substring(1, 2);
            if (!classes.has(c)) classes.add(c)
            else {
                if (c == "M" && Settings().ignoreDoubleMage) continue;
                const dupeClass = dungeonUtils.translateClass(c)
                chat(`&cDuplicate ${dupeClass} Detected`);
                if (c) displayText = `DUPE ${dupeClass.toUpperCase()} DETECTED`
                World.playSound("note.pling", 2, 1);
                overlay.register();
                return;
            }
        }
    }
    overlay.unregister();
}).setCriteria(/^Starting in \d second(s)?\./).unregister()

const overlay = register("renderOverlay", () => {
    drawText(displayText, data.DupeClass, true, "DupeClass")
}).unregister();

const chatTrig2 = register("chat", () => {
    chatTrig.unregister()
    overlay.unregister();
    chatTrig2.unregister()
}).setCriteria("[NPC] Mort: Here, I found this map when I first entered the dungeon.").unregister()

const worldTrig = register("worldLoad", () => {
    chatTrig.register()
    chatTrig2.register()
    overlay.unregister();
}).unregister()

if (Settings().dupeClass) {
    chatTrig.register()
    chatTrig2.register()
    worldTrig.register()
}

Settings().getConfig().registerListener("dupeClass", (prev, curr) => {
    if (curr) {
        chatTrig.register()
        chatTrig2.register()
        worldTrig.register()
    } else {
        chatTrig.unregister()
        chatTrig2.unregister()
        worldTrig.unregister()
        overlay.unregister()
    }
})
