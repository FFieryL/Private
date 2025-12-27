import Settings from "../config"
import { data, drawText, OverlayEditor, registerOverlay } from "../managers/guimanager";
import { chat } from "../util/utils";

const summonRegex = /&r&aYou summoned your &r&([0-9a-f])(.+?)&r&a!&r/;
const despawnmatch = /&r&aYou despawned your &r&([0-9a-f])(.+?)&r&a!&r/
const autopetRegex = /&cAutopet &eequipped your &7\[Lvl (\d+)\] &(\S+)(.+?)&e! &a&lVIEW RULE&r$/;
const levelUpRegex = /&r&aYour &r&(\S+)(.+?) &r&aleveled up to level &r&9(\d+)&r&a!&r/;
const tabpet = /§r §r§7\[Lvl (\d+)\](?: §r§8\[.*?\])? §r§(\S+)(.+?)§r/
let currentPet = null
registerOverlay("CurrentPetGui", { text: () => "No Pet / Unknown", align: "left", colors: false})


const overlayTrig = register("renderOverlay", () => {
    if(OverlayEditor.isOpen()) return;
    displayText = (currentPet && currentPet.name) ? (currentPet.level != null ? `&7[Lvl ${currentPet.level}] ${currentPet.name}` : currentPet.name) : "No Pet / Unknown";
    drawText(displayText, data.CurrentPetGui, false, "CurrentPetGui")
}).unregister()

const chatTrig = register("chat", (event) => {
    const message = ChatLib.getChatMessage(event, true);

    let match;
    match = message.match(summonRegex)
    if (match) {
        const rarity = match[1];
        const pet = match[2];
        currentPet = {
            name: `&${rarity}${pet}`,
            level: null,
        };
        if(Settings().CancelPetChats) {
            chat(`&7Summoned &${rarity}${pet}`)
            cancel(event)
        }
        return;
    }

    match = message.match(autopetRegex)
    if (match) {
        const level = match[1];
        const rarity = match[2];
        const pet = match[3]
        currentPet = {
            name: `&${rarity}${pet}`,
            level: level,
        };
        if(Settings().CancelPetChats) {
            chat(`&5AutoPet &7[Lvl ${level}] &${rarity}${pet}`)
            cancel(event)
        }
        return;
    }

    match = message.match(levelUpRegex)
    if (match) {
        const rarity = match[1];
        const pet = match[2];
        const level = parseInt(match[3])
        if (currentPet.name == `&${rarity}${pet}`) currentPet.level = level;
        if(Settings().CancelPetChats) {
            chat(`&${rarity}${pet} &5leveled up! &d${level - 1}&5->&d${level}`)
            cancel(event)
        }
        return;
    }

    match = message.match(despawnmatch)
    if (match) {
        const rarity = match[1];
        const pet = match[2];
        currentPet = {
            name: null,
            level: null,
        };
        if(Settings().CancelPetChats) {
            chat(`&7Despawned &${rarity}${pet}`)
            cancel(event)
        }
    }

}).unregister()

const worldLoadTrig = register("worldLoad", () => {
    if(Server.getIP() == "localhost" || !Server.getIP().includes("hypixel")) return;
    setTimeout(() => {
        if(!TabList) return;
        const names = TabList.getNames();
        if (!names) return;
        const petIndex = names.findIndex(line => line.includes("Pet:"));
        if (petIndex !== -1 && petIndex + 1 < names.length) {
            const petLine = names[petIndex + 1]; 
            match = petLine.match(tabpet)
            if(match) {
                const level = match[1];
                const rarity = match[2];
                const pet = match[3]
                currentPet = {
                    name: `&${rarity}${pet}`,
                    level: level,
                }
                return;
            }
        }
    }, 4000);
}).unregister()

if (Settings().CurrentPetGui || Settings().CancelPetChats) {
    chatTrig.register();
    if(Settings().CurrentPetGui) {
        worldLoadTrig.register()
        overlayTrig.register()
        chatTrig.register()
    }
}

Settings().getConfig().registerListener("CurrentPetGui", (prev, curr) => {
    if (curr) {
        worldLoadTrig.register()
        overlayTrig.register()
        chatTrig.register()
    } else {
        worldLoadTrig.unregister()
        overlayTrig.unregister()

        if (!Settings().CancelPetChats) {
            chatTrig.unregister()
        }
    }
})

Settings().getConfig().registerListener("CancelPetChats", (prev, curr) => {
    if (curr || Settings().CurrentPetGui) chatTrig.register();
    else chatTrig.unregister();
})