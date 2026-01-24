import { chat } from "../util/utils";

const MODULE_NAME = "PrivateASF";
const BLACKLIST = [
    ".gitignore",
    "data/guidata.json",
    "data/irc_data.json",
    "data/settings.json",
    "README.md"
];

const API_URL = `https://api.github.com/repos/FFieryL/Private/git/trees/master?recursive=1`;
const RAW_BASE = `https://raw.githubusercontent.com/FFieryL/Private/master/`;

register("command", () => {
    chat("&aInitializing Update");
    
    new Thread(() => {
        try {
            const connection = new java.net.URL(API_URL).openConnection();
            connection.setRequestProperty("User-Agent", "ChatTriggers-Updater");
            
            const reader = new java.io.BufferedReader(new java.io.InputStreamReader(connection.getInputStream()));
            let response = "";
            let line;
            while ((line = reader.readLine()) !== null) response += line;
            reader.close();

            const data = JSON.parse(response);
            if (!data.tree) throw new Error("Could not find repository tree.");

            let version = "Unknown";
            const metaFile = data.tree.find(item => item.path === "metadata.json");
            if (metaFile) {
                const metaContent = FileLib.getUrlContent(RAW_BASE + "metadata.json");
                try {
                    version = JSON.parse(metaContent).version || "Unknown";
                } catch (e) {}
            }

            const files = data.tree
                .filter(item => item.type === "blob")
                .map(item => item.path)
                .filter(path => !BLACKLIST.includes(path));
            
            let changeDetected = false; // Track if we actually changed anything

            Client.scheduleTask(0, () => {
                let versionMsg = (version !== "Unknown") ? `files. Updating to version: &e${version}` : "files. Updating...";
                chat(`Found ${versionMsg}`);
            });

            files.forEach((path, index) => {
                const newContent = FileLib.getUrlContent(RAW_BASE + path);
                
                if (newContent && !newContent.startsWith("404")) {
                    // Read the local file to compare
                    const oldContent = FileLib.read(MODULE_NAME, path);

                    // Only write if the content is different
                    if (newContent !== oldContent) {
                        FileLib.write(MODULE_NAME, path, newContent, true);
                        changeDetected = true;
                    }
                    
                    Client.scheduleTask(0, () => {
                        let percent = Math.round(((index + 1) / files.length) * 100);
                        let filled = Math.round(percent / 5); 
                        let bar = "&a" + "■".repeat(filled) + "&7" + "■".repeat(20 - filled);
                        ChatLib.actionBar(`&bUpdating: [${bar}&b] &f${percent}%`);
                    });
                }
            });

            // Finalize logic based on changeDetected
            Client.scheduleTask(10, () => {
                ChatLib.actionBar(""); 
                
                if (changeDetected) {
                    chat("&aUpdate successful! &rReloading...");
                    ChatLib.command("ct reload", true);
                } else {
                    chat("&eNo changes detected. &7You are already on the latest version.");
                }
            });

        } catch (e) {
            Client.scheduleTask(0, () => {
                chat("&cUpdate failed! Check console.");
            });
            console.error(e);
        }
    }).start();
}).setName("updateprivate");