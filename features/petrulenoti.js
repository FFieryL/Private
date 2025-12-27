import Settings from "../config"
import { data, drawText, registerOverlay } from "../managers/guimanager";


let currentPet = null;
let overlayEndTime = 0;
registerOverlay("PetRuleNoti", { text: () => "Phoenix &aequipped", align: "center" })

const chatTrig = register("chat", (lvl, pet) => {
    if(!Settings().PetRuleNoti) return;
    overlay.register();
    currentPet = pet;
    overlayEndTime = Date.now() + 1000;
    if(Settings().PetRuleSound) World.playSound("random.orb", 1, 1)
}).setCriteria("Autopet equipped your [${lvl}] ${pet}! VIEW RULE").unregister()

const overlay = register("renderOverlay", () => {
    if (currentPet && Date.now() < overlayEndTime) {
        const displaytext = currentPet + " &aequipped";
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