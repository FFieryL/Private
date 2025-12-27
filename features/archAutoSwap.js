import { chat, isPlayerInBox, MouseEvent, rightClick } from "../util/utils";
import Settings from "../config"
let swapping = false;

const rightevent = register(MouseEvent, (event) => {
    const button = event.button;
    const state = event.buttonstate;

    if (button != 1 || state) return;

    const heldItemName = Player?.getHeldItem()?.getName()?.toLowerCase();
    if (!heldItemName) return;

    if (heldItemName.toLowerCase().includes("death")) {
        Client.scheduleTask(1, () => Swapper(Settings().autoSwapItem))
    }
    else if (heldItemName.toLowerCase().includes("breath") && Settings().lastBreathSwap && (isPlayerInBox(33, 60, 165, 195, 31, 76) || isPlayerInBox(87, 114, 163, 172, 31, 76))) {
        Client.scheduleTask(1, () => Swapper("terminator"))
    }
}).unregister()

function Swapper(item) {

    let idx = Player?.getInventory()?.getItems()?.findIndex(i => i?.getName()?.toLowerCase()?.includes(item))

    if (swapping) return;
    
    if (idx < 0) return;
    if (idx > -1 && idx < 8) {
        swapping = true;
        Player.setHeldItemIndex(idx);
        swapping = false;
    }

}

if (Settings().autoSwap) {
    rightevent.register()
}

Settings().getConfig().registerListener("autoSwap", (prev, curr) => {
    if (curr) rightevent.register()
    else rightevent.unregister()
})



//Will move later idk

import dungeonUtils from "../util/dungeonUtils";

register("chat", (message) => {
    if (!dungeonUtils.inBoss) return;
    const match = message.match(/Your Explosive Shot hit (\d+) enem\w* for ([\d,\.]+) damage\./);
    if (!match) return;

    const enemiesHit = parseInt(match[1]); 
    const totalDamage = parseFloat(match[2].replace(/,/g, ''));
    const damagePerEnemy = totalDamage / enemiesHit;

    const damageInt = Math.round(damagePerEnemy)
    const formattedDamage = damageInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Output to chat
    setTimeout(() => {
        chat(`&aExplosive Shot did &c${formattedDamage} &aper enemy`);
        Client.showTitle("", "&c" + formattedDamage, 0, 40, 0)
        World.playSound("note.pling", 2, 1);
    }, 10);
}).setCriteria("${message}")