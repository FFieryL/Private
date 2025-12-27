import PogObject from "../../PogData"
import { chat } from "../util/utils"
export const data = new PogObject("PrivateASF", {}, "data/guidata.json")

const overlayDefs = {}
let resettime = 0
/**
 * Call this from any module to register a new overlay.
 * @param {string} name - Unique ID for the overlay
 * @param {{ text: () => string, align: "left" | "center" }} def - Overlay definition
 */
export function registerOverlay(name, def) {
    overlayDefs[name] = {
        ...def, 
        colors: def.colors !== false
    }

    if (!data[name]) {  
        data[name] = {
            x: Renderer.screen.getWidth() / 2,
            y: Renderer.screen.getHeight() / 2 - 10,
            scale: 1,
            color: def.colors === false ? "&f" : "&d"
        }
        data.save()
    }
    else {
        if (def.colors === false && data[name].color !== "&f") {
            data[name].color = "&f";
            data.save();
        }   
    }
}


for (let key in overlayDefs) {
    if (!data[key]) {
        const def = overlayDefs[key];
        data[key] = {
            x: Renderer.screen.getWidth() / 2,
            y: Renderer.screen.getHeight() / 2 - 10,
            scale: 1,
            color: def.colors === false ? "&f" : "&d"
        };
    }
}

for (let key in data) {
    if (data[key] && !data[key].color) {
        const def = overlayDefs[key];
        data[key].color = def && def.colors === false ? "&f" : "&d";
    }
}
data.save()


export const OverlayEditor = new Gui()
export function activategui() {
    setTimeout(() => {
        overlay.register()
        guistuff1.register()
        guistuff2.register()
        guistuff2V2.register()
        guistuff3.register()
        guistuff4.register()
        resettime = 0
    }, 150);
}
let activeOverlay = null



const overlay = register("renderOverlay", () => {
    if (OverlayEditor.isOpen()) {
        for (let key in overlayDefs) {
            drawText(overlayDefs[key].text(), data[key], overlayDefs[key].align === "center", key);
        }

        if (activeOverlay) {
            drawBoxAround(overlayDefs[activeOverlay].text(), data[activeOverlay],
                        overlayDefs[activeOverlay].align === "center");
            new Text("&7[" + data[activeOverlay].color + activeOverlay + "&7]", data[activeOverlay].x, data[activeOverlay].y - (8 * data[activeOverlay].scale))
                .setScale(data[activeOverlay].scale * 0.8)
                .setAlign(overlayDefs[activeOverlay].align === "center" ? "center" : "left")
                .setShadow(true)
                .draw();
        }
    } else {
        guistuff1.unregister()
        guistuff2.unregister()
        guistuff2V2.unregister()
        guistuff3.unregister()
        guistuff4.unregister()
        activeOverlay = null
        resettime = 0
        isDragging = false
        overlay.unregister()
    }
}).unregister()

let dragOffset = { x: 0, y: 0 };
let isDragging = false;

const guistuff1 = register("guiMouseClick", (x, y, bn) => {
    if (!OverlayEditor.isOpen()) return;
    
    if (bn === 0) { 
        activeOverlay = null;
        for (let key in overlayDefs) {
            if (isMouseOver(x, y, overlayDefs[key].text(), data[key])) {
                activeOverlay = key;
                isDragging = true;
                
                dragOffset.x = x - data[key].x;
                dragOffset.y = y - data[key].y;
                break;
            }
        }
    } 
    else if (bn === 1 && activeOverlay){
        resettime = 0
        data[activeOverlay].x = Renderer.screen.getWidth() / 2;
        data.save();
    }
    else if (bn === 2) {
        if(resettime < 2) {
            resettime++
            return chat("are you sure you want to reset? middle click again to reset")
        }
        for (let key in data) {
            if (!data[key].x) continue;
            data[key].x = Renderer.screen.getWidth() / 2;
            data[key].y = Renderer.screen.getHeight() / 2 - 10;
            data[key].scale = 1;
        }
        data.save();
    }
}).unregister();

const guistuff2 = register("dragged", (dx, dy, x, y, bn) => {
    if (OverlayEditor.isOpen() && activeOverlay && isDragging) {
        data[activeOverlay].x = x - dragOffset.x;
        data[activeOverlay].y = y - dragOffset.y;
    }
}).unregister();

const guistuff2V2 = register("guiMouseRelease", () => {
    if (isDragging) {
        data.save();
    }
    isDragging = false;
}).unregister();


const guistuff3 = register("scrolled", (x, y, dir) => {
    if (!OverlayEditor.isOpen()) return;


    activeOverlay = null;
    for (let key in overlayDefs) {
        if (isMouseOver(x, y, overlayDefs[key].text(), data[key])) {
            activeOverlay = key;
            break;
        }
    }

    if (activeOverlay) {
        data[activeOverlay].scale += dir === 1 ? 0.05 : -0.05;
        data.save();
    }
}).unregister()

const guistuff4 = register("guiKey", (char, keyCode, gui, event) => {
    if (!OverlayEditor.isOpen()) return;

    if(activeOverlay && keyCode == Keyboard.KEY_R) {
        const def = overlayDefs[activeOverlay];
        if(!def.colors) return;

        const colors = ["&f", "&a", "&b", "&c", "&d", "&e", "&6", "&9", "&5", "&7"];
        let i = colors.indexOf(data[activeOverlay].color);
        i = (i + 1) % colors.length;
        data[activeOverlay].color = colors[i];
        data.save();
    }
}).unregister();

/**
 * Call this to set it up as the default text (less repetitive)
 * @param {string} text - text to display
 * @param {data} info - gui data
 * @param {boolean} center - should center or not
 */
export function drawText(text, info, center = true, overlayName = null) {
    const def = typeof overlayName === "string" ? overlayDefs[overlayName] : overlayName;
    const prefix = def && def.colors === false ? "" : info.color;
    new Text(prefix + text, info.x, info.y)
        .setShadow(true)
        .setScale(info.scale)
        .setAlign(center ? "center" : "left")
        .draw()
}

function isMouseOver(mx, my, text, info, center = true) { 
    const w = Renderer.getStringWidth(ChatLib.removeFormatting(text)) * info.scale 
    const h = 9 * info.scale // typical text height 
    const x = center ? info.x - w / 2 : info.x 
    const y = info.y 
    return mx >= x && mx <= x + w && my >= y && my <= y + h 
} 
    
function drawBoxAround(text, info, center = true) { 
    const w = Renderer.getStringWidth(ChatLib.removeFormatting(text)) * info.scale 
    const h = 9 * info.scale 
    const x = center ? info.x - w / 2 : info.x 
    const y = info.y 
    Renderer.drawRect(Renderer.color(255, 0, 255, 100), x - 2, y - 2, w + 4, h + 4) 
}

