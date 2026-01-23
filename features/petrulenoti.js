import Settings from "../config"
import { data, drawText, registerOverlay } from "../managers/guimanager";


let currentPet = null;
let overlayEndTime = 0;
registerOverlay("PetRuleNoti", { text: () => "Phoenix &aequipped", align: "center" })

const chatTrig = register("chat", (event) => {
    if(!Settings().PetRuleNoti) return;
    const message = ChatLib.getChatMessage(event, true);

    const match = message.match(/&cAutopet &eequipped your &7\[Lvl (\d+)\] &([0-9a-fk-or])(.+?)&e! &a&lVIEW RULE&r$/);
    if (!match) return;

    const colorCodes = match[2]; // e.g. "&d"
    const petName = match[3].replace(/\s*✦/g, ""); // "Black Cat"
    currentPet = petName;
    if (!Settings().customPetRuleColor) currentPet = "&" + colorCodes + petName;
    overlay.register();
    overlayEndTime = Date.now() + 1000;
    if(Settings().PetRuleSound) World.playSound("random.orb", 1, 1)
}).unregister()

const overlay = register("renderOverlay", () => {
    if (currentPet && Date.now() < overlayEndTime) {
        let displaytext = currentPet;
        if (!Settings().PetRuleNotiShort) displaytext += " &aequipped"
        drawText(displaytext, data.PetRuleNoti, true, "PetRuleNoti")
    } 
    else if (currentPet && Date.now() >= overlayEndTime) {
        currentPet = null;
        overlay.unregister();
    }
}).unregister();

if (Settings().PetRuleNoti) {
    chatTrig.register();
}

Settings().getConfig().registerListener("PetRuleNoti", (prev, curr) => {
    if (curr) chatTrig.register();
    else chatTrig.unregister();
})