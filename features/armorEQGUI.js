import { data, OverlayEditor, registerOverlay } from "../managers/guimanager";
import { S2DPacketOpenWindow, S2EPacketCloseWindow, S2FPacketSetSlot, S30PacketWindowItems } from "../util/utils";
import Settings from "../config";
import { SkyBlockUtils } from "../util/skyblockUtils";
registerOverlay("InvGUI", { text: () => "            ", align: true, colors: false, h: 16 * 4 + 2.5 * 2 })

const ITEM_BASE_SIZE = 16;
let ITEM_RENDER_SIZE = ITEM_BASE_SIZE * 1;

let ITEM_BOX_BORDER_COLOR, bgCol, bordCol;

updateColors()

const ITEM_BOX_THICKNESS = 1; 
const pad = 2.5;

function rgbaToInt(r, g, b, a = 255) {return (a << 24) | (r << 16) | (g << 8) | b;}


let scale = 1;
let slot, bgW, bgH;
let equipmentWindowID = -1;

function recalcSizes() {
    scale = data.InvGUI.scale || 1;
    ITEM_RENDER_SIZE = ITEM_BASE_SIZE * scale;
    slot = 16 * scale;
    bgW = (slot * 2) + (pad * 3);
    bgH = (4 * slot) + (pad * 2);
}

function updateColors() {
    ITEM_BOX_BORDER_COLOR = rgbaToInt(...Settings().itemBorder)
    bgCol = rgbaToInt(...Settings().invBgColor)
    bordCol = rgbaToInt(...Settings().invBorderColor)
}

Settings().getConfig().registerListener("invBgColor", () => {
    updateColors();
});

Settings().getConfig().registerListener("itemBorder", () => {
    updateColors();
})

Settings().getConfig().registerListener("invBorderColor", () => {
    updateColors();
});

recalcSizes();

function drawtheitem(item, drawX, drawY, itemScale, renderSize) {
    if (!item) return;

    Renderer.drawRect(ITEM_BOX_BORDER_COLOR, drawX, drawY, renderSize, ITEM_BOX_THICKNESS);
    Renderer.drawRect(ITEM_BOX_BORDER_COLOR, drawX, drawY + renderSize - ITEM_BOX_THICKNESS, renderSize, ITEM_BOX_THICKNESS);
    Renderer.drawRect(ITEM_BOX_BORDER_COLOR, drawX, drawY, ITEM_BOX_THICKNESS, renderSize);
    Renderer.drawRect(ITEM_BOX_BORDER_COLOR, drawX + renderSize - ITEM_BOX_THICKNESS, drawY, ITEM_BOX_THICKNESS, renderSize);

    item.draw(drawX, drawY, itemScale);
}

const PAINV = register("renderOverlay", () => {
    const inv = Player.getInventory();
    if (!inv) return;
    
    if (scale !== data.InvGUI.scale) recalcSizes();
    
    const x = data.InvGUI.x;
    const y = data.InvGUI.y;
    const items = inv.getItems();
    if (!items || items.length < 40) return;

    const inSB = SkyBlockUtils.inSkyBlock();
    // If not in SB, width is only 1 slot + padding. If in SB, it's the full bgW.
    const currentBgW = inSB ? bgW : (slot + (pad * 2));
    const thick = 1;

    // --- Background and Outer Border (Using dynamic width) ---
    Renderer.drawRect(bgCol, x, y, currentBgW, bgH);
    Renderer.drawRect(bordCol, x, y, currentBgW, thick);
    Renderer.drawRect(bordCol, x, y + bgH - thick, currentBgW, thick);
    Renderer.drawRect(bordCol, x, y, thick, bgH);
    Renderer.drawRect(bordCol, x + currentBgW - thick, y, thick, bgH);

    // --- Render Armor (Column 1 - Always) ---
    const armorX = x + pad;
    const armor = [items[39], items[38], items[37], items[36]];
    armor.forEach((item, i) => {
        const sy = y + pad + (i * slot);
        if (item) drawtheitem(item, armorX, sy, scale, ITEM_RENDER_SIZE);
    });

    // --- Render Equipment (Column 2 - SkyBlock only) ---
    if (!inSB) return;

    const equipX = x + slot + (pad * 2);
    const equipItems = [savedEquipment.necklace, savedEquipment.cloak, savedEquipment.belt, savedEquipment.gloves];
    equipItems.forEach((item, i) => {
        const sy = y + pad + (i * slot);
        if (item && item.getRegistryName() != "minecraft:stained_glass_pane") {
            drawtheitem(item, equipX, sy, scale, ITEM_RENDER_SIZE);
        }
    });
}).unregister()


let savedEquipment = {
    necklace: null,
    cloak: null,
    belt: null,
    gloves: null
};

const EQstuff1 = register("packetReceived", () => {
    if (equipmentWindowID == -1) return;
    equipmentWindowID = -1
    EQstuff3.unregister()
    EQstuff4.unregister()
}).setFilteredClass(S2EPacketCloseWindow).unregister()

const EQstuff2 = register("packetReceived", (packet) => {
    const title = packet.func_179840_c().func_150254_d().removeFormatting();
    
    if (title != "Your Equipment and Stats") return equipmentWindowID = -1;
    equipmentWindowID = packet.func_148901_c()
    EQstuff3.register()
    EQstuff4.register()
}).setFilteredClass(S2DPacketOpenWindow).unregister()

const EQstuff3 = register("packetReceived", (packet) => {
    if (equipmentWindowID === -1 || packet.func_148911_c() !== equipmentWindowID) return;

    const itemStacks = packet.func_148910_d();
    if (!itemStacks || itemStacks.length < 38) return;

    const getSafeItem = (mcStack) => (mcStack && mcStack.func_77973_b()) ? new Item(mcStack) : null;

    savedEquipment.necklace = getSafeItem(itemStacks[10]);
    savedEquipment.cloak    = getSafeItem(itemStacks[19]);
    savedEquipment.belt     = getSafeItem(itemStacks[28]);
    savedEquipment.gloves   = getSafeItem(itemStacks[37]);
    
}).setFilteredClass(S30PacketWindowItems).unregister()

const EQstuff4 = register("packetReceived", (packet) => {
    if (equipmentWindowID === -1 || packet.func_149175_c() !== equipmentWindowID) return;

    const slot = packet.func_149173_d();
    const itemStack = packet.func_149174_e();
    const item = (itemStack && itemStack.func_77973_b()) ? new Item(itemStack) : null;

    switch (slot) {
        case 10:
            savedEquipment.necklace = item;
            break;
        case 19:
            savedEquipment.cloak    = item;
            break;
        case 28:
            savedEquipment.belt     = item;
            break;
        case 37:
            savedEquipment.gloves   = item;
            break;
        default:
            break;
    }
}).setFilteredClass(S2FPacketSetSlot).unregister()

if (Settings().invGUI) {
    PAINV.register()
    EQstuff1.register()
    EQstuff2.register()
}

Settings().getConfig().registerListener("invGUI", (prev, curr) => {
    if (curr) {
        PAINV.register()
        EQstuff1.register()
        EQstuff2.register()
    } else {
        PAINV.unregister()
        EQstuff1.unregister()
        EQstuff2.unregister()
        EQstuff3.unregister()
        EQstuff4.unregister()
    }
})
