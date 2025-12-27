/**
 * Utility rendering functions with JSDoc typedefs
 * Provides type hints for IDE autocompletion
 */
class RenderLibV2J {
    /**
     * Draws the frame of a box.
     * @param {number} x - X coordinate of the box center.
     * @param {number} y - Y coordinate of the box base (bottom).
     * @param {number} z - Z coordinate of the box center.
     * @param {number} w - Width of the box along X.
     * @param {number} h - Height of the box along Y.
     * @param {number} red - Red color component (0–1).
     * @param {number} green - Green color component (0–1).
     * @param {number} blue - Blue color component (0–1).
     * @param {number} alpha - Transparency (0–1).
     * @param {boolean} phase - If true, depth test disabled (renders through walls).
     * @returns {void}
     */
    static drawEspBox(x, y, z, w, h, red, green, blue, alpha, phase) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws the filled sides of a box.
     * @param {number} x - X coordinate of the box center.
     * @param {number} y - Y coordinate of the box base.
     * @param {number} z - Z coordinate of the box center.
     * @param {number} w - Width along X.
     * @param {number} h - Height along Y.
     * @param {number} red - Red color component (0–1).
     * @param {number} green - Green color component (0–1).
     * @param {number} blue - Blue color component (0–1).
     * @param {number} alpha - Transparency (0–1).
     * @param {boolean} phase - If true, depth test disabled (renders through walls).
     * @returns {void}
     */
    static drawInnerEspBox(x, y, z, w, h, red, green, blue, alpha, phase) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws a pulsating Baritone-style ESP box.
     * @param {number} x - X coordinate of the box center.
     * @param {number} y - Y coordinate of the box base.
     * @param {number} z - Z coordinate of the box center.
     * @param {number} w - Width along X.
     * @param {number} h - Height along Y.
     * @param {number} red - Red color component (0–1).
     * @param {number} green - Green color component (0–1).
     * @param {number} blue - Blue color component (0–1).
     * @param {number} alpha - Transparency (0–1).
     * @param {boolean} phase - If true, depth test disabled (renders through walls).
     * @returns {void}
     */
    static drawBaritoneEspBox(x, y, z, w, h, red, green, blue, alpha, phase) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws a sphere.
     * More Info: http://legacy.lwjgl.org/javadoc/org/lwjgl/util/glu/Sphere.html
     * @param {number} x - X coordinate of the sphere.
     * @param {number} y - Y coordinate of the sphere.
     * @param {number} z - Z coordinate of the sphere.
     * @param {number} radius - Radius of the sphere.
     * @param {number} slices - Number of vertical slices (like longitude lines).
     * @param {number} stacks - Number of horizontal stacks (like latitude lines).
     * @param {number} rot1 - Rotation around the X axis.
     * @param {number} rot2 - Rotation around the Y axis.
     * @param {number} rot3 - Rotation around the Z axis.
     * @param {number} r - Red component (0–1).
     * @param {number} g - Green component (0–1).
     * @param {number} b - Blue component (0–1).
     * @param {number} a - Transparency (0–1).
     * @param {boolean} phase - If true, depth test disabled (renders through walls).
     * @param {boolean} linemode - If true, draws wireframe; if false, filled sphere.
     * @returns {void}
     */
    static drawSphere(x, y, z, radius, slices, stacks, rot1, rot2, rot3, r, g, b, a, phase, linemode) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws a 3D cylinder.
     * More Info: http://legacy.lwjgl.org/javadoc/org/lwjgl/util/glu/Cylinder.html
     * @param {number} x - X coordinate of the cylinder center.
     * @param {number} y - Y coordinate of the base.
     * @param {number} z - Z coordinate of the cylinder center.
     * @param {number} baseRadius - Radius of the bottom circle.
     * @param {number} topRadius - Radius of the top circle.
     * @param {number} height - Height of the cylinder.
     * @param {number} slices - Number of vertical slices.
     * @param {number} stacks - Number of horizontal stacks.
     * @param {number} rot1 - Rotation around the X axis.
     * @param {number} rot2 - Rotation around the Y axis.
     * @param {number} rot3 - Rotation around the Z axis.
     * @param {number} r - Red component (0–1).
     * @param {number} g - Green component (0–1).
     * @param {number} b - Blue component (0–1).
     * @param {number} a - Transparency (0–1).
     * @param {boolean} phase - If true, renders through walls.
     * @param {boolean} linemode - True: wireframe cylinder, false: filled.
     * @returns {void}
     */
    static drawCyl(x, y, z, baseRadius, topRadius, height, slices, stacks, rot1, rot2, rot3, r, g, b, a, phase, linemode) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws a flat disk.
     * More Info: http://legacy.lwjgl.org/javadoc/org/lwjgl/util/glu/Disk.html
     * @param {number} x - X coordinate of the disk center.
     * @param {number} y - Y coordinate of the disk.
     * @param {number} z - Z coordinate of the disk center.
     * @param {number} innerRadius - Inner radius (0 = full disk).
     * @param {number} outerRadius - Outer radius.
     * @param {number} slices - Number of slices (like pie slices).
     * @param {number} loops - Number of concentric rings.
     * @param {number} rot1 - Rotation around the X axis.
     * @param {number} rot2 - Rotation around the Y axis.
     * @param {number} rot3 - Rotation around the Z axis.
     * @param {number} r - Red component (0–1).
     * @param {number} g - Green component (0–1).
     * @param {number} b - Blue component (0–1).
     * @param {number} a - Transparency (0–1).
     * @param {boolean} phase - If true, renders through walls.
     * @param {boolean} linemode - True: wireframe disk, false: filled.
     * @returns {void}
     */
    static drawDisk(x, y, z, innerRadius, outerRadius, slices, loops, rot1, rot2, rot3, r, g, b, a, phase, linemode) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws a box outline (wireframe) with customizable width and line thickness.
     * @param {number} x - Center X coordinate.
     * @param {number} y - Y coordinate (bottom).
     * @param {number} z - Center Z coordinate.
     * @param {number} wx - Width along X.
     * @param {number} h - Height along Y.
     * @param {number} wz - Width along Z.
     * @param {number} red - Red (0–1).
     * @param {number} green - Green (0–1).
     * @param {number} blue - Blue (0–1).
     * @param {number} alpha - Transparency (0–1).
     * @param {boolean} phase - If true, renders through walls.
     * @param {number} [lineWidth=2.0] - Line thickness.
     * @returns {void}
     */
    static drawEspBoxV2(x, y, z, wx, h, wz, red, green, blue, alpha, phase, lineWidth = 2.0) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws a filled box (solid faces).
     * @param {number} x - Center X.
     * @param {number} y - Bottom Y.
     * @param {number} z - Center Z.
     * @param {number} wx - Width along X.
     * @param {number} h - Height.
     * @param {number} wz - Width along Z.
     * @param {number} red - Red (0–1).
     * @param {number} green - Green (0–1).
     * @param {number} blue - Blue (0–1).
     * @param {number} alpha - Transparency (0–1).
     * @param {boolean} phase - If true, renders through walls.
     * @returns {void}
     */
    static drawInnerEspBoxV2(x, y, z, wx, h, wz, red, green, blue, alpha, phase) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws an animated “baritone-style” wireframe box.
     * @param {number} x - Center X.
     * @param {number} y - Bottom Y.
     * @param {number} z - Center Z.
     * @param {number} w1 - Width along X.
     * @param {number} h - Height.
     * @param {number} w2 - Width along Z.
     * @param {number} red - Red (0–1).
     * @param {number} green - Green (0–1).
     * @param {number} blue - Blue (0–1).
     * @param {number} alpha - Transparency (0–1).
     * @param {boolean} phase - If true, renders through walls.
     * @param {number} [lineWidth=2.0] - Line thickness.
     * @returns {void}
     */
    static drawBaritoneEspBoxV2(x, y, z, w1, h, w2, red, green, blue, alpha, phase, lineWidth = 2.0) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws a filled animated baritone-style box.
     * @param {number} x - Center X.
     * @param {number} y - Bottom Y.
     * @param {number} z - Center Z.
     * @param {number} wx - Width along X.
     * @param {number} h - Height.
     * @param {number} wz - Width along Z.
     * @param {number} red - Red (0–1).
     * @param {number} green - Green (0–1).
     * @param {number} blue - Blue (0–1).
     * @param {number} alpha - Transparency (0–1).
     * @param {boolean} phase - If true, renders through walls.
     * @returns {void}
     */
    static drawInnerBaritoneEspBoxV2(x, y, z, wx, h, wz, red, green, blue, alpha, phase) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Draws a line between two 3D points.
     * @param {number} x1 - Start X.
     * @param {number} y1 - Start Y.
     * @param {number} z1 - Start Z.
     * @param {number} x2 - End X.
     * @param {number} y2 - End Y.
     * @param {number} z2 - End Z.
     * @param {number} red - Red (0–1).
     * @param {number} green - Green (0–1).
     * @param {number} blue - Blue (0–1).
     * @param {number} alpha - Transparency (0–1).
     * @param {boolean} phase - If true, renders through walls.
     * @param {number} [lineWidth=2.0] - Line thickness.
     * @returns {void}
     */
    static drawLine(x1, y1, z1, x2, y2, z2, red, green, blue, alpha, phase, lineWidth = 2.0) {
        throw new Error("Not implemented - native RenderLib binding");
    }

    /**
     * Calculate the center and dimensions of a box from two opposite corners.
     * @param {number} x1 - First corner X.
     * @param {number} y1 - First corner Y.
     * @param {number} z1 - First corner Z.
     * @param {number} x2 - Opposite corner X.
     * @param {number} y2 - Opposite corner Y.
     * @param {number} z2 - Opposite corner Z.
     * @returns {{cx:number, cy:number, cz:number, wx:number, h:number, wz:number}}
     * - `cx`: Center X
     * - `cy`: Bottom Y
     * - `cz`: Center Z
     * - `wx`: Width along X
     * - `h`: Height
     * - `wz`: Width along Z
     */
    static calculateCenter(x1, y1, z1, x2, y2, z2) {
        const cx = (x1 + x2) / 2;
        const cy = y1 > y2 ? y2 : y1;
        const cz = (z1 + z2) / 2;
        const wx = Math.abs(x2 - x1);
        const h = Math.abs(y2 - y1);
        const wz = Math.abs(z2 - z1);
        return { cx, cy, cz, wx, h, wz };
    }

    /**
     * Converts a color (string, array, or Java Color) into normalized RGBA values.
     * @param {Object|string|Array} color - Input color.
     * - Java Color: `Java.type("java.awt.Color")`
     * - String: "#RRGGBB" or "#RRGGBBAA"
     * - Array: [r,g,b,a] or [r,g,b] in 0–255
     * @returns {{red:number,green:number,blue:number,alpha:number}} Normalized RGBA (0–1).
     */
    static getColor(color) {
        const red = color.getRed() / 255;
        const green = color.getGreen() / 255;
        const blue = color.getBlue() / 255;
        const alpha = color.getAlpha() / 255;
        return { red, green, blue, alpha };
    }
}

/**
 * @type {typeof RenderLibV2J}
 */
const RenderLib = Java.type("net.meowing.renderlib.RenderLib");

export default RenderLib;