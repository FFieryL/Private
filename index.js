import Settings from "./config"
import "./features/petrulenoti"
import "./features/quiznoti"
import "./features/termnoti"
import "./features/witheresp"
import "./features/secrettracker"
import "./features/petdisplay"
import "./features/melodytitle"
import "./features/starmobs"
import "./features/partyfullnoti"
import "./features/archAutoSwap"
import "./features/tickTimers"
import "./features/leverTrigger"
import "./features/dupeClass"
import "./features/bonzoDP"
import "./features/leapNotifier"
import "./features/PAIRC"
import { chat } from "./util/utils"
import { OverlayEditor, activategui } from "./managers/guimanager"


setTimeout(() => {
    chat("&dModule Loaded")
}, 1000);

register("command", () => {
    Settings().getConfig().openGui()
}).setName("privateasf").setAliases(["pa"])

register("command", () => {
    setTimeout(() => {
        OverlayEditor.open()
        activategui()
    }, 25);
}).setName("pagui")