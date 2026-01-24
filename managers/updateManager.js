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
    chat("&aInitializing Update...");
    
    new Thread(() => {
        try {
            const connection = new java.net.URL(API_URL).openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            
            const reader = new java.io.BufferedReader(new java.io.InputStreamReader(connection.getInputStream()));
            let response = "";
            let line;
            while ((line = reader.readLine()) !== null) response += line;
            reader.close();

            const data = JSON.parse(response);
            if (!data.tree) throw new Error("Could not find repository tree.");
            
            let version = "Unknown"
            const metaDataFile = data.tree.find(item => item.path === "metadata.json")

            if (metaDataFile) {
                const metaDataContent = FileLib.getUrlContent(RAW_BASE + "metadata.json")
                try {
                    const metaJson = JSON.parse(metaDataContent);
                    version = metaJson.version || "Unknown";
                } catch (e) {}
            }



            const files = data.tree.filter(item => item.type === "blob")
                                   .filter(file => !BLACKLIST.includes(file.path));

            let changeDetected = false;
            let totalFiles = files.length;
            let versionMsg = (version !== "Unknown") ? `files. Updating to version: &e${version}` : "files. Updating...";
            chat(`Found ${versionMsg}`);
            
            files.forEach((file, index) => {
                let percent = Math.round(((index + 1) / totalFiles) * 100);
                let barLength = 20;
                let filled = Math.round((percent / 100) * barLength);
                let empty = barLength - filled;
                
                let progressBar = "&a" + "■".repeat(filled) + "&7" + "■".repeat(empty);
                ChatLib.actionBar(`&bUpdating: [${progressBar}&b] &f${percent}%`);

                const fileUrl = RAW_BASE + encodeURI(file.path);
                try {
                    const newContent = FileLib.getUrlContent(fileUrl);
                    if (!newContent || newContent.startsWith("404")) return;

                    const oldContent = FileLib.read(MODULE_NAME, file.path);

                    if (newContent !== oldContent) {
                        FileLib.write(MODULE_NAME, file.path, newContent, true);
                        changeDetected = true;
                    }
                } catch (e) {
                    console.error(`Error downloading ${file.path}: ${e}`);
                }
            });

            ChatLib.actionBar("");

            if (changeDetected) {
                chat("&a&lUpdate Successful! &7Files were modified. Reloading...");
                ChatLib.command("ct reload", true);
            } else {
                chat("&e&lNo changes! &7You are already running the latest version.");
            }

        } catch (err) {
            chat("&c&lUpdate Failed! &7Check /ct console for the error.");
            console.error(err);
        }
    }).start();
}).setName("updateprivate");