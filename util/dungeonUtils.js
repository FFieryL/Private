import Dungeon from "../../BloomCore/dungeons/Dungeon";
import Settings from "../config"
import { data, drawText, registerOverlay } from "../managers/guimanager"
import { S03PacketTimeUpdate, S08PacketPlayerPosLook, S32PacketConfirmTransaction } from "./utils";
registerOverlay("DeathTickTimer", { text: () => "0.00", align: "center", colors: false})

global.goldorTicks = 0;
global.stormTicks = 0;
global.goldorLoop = 0;

class dungeonUtils {
    constructor() {
        this.currentStage = 0
        this.currentPhase = 0;
        this.inBoss = false

        this.deathTicks = -1;
        this.spawnPos = null

        register("chat", message => {
            if (message === "[BOSS] Storm: I should have known that I stood no chance.") this.currentStage = 1;
            if ((message.includes("(7/7)") || message.includes("(8/8)")) && !message.includes(":")) this.currentStage += 1;
        }).setCriteria("${message}");

        register("chat", (name, event) => {
            name = name.removeFormatting();
            if (name === "Maxor") this.currentPhase = 1;
            if (name === "Storm") this.currentPhase = 2;
            if (name === "Goldor") this.currentPhase = 3;
            if (name === "Necron") this.currentPhase = 4;
            if (name === "Wither King") this.currentPhase = 5;
            if (this.currentPhase > 0) this.inBoss = true
        }).setCriteria("[BOSS] ${name}: ${*}");

        this.serverTick = register("packetReceived", () => {
            this.deathTicks--;
            if (this.deathTicks <= 0) this.deathTicks = 40;
        }).setFilteredClass(S32PacketConfirmTransaction).unregister();


        this.S03 = register("packetReceived", (packet) => {
            const totalWorldTime = packet.func_149366_c();
            if (!totalWorldTime) return;

            this.deathTicks = 40 - (totalWorldTime % 40);
            this.serverTick.register();
            if (Settings().deathTickTimer && this.spawnPos != null) this.deathTickOverlay.register()
            this.S03.unregister()
        }).setFilteredClass(S03PacketTimeUpdate);

        this.spawnPosition = register('packetReceived', (packet) => {
            const [px, py, pz] = [packet.func_148932_c(), packet.func_148928_d(), packet.func_148933_e()];
            if (py !== 75.5 && py !== 76.5) return;

            this.spawnPos = [px, py, pz];
            this.spawnPosition.unregister();
            return;
        }).setFilteredClass(S08PacketPlayerPosLook);

        this.chat = register("chat", (message) => {
            if (message == "[NPC] Mort: Here, I found this map when I first entered the dungeon.") {
                this.serverTick.unregister()
                this.deathTickOverlay.unregister()
            }
            if (!message.includes("Sending to server")) return;
            this.deathTicks = -1;
            this.spawnPos = null;
            this.spawnPosition.register()
        }).setCriteria("${message}")

        this.deathTickOverlay = register("renderOverlay", () => {
            const timeT = this.deathTicks
            const timeS = (timeT / 20).toFixed(2)
            
            let color;
            if(timeT > 20) color = "&a"
            else if (timeT > 10) color = "&6"
            else color = "&c";
            const displayText = color + timeS.toString()
            drawText(displayText, data.DeathTickTimer, true, "DeathTickTimer")
        }).unregister()

        register("worldLoad", () => {
            this.currentPhase = 0; 
            this.currentStage = 0; 
            this.inBoss = false;
            this.deathTicks = -1;
            this.serverTick.register();
            this.deathTickOverlay.unregister()
            this.S03.register()
        });


    }


    inDungeon() {
        return Dungeon.inDungeon
    }
    
    getClassColor(playerClass) {
        const colors = {
            Healer: "&d",
            Tank: "&a",
            Mage: "&b",
            Berserk: "&c",
            Archer: "&6"
        };
        return colors[playerClass] || "&f"; 
    }

    translateClass(classLetter) {
        const DungeonClassMap = new Map([
            ["M", "Mage"],
            ["B", "Berserk"],
            ["A", "Archer"],
            ["H", "Healer"],
            ["T", "Tank"]
        ])
        return DungeonClassMap.get(classLetter) || "Unknown Class";
    }

    getPlayerClass(playerName) {
        return Dungeon.classes[playerName]
    }


    getStage = () => this.currentStage;
    inStage = (stage) => Array.isArray(stage) ? stage.includes(this.currentStage) : this.currentStage === stage;
    getPhase = () => this.currentPhase;
    inPhase = (phase) => Array.isArray(phase) ? phase.includes(this.currentPhase) : this.currentPhase === phase;

}

export default new dungeonUtils();
