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


const OWNER = "FFieryL";
const REPO = "Private";
const BRANCH = "master";
const MODULE_NAME = "PrivateASF";

// API URL for recursive file list
const API_URL = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;
const RAW_BASE = `https://raw.githubusercontent.com/FFieryL/Private/master/`;

register("command", () => {
    ChatLib.chat("&aScanning GitHub for files...");
    
    new Thread(() => {
        try {
            // 1. Fetch the file list from GitHub API
            const connection = new java.net.URL(API_URL).openConnection();
            connection.setRequestProperty("User-Agent", "ChatTriggers-Updater");
            
            const reader = new java.io.BufferedReader(new java.io.InputStreamReader(connection.getInputStream()));
            let response = "";
            let line;
            while ((line = reader.readLine()) !== null) response += line;
            reader.close();

            const data = JSON.parse(response);
            if (!data.tree) throw new Error("Could not find repository tree.");

            // 2. Filter for files only (type: "blob")
            const files = data.tree.filter(item => item.type === "blob").map(item => item.path);
            
            ChatLib.chat(`&7Found ${files.length} files. Starting download...`);

            // 3. Download each file
            files.forEach(path => {
                const content = FileLib.getUrlContent(RAW_BASE + path);
                if (content && !content.startsWith("404")) {
                    FileLib.write(MODULE_NAME, path, content, true);
                    ChatLib.chat(`&8> Updated: ${path}`);
                }
            });

            ChatLib.chat("&aUpdate successful! Reloading...");
            ChatLib.command("ct reload", true);

        } catch (e) {
            ChatLib.chat("&cUpdate failed! Check console for details.");
            console.error(e);
        }
    }).start();
}).setName("updateprivate");