export const S32PacketConfirmTransaction = Java.type("net.minecraft.network.play.server.S32PacketConfirmTransaction");
export const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook")
export const S03PacketTimeUpdate = Java.type("net.minecraft.network.play.server.S03PacketTimeUpdate");
export const Vec3 = Java.type("net.minecraft.util.Vec3");
export const EntityWither = Java.type("net.minecraft.entity.boss.EntityWither")
export const Render = Java.type("me.odinmain.utils.render.Renderer");
export const ColorUtils = Java.type("me.odinmain.utils.render.Color");
export const javaColor = Java.type("java.awt.Color")
export const bossnames = ["Maxor", "Storm", "Goldor", "Necron", "Wither King"]
export const ChatComponentText = Java.type("net.minecraft.util.ChatComponentText");
export const GuiDisconnected = Java.type("net.minecraft.client.gui.GuiDisconnected");
export const GuiConnecting = Java.type("net.minecraft.client.multiplayer.GuiConnecting");
export const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
export const EntityOtherPlayerMP = Java.type("net.minecraft.client.entity.EntityOtherPlayerMP")
export const S0FPacketSpawnMob = Java.type("net.minecraft.network.play.server.S0FPacketSpawnMob")
export const S1CPacketEntityMetadata = Java.type("net.minecraft.network.play.server.S1CPacketEntityMetadata")
export const JavaString = Java.type("java.lang.String")
export const MouseEvent = Java.type("net.minecraftforge.client.event.MouseEvent");
export const RenderUtils = Java.type("me.odinmain.utils.render.RenderUtils");
export const AxisAlignedBB = Java.type("net.minecraft.util.AxisAlignedBB");
export const EntityBat = Java.type("net.minecraft.entity.passive.EntityBat")
export const S2DPacketOpenWindow = Java.type("net.minecraft.network.play.server.S2DPacketOpenWindow")
export const S2FPacketSetSlot = Java.type("net.minecraft.network.play.server.S2FPacketSetSlot")
export const S30PacketWindowItems = Java.type("net.minecraft.network.play.server.S30PacketWindowItems");
export const S2EPacketCloseWindow = Java.type("net.minecraft.network.play.server.S2EPacketCloseWindow");


export function shouldHighlight(highlighttype, entity, width = 1, height = 2) {
    if (!entity) return false;
    if (highlighttype != 1) return true
    let eyePos = Player.getPlayer().func_174824_e(0);
    let vecs = []
    for (let i = 0; i <= width; i += width) {
        for (let j = 0; j <= height; j += height) {
            for (let k = 0; k <= width; k += width) {
                vecs.push(new Vec3(entity.getRenderX() - width / 2 + i, entity.getRenderY() + j, entity.getRenderZ() - width / 2 + k))
            }
        }
    }

    for (let v of vecs) {
        if (World.getWorld().func_147447_a(eyePos, v, false, false, false) == null) return true
    }
    return false
}

export function getColorOdin(configColor) {
    let r = configColor[0]
    let g = configColor[1]
    let b = configColor[2]
    let a = configColor[3]
    return new ColorUtils(javaColor.RGBtoHSB(r, g, b, null), 255 * a)
}

export function Tracer(x, y, z, r, g, b, lineWidth = 3.0, depth = false) {
    const color = new ColorUtils(javaColor.RGBtoHSB(r, g, b, null), 255 * 255);
    const vec3 = new Vec3(x, y, z);
    Render.INSTANCE.drawTracer(vec3, color, lineWidth, depth);
}

export function chat(msg) {
    ChatLib.chat(`&l&0PrivateASF&7 >> &r${msg}`)
}

export const getEntityID = (entity) => {
    if (!entity) return null
    if (entity instanceof Entity) return entity.getEntity().func_145782_y()
    return entity.func_145782_y()
}

export function isPlayerInBox(x1, x2, y1, y2, z1, z2) {
    const x = Player.getX();
    const y = Player.getY();
    const z = Player.getZ();

    return (x >= Math.min(x1, x2) && x <= Math.max(x1, x2) &&
        y >= Math.min(y1, y2) && y <= Math.max(y1, y2) &&
        z >= Math.min(z1, z2) && z <= Math.max(z1, z2));
};

export function getColorCodes(colorName) {
    const colorMap = {
        black: "&0",
        dark_blue: "&1",
        dark_green: "&2",
        dark_aqua: "&3",
        dark_red: "&4",
        dark_purple: "&5",
        gold: "&6",
        gray: "&7",
        dark_gray: "&8",
        blue: "&9",
        green: "&a",
        aqua: "&b",
        red: "&c",
        light_purple: "&d",
        yellow: "&e",
        white: "&f"
    };

    let key = colorName.toLowerCase().replace(/\s+/g, "_");
    
    const aliases = {
        purple: "dark_purple",
        magenta: "light_purple",
        pink: "light_purple",
        lime: "green",
        teal: "aqua",
        orange: "gold",
        grey: "gray"
    };

    if (aliases[key]) key = aliases[key];

    return colorMap[key] || null;
}

export function rightClick() {
    const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag", null)
    rightClickMethod.setAccessible(true);
    rightClickMethod.invoke(Client.getMinecraft(), null);
}