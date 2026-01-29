import Settings from "../Amaterasu/core/Settings"
import DefaultConfig from "../Amaterasu/core/DefaultConfig"
import { activategui, OverlayEditor } from "./managers/guimanager";
import { chat } from "./util/utils";

const config = new DefaultConfig("PrivateASF", "data/settings.json")
    .addSwitch({
        category: "Highlight",
        subcategory: "Boss",
        configName: "espWither",
        title: "Wither Highlight",
        description: "Highlight for Withers in F7 & M7",
        registerListener(previousValue, newValue) {
            chat(`&7Wither Highlight ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addDropDown({
        category: "Highlight",
        subcategory: "Boss",
        configName: "espWitherType",
        title: "Wither Highlight Type",
        description: "",
        options: ["Box", "Box Filled"],
        value: 0,
        shouldShow: data => data.espWither
    })
    .addDropDown({
        category: "Highlight",
        subcategory: "Boss",
        configName: "witherThruBlocks",
        title: "Depth Mode",
        description: "",
        options: ["Normal", "RayTracing", "ESP"],
        value: 0,
        shouldShow: data => data.espWither
    })
    .addSwitch({
        category: "Highlight",
        subcategory: "Boss",
        configName: "witherTracer",
        title: "Wither Tracer in P3",
        description: "&cRequires Odin",
        value: false,
        shouldShow: data => data.espWither
    })
    .addColorPicker({
        category: "Highlight",
        subcategory: "Boss",
        configName: "witherESPColorBox",
        title: "Wither Box Color",
        description: "",
        value: [244, 0, 25, 96],
        shouldShow: data => data.espWither
    })
    .addColorPicker({
        category: "Highlight",
        subcategory: "Boss",
        configName: "witherESPColorFill",
        title: "Wither Fill Color",
        description: "",
        value: [244, 0, 25, 96],
        shouldShow: data => data.espWither
    })


    .addSwitch({
        category: "Highlight",
        subcategory: "Star Mobs",
        configName: "starMobESP",
        title: "Star mob Highlight",
        description: "idk its self explanatory...",
        registerListener(previousValue, newValue) {
            chat(`&7Star Mobs Highlight ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addDropDown({
        category: "Highlight",
        subcategory: "Star Mobs",
        configName: "starMobESPThruBlocks",
        title: "Depth Mode",
        description: "Method for rendering highlights through blocks",
        options: ["Normal", "RayTracing", "ESP"],
        shouldShow: data => data.starMobESP
    })
    .addDropDown({
        category: "Highlight",
        subcategory: "Star Mobs",
        configName: "starHighlightType",
        title: "Render Mode",
        description: "The visual shape of the highlight",
        options: ["Box", "Box Filled"],
        value: 0,
        shouldShow: data => data.starMobESP
    })
    .addSlider({
        category: "Highlight",
        subcategory: "Star Mobs",
        configName: "starHighlightSize",
        title: "Highlight Size",
        description: "default 0.6",
        options: [0.1, 1],
        value: 0.6,
        shouldShow: data => data.starMobESP
    })
    .addColorPicker({
        category: "Highlight",
        subcategory: "Star Mobs",
        configName: "starMobESPColor",
        title: "Star Mobs Color",
        description: "",
        value: [255, 255, 255, 255],
        shouldShow: data => data.starMobESP
    })
    .addColorPicker({
        category: "Highlight",
        subcategory: "Star Mobs",
        configName: "starMobESPColorSA",
        title: "SA Color",
        description: "",
        value: [255, 255, 255, 255],
        shouldShow: data => data.starMobESP
    })
    .addColorPicker({
        category: "Highlight",
        subcategory: "Star Mobs",
        configName: "starMobESPColorFel",
        title: "Fel Color",
        description: "",
        value: [255, 255, 255, 255],
        shouldShow: data => data.starMobESP
    })
    .addSwitch({
        category: "Highlight",
        subcategory: "Bats",
        configName: "batESP",
        title: "Bat Highlight",
        description: "idk its self explanatory... (highlight depth and type will follow starmobs)",
        registerListener(previousValue, newValue) {
            chat(`&7Bat Highlight ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addColorPicker({
        category: "Highlight",
        subcategory: "Bats",
        configName: "batESPColor",
        title: "Bats Color",
        description: "",
        value: [255, 255, 255, 255],
        shouldShow: data =>  data.batESP
    })
    .addDropDown({
        category: "Highlight",
        subcategory: "Bats",
        configName: "batESPThruBlocks",
        title: "Depth Mode",
        description: "Method for rendering highlights through blocks",
        options: ["Normal", "RayTracing", "ESP"],
        shouldShow: data => data.batESP
    })
    .addDropDown({
        category: "Highlight",
        subcategory: "Bats",
        configName: "batHighlightType",
        title: "Render Mode",
        description: "The visual shape of the highlight",
        options: ["Box", "Box Filled"],
        value: 0,
        shouldShow: data => data.batESP
    })
    .addSwitch({
        category: "Pets",
        subcategory: "gui",
        configName: "CurrentPetGui",
        title: "Current pet display",
        description: "displays your current pet &cWIP",
        registerListener(previousValue, newValue) {
            chat(`&7Pet GUI ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Pets",
        subcategory: "chat",
        configName: "CancelPetChats",
        title: "Custom pet messages in chat",
        description: "Replaces all pet messages (level, summon, autopet) with a custom one",
        registerListener(previousValue, newValue) {
            chat(`&7Custom Pet Messages ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Pets",
        subcategory: "Noti",
        configName: "PetRuleNoti",
        title: "Pet Rule Notifier",
        description: "Displays a title of the pet that was equipped",
        registerListener(previousValue, newValue) {
            chat(`&7Pet Rule Notifier ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Pets",
        subcategory: "Noti",
        configName: "PetRuleNotiShort",
        title: "Shorten Pet Rule Noti",
        description: "Shortens Pet rule noti to just the pet",
        shouldShow: data => data.PetRuleNoti
    })
    .addSwitch({
        category: "Pets",
        subcategory: "Noti",
        configName: "PetRuleSound",
        title: "Pet Rule Notifier Sound",
        description: "Plays a sound when you swap pets",
        shouldShow: data => data.PetRuleNoti
    })
    .addSwitch({
        category: "Pets",
        subcategory: "Noti",
        configName: "customPetRuleColor",
        title: "Use custom color instead of rarity",
        description: "When displaying, will use the color you set instead of the pets rarity",
        shouldShow: data => data.PetRuleNoti
    })






    .addSwitch({
        category: "Dungeon",
        subcategory: "Secrets",
        configName: "SecretTracker",
        title: "Secret Tracker",
        description: "Tracks secrets done by party",
        registerListener(previousValue, newValue) {
            chat(`&7Secret Tracker ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Dungeon",
        subcategory: "Quiz",
        configName: "QuizTimer",
        title: "Quiz Timer",
        description: "Displays a timer for when quiz is ready",
        registerListener(previousValue, newValue) {
            chat(`&7Quiz Timer ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Dungeon",
        subcategory: "dupe",
        configName: "dupeClass",
        title: "Dupe Class Notifier",
        description: "Notifys if theres a dupe class",
        registerListener(previousValue, newValue) {
            chat(`&7Dupe Class Notifier ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Dungeon",
        subcategory: "dupe",
        configName: "ignoreDoubleMage",
        title: "Ignore dupe mage",
        description: "",
        shouldShow: data => data.dupeClass
    })
    .addSwitch({
        category: "Dungeon",
        subcategory: "Death Tick",
        configName: "deathTickTimer",
        title: "Death Tick Timer",
        description: ""
    })
    .addSwitch({
        category: "Dungeon",
        subcategory: "Death Tick",
        configName: "deathTickTimerType",
        title: "Use seconds instead of ticks",
        description: "",
        shouldShow: data => data.deathTickTimer
    })
    .addSwitch({
        category: "Dungeon",
        subcategory: "Party",
        configName: "partyFullNoti",
        title: "Party Full Alarm",
        description: "plays a loud sound if party is full &cWIP&r",
        registerListener(previousValue, newValue) {
            chat(`&7Party Full Alarm ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Dungeon",
        subcategory: "Party",
        configName: "partyLeaderOnly",
        title: "Only when leader",
        description: "Only when leader do you hear the sound",
        shouldShow: data => data.partyFullNoti
    })
    .addSwitch({
        category: "Dungeon",
        subcategory: "Party",
        configName: "partyDequeuedAlarm",
        title: "Party Dequeued Alarm",
        description: "plays a loud sound if party is dequeued &cWIP&r",
        registerListener(previousValue, newValue) {
            chat(`&7Party Dequeued Alarm ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSlider({
        category: "Dungeon",
        subcategory: "Party",
        configName: "partyNotiVolume",
        title: "Party Full Alarm Volume",
        description: "",
        options: [0, 10],
        step: 1,
        value: 5,
        shouldShow: data => data.partyFullNoti || data.partyDequeuedAlarm
    })
    .addSlider({
        category: "Dungeon",
        subcategory: "Party",
        configName: "partyNotiTime",
        title: "Party Full Alarm Time",
        description: "How long the alarm should sound for",
        options: [0, 10],
        step: 1,
        value: 4,
        shouldShow: data => data.partyFullNoti || data.partyDequeuedAlarm
    })





    .addSwitch({
        category: "Boss",
        subcategory: "P2",
        configName: "stormTimer",
        title: "Storm Timer",
        description: "A timer for the entire storm phase",
        registerListener(previousValue, newValue) {
            chat(`&7Storm Timer ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P2",
        configName: "sendStormTime",
        title: "Send Storm Time",
        description: "Send time killed for each piller",
        registerListener(previousValue, newValue) {
            chat(`&7Send Storm Time ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P2",
        configName: "autoSwap",
        title: "Archer Death Bow Swapper",
        description: "",
        registerListener(previousValue, newValue) {
            chat(`&7Archer Death Bow Swapper ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P2",
        configName: "lastBreathSwap",
        title: "Archer LB Swapper at Pillars",
        description: "",
        shouldShow: data => data.autoSwap,
        registerListener(previousValue, newValue) {
            chat(`&7Archer Last Breath Swapper ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addTextInput({
        category: "Boss",
        subcategory: "P2",
        configName: "autoSwapItem",
        title: "Item to swap to from death bow",
        description: "",
        shouldShow: data => data.autoSwap
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P2",
        configName: "pyLBTimer",
        title: "py Last Breath Timer",
        description: "Timer for a perfect py LB (idk why wayzel wanted ts, it's lowkey ass)",
        registerListener(previousValue, newValue) {
            chat(`&7py Last Breath Timer ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addTextInput({
        category: "Boss",
        subcategory: "P2",
        configName: "pyLBTimerSeconds",
        title: "The time it should countdown to in seconds",
        description: "",
        placeHolder: 34.6,
        value: 34.6,
        shouldShow: data => data.pyLBTimer
    })

    .addSwitch({
        category: "Boss",
        subcategory: "P3",
        configName: "leapNoti",
        title: "Leap Notifier",
        description: "",
        registerListener(previousValue, newValue) {
            chat(`&7Leap Notifier ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P3",
        configName: "goldorStartTimer",
        title: "Goldor Start Timer",
        description: "",
        registerListener(previousValue, newValue) {
            chat(`&7Goldor Timer ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P3",
        configName: "goldorTimer",
        title: "Goldor Timer",
        description: "a tick timer idk",
        registerListener(previousValue, newValue) {
            chat(`&7Goldor Timer ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addDropDown({
        category: "Boss",
        subcategory: "P3",
        configName: "goldorTimerType",
        title: "Goldor Timer Version",
        description: "",
        options: ["death tick", "full section"],
        value: 0,
        shouldShow: data => data.goldorTimer
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P3",
        configName: "goldorTimerTicks",
        title: "Show goldor timer in ticks instead",
        description: "",
        shouldShow: data => data.goldorTimer
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P3",
        configName: "TermNoti",
        title: "Terminal Notifier",
        description: "Notifys of term/dev/lever being done",
        registerListener(previousValue, newValue) {
            chat(`&7Terminal Notifier ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addMultiCheckbox({
        category: "Boss",
        subcategory: "P3",
        configName: "TermNotiToggles",
        title: "Term Noti Settings",
        description: "",
        options: [
            {
                title: "Gate Blown Notifier",
                configName: "GateNoti",
                value: true
            },
            {
                title: "Disable standard term titles",
                configName: "CancelTitles",
                value: true
            },
            {
                title: "Keep Custom Term Titles on screen",
                configName: "KeepTitles",
                value: true
            },
            {
                title: "Show I4 done and Lights done",
                configName: "instaNoti",
                value: false
            },
            {
                title: "full names (terminal, device, lever)",
                configName: "fullName",
                value: false
            },
            {
                title: "Show names",
                configName: "detailedMode",
                value: false
            }
        ],
        shouldShow: data => data.TermNoti,
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P3",
        configName: "MelodyTitle",
        title: "Melody Title",
        description: "Displays a title of who has a melody and the progress",
        registerListener(previousValue, newValue) {
            chat(`&7Melody Title ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P3",
        configName: "leverTriggerBot",
        title: "Lever Trigger Bot",
        description: "&cidk use at your own risk",
        registerListener(previousValue, newValue) {
            chat(`&7Lever Trigger Bot ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P3",
        configName: "disableForDevice",
        title: "Disable Lever Trigger Bot for Device",
        description: ""
    })
    .addSwitch({
        category: "Boss",
        subcategory: "P3",
        configName: "bonzoDP",
        title: "Bonzo Double Proc Notifier",
        description: "Notifies when your bonzo mask may double proc (&cWIP Must have goldor timer on and SOMETIMES DOESN'T WORK&r)",
        registerListener(previousValue, newValue) {
            chat(`&7Bonzo Double Proc Notifier ${newValue ? "&aEnabled" : "&cDisabled"}`)
        }
    })





    .addTextParagraph({
        category: "GUI",
        subcategory: "gui",
        configName: "MoveOverlayText",
        title: "Gui Editor Instructions",
        description: "&aLMB &7= Select | &aDrag &7= Move | &cRMB &7= Center | &bScroll &7= Scale | &eMiddle Click &7= Reset | &dR &7= Change color",
        centered: true
    })
    .addButton({
        category: "GUI",
        subcategory: "gui",
        configName: "MoveOverlays",
        title: "Gui Editor",
        description: "Move and resize all overlays",
        onClick: () => {
            Client.currentGui.close()
            OverlayEditor.open()
            activategui()
        }
    })
    .addSwitch({
        category: "GUI",
        subcategory: "invGUI",
        configName: "invGUI",
        title: "Armor and EQ gui",
        description: ""
    })
    .addColorPicker({
        category: "GUI",
        subcategory: "invGUI",
        configName: "itemBorder",
        title: "Item Border Color",
        description: "",
        value: [80, 40, 100, 150],
        shouldShow: data => data.invGUI
    })
    .addColorPicker({
        category: "GUI",
        subcategory: "invGUI",
        configName: "invBgColor",
        title: "GUI Background Color",
        description: "",
        value: [25, 10, 40, 130],
        shouldShow: data => data.invGUI
    })
    .addColorPicker({
        category: "GUI",
        subcategory: "invGUI",
        configName: "invBorderColor",
        title: "GUI Border Color",
        description: "",
        value: [120, 40, 180, 200],
        shouldShow: data => data.invGUI
    })

const setting = new Settings("PrivateASF", config, "data/ColorScheme.json")

export default () => setting.settings
