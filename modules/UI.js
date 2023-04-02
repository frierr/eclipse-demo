const iface = document.getElementById("interface");
const gametick = 1000 / 60; //updates at 60 fps

import { sleep } from "./basics.js";

export class GameInterface {
    //displays menus and other ui
    constructor() {
        this.readingNote = false;
        this.displayingScene = false;
        this.sceneTiming = 0;
        this.sceneFrame = 0;
        this.scene = undefined;
        this.sceneGame = undefined;
        iface.style.backgroundPosition = "center";
        iface.style.backgroundRepeat = "no-repeat";
        iface.style.zIndex = 999;
    }
    playerChoice (text, options, args) {
        const choice = document.createElement("div");
        choice.style.position = "absolute";
        choice.style.bottom = "0px";
        choice.style.width = "100%";
        choice.style.transform = "scale(0.5)";
        choice.style.display = "grid";
        choice.onclick = function() {
            this.remove();
        };
        const question = document.createElement("div");
        question.textContent = text;
        choice.appendChild(question);
        for (var i = 0; i < options.length; i++) {
            const answer = document.createElement("div");
            answer.className = "choice-a";
            answer.textContent = options[i].text;
            const temp = i;
            answer.addEventListener("click", (event) => {
                options[temp].action(args);
            });
            choice.appendChild(answer);
        }
        iface.appendChild(choice);
    }
    displayNote(note) {
        this.readingNote = true;
        if(note.img) {
            iface.style.backgroundImage = `url(${note.img})`;
        }
    }
    displayScene(scene, game) {
        this.scene = scene;
        this.sceneGame = game;
        this.displayingScene = true;
        this.sceneTiming = 0;
        this.sceneFrame = 0;
        this.tickScene();
    }
    async tickScene() {
        while(this.displayingScene) {
            let sleeper = sleep(gametick);
            if (this.sceneFrame >= this.scene.frames.length) {
                this.displayingScene = false;
                this.sceneGame.paused = false;
                iface.style.backgroundImage = `none`;
            } else {
                iface.style.backgroundImage = `url(${this.scene.frames[this.sceneFrame].frame})`;
            }
            this.sceneTiming++;
            if (this.displayingScene && this.sceneTiming == this.scene.frames[this.sceneFrame].time) {
                this.sceneTiming = 0;
                this.sceneFrame++;
            }
            await sleeper;
        }
    }
    tickUI() {
        if(this.displayingScene) {
            
        }
    }
    interact() {
        if(this.readingNote) {
            this.readingNote = false;
            iface.style.backgroundImage = "none";
            return false;
        }
    }
}

const contexttext = document.getElementById("contexttext");
const cttime = 10;
var ctcurrent = 0;
var ctopacity = 0;
export function tickContextText() {
    ctcurrent = Math.max(0, ctcurrent - 1);
    if (ctcurrent < cttime) {
        ctopacity -= 0.1;
    }
    contexttext.style.opacity = Math.max(0, ctopacity);
}
export function displayContextTextAt(position, text, timeup) {
    ctopacity = 1;
    ctcurrent = timeup;
    contexttext.textContent = text;
    contexttext.style.top = `${position.y}px`;
    contexttext.style.left = `${position.x}px`;
}