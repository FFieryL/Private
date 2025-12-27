import Settings from "../config"
import { data, drawText, registerOverlay } from "../managers/guimanager"
import { S32PacketConfirmTransaction } from "../util/utils"
let timeElapsed = 0
let timerDuration = 0
registerOverlay("QuizTimer", { text: () => "Quiz: &c11.00", align: "center" })

const tickListener = register('packetReceived', () => {
    timeElapsed++
    if(timeElapsed == timerDuration) tickListener.unregister()
}).setFilteredClass(S32PacketConfirmTransaction).unregister()

const quizTimer = register("renderOverlay", () => {
    const remaining = (timerDuration - timeElapsed) / 20;
    if (remaining <= 0) return quizTimer.unregister();
    const fraction = remaining / (timerDuration / 20);
    let color;
    if (fraction <= 0.5 && fraction >= 0.25) color = `&e`;
    else if (fraction <= 0.25) color = `&c`;
    else color = `&a`;
    const displaytext = "Quiz: " + color + remaining.toFixed(2);
    drawText(displaytext, data.QuizTimer, true, "QuizTimer")
}).unregister()

const QuizTimerStart = (duration) => {
    timeElapsed = 0
    timerDuration = duration;
    tickListener.register()
};

register("worldLoad", () => quizTimer.unregister())

// let displaytext = "Milestone ⓿"
// const renderMilestone = register("renderOverlay", () => {
//     drawText(displaytext, data.QuizTimer, true, "QuizTimer")
// })

// register("chat", (milestone) => {
//     displaytext = "Milestone " + milestone 
// }).setCriteria(/.*Milestone ([❶-❾\d]+): .*/)

const chatTrig1 = register("chat", () => {QuizTimerStart(220); quizTimer.register()}).setCriteria("[STATUE] Oruo the Omniscient: I am Oruo the Omniscient. I have lived many lives. I have learned all there is to know.").unregister()
const chatTrig2 = register("chat", () => {QuizTimerStart(140); quizTimer.register()}).setCriteria(/\[STATUE\] Oruo the Omniscient: .+ answered Question #\d correctly!/).unregister()

if (Settings().QuizTimer) {
    chatTrig1.register()
    chatTrig2.register()
}

Settings().getConfig().registerListener("QuizTimer", (prev, curr) => {
    if (curr) {
        chatTrig1.register()
        chatTrig2.register()
    }
    else {
        chatTrig1.unregister()
        chatTrig2.unregister()
    }
})