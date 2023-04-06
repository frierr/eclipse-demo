const iface = document.getElementById("interface");
const gametick = 1000 / 60; //updates at 60 fps

import { sleep } from "./basics.js";

export class GameInterface {
    //displays menus and other ui
    constructor() {
        this.readingNote = false;
        this.note_wrap = undefined;
        this.displayingScene = false;
        this.sceneTiming = 0;
        this.sceneFrame = 0;
        this.scene = undefined;
        this.sceneGame = undefined;
        this.inventory = undefined;
        iface.style.backgroundPosition = "center";
        iface.style.backgroundRepeat = "no-repeat";
        iface.style.zIndex = 999;
    }
    makeScreenText(text, button_text, button_func) {
        const container = document.createElement("div");
        container.style.display = "grid";
        container.style.gridTemplateColumns = "auto 50% auto";
        container.style.position = "absolute";
        container.style.top = "0%";
        container.style.left = "0%";
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.backgroundColor = "rgba(0,0,0,0.8)";
        container.style.fontSize = "0.5em";
        container.style.zIndex = 9999;
        const spl = document.createElement("div");
        container.appendChild(spl);
        const container_2 = document.createElement("div");
        container_2.style.display = "grid";
        container_2.style.gridTemplateRows = "auto 60% 5% auto";
        const spt = document.createElement("div");
        container_2.appendChild(spt);
        const controls_text = document.createElement("div");
        controls_text.innerHTML = text;
        container_2.appendChild(controls_text);
        const controls_button = document.createElement("div");
        controls_button.className = "choice-a";
        controls_button.textContent = button_text;
        controls_button.onclick = function() {
            container.remove();
            if(button_func) {
                button_func();
            }
        };
        container_2.appendChild(controls_button); 
        container.appendChild(container_2);
        return container;
    }
    async displayGameoverText(reason, delay) {
        var text = "<h2>DEAD</h2><br>";
        text += reason;
        if (delay) {
            await sleep(delay * 1000);
        }
        iface.appendChild(this.makeScreenText(text, "ACCEPT", function() {
            window.location.reload();
        }));
    }
    displayStartingScreen(game) {
        const ui = this;
        iface.style.background = "url(./misc/title_screen.png)";
        const container = document.createElement("div");
        container.style.display = "grid";
        container.style.gridTemplateColumns = "15% auto";
        container.style.height = "100%";
        container.style.width = "100%";
        const spacer_l = document.createElement("div");
        container.appendChild(spacer_l);
        const menu_wrap = document.createElement("div");
        menu_wrap.style.display = "grid";
        menu_wrap.style.gridTemplateRows = "30% 30% 40% auto";
        const spacer_t = document.createElement("div");
        const spacer_b = document.createElement("div");
        const title = document.createElement("div");
        title.textContent = "Eclipse Demo";
        title.style.fontSize = "1.5em";
        const menu_wrap_2 = document.createElement("div");
        menu_wrap_2.style.display = "grid";
        menu_wrap_2.style.gridTemplateColumns = "35% auto";
        const menu = document.createElement("div");
        menu.style.display = "grid";
        menu.style.gridTemplateRows = "10% 10% 10% auto";
        menu.style.gap = "3%";
        menu.style.fontSize = "0.5em";
        const menu_play = document.createElement("div");
        menu_play.className = "choice-a";
        menu_play.textContent = "PLAY";
        menu_play.onclick = function() {
            iface.innerHTML = "";
            iface.style.background = "none";
            game.play();
        };
        menu.appendChild(menu_play);
        const menu_controls = document.createElement("div");
        menu_controls.className = "choice-a";
        menu_controls.textContent = "CONTROLS";
        menu_controls.onclick = function() {
            iface.appendChild(ui.makeScreenText("WASD - move around<br>Mouse - look around<br>E - interact<br>TAB - open Inventory", "BACK", undefined));
        };
        menu.appendChild(menu_controls);
        const menu_credits = document.createElement("div");
        menu_credits.className = "choice-a";
        menu_credits.textContent = "CREDITS";
        menu_credits.onclick = function() {
            iface.appendChild(ui.makeScreenText("Music by Sami Hiltunen, Oleg Kirilkov<br><br>Rain Ambient by JuliusH<br><br>SFX by Darkworld Audio<br><br>Player Sprite by Maranza", "BACK", undefined));
        };
        menu.appendChild(menu_credits);
        const menu_spacer = document.createElement("div");
        menu.appendChild(menu_spacer);
        menu_wrap.appendChild(spacer_t);
        menu_wrap.appendChild(title);
        menu_wrap_2.appendChild(menu);
        menu_wrap.appendChild(menu_wrap_2);
        menu_wrap.appendChild(spacer_b);
        container.appendChild(menu_wrap);
        iface.appendChild(container);
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
    displayInventory(target) {
        this.inventory = document.createElement("div");
        this.inventory.style.position = "absolute";
        this.inventory.style.top = "-25%";
        this.inventory.style.left = "0%";
        this.inventory.style.height = "150%";
        this.inventory.style.width = "100%";
        this.inventory.style.transform = "scale(0.5)";
        this.inventory.style.display = "grid";
        this.inventory.style.gridTemplateRows = "10% auto";
        this.inventory.style.gap = "5px";
        const wrapper = document.createElement("div");
        wrapper.style.backgroundColor = "rgba(0,0,0,0.8)";
        wrapper.style.border = "5px solid black";
        wrapper.style.fontSize = "0.4em";
        wrapper.style.lineHeight = 1.2;
        wrapper.style.maxHeight = "100%";
        wrapper.style.overflowY = "auto";
        const category = document.createElement("div");
        category.style.display = "grid";
        category.style.gridTemplateColumns = "repeat(auto-fill, 40%)";
        category.style.gap = "1px";
        const ui_temp = this;
        const j = document.createElement("div");
        j.className = "choice-a";
        j.textContent = "Journal";
        j.style.transform = "scale(0.5)";
        j.onclick = function() {
            wrapper.innerHTML = "";
            var text = "";
            for (var v = 0; v < target.possessions.journal.length; v++) {
                text += target.possessions.journal[v] + "<br><br>";
            }
            wrapper.innerHTML = text;
            wrapper.scrollTo(0, wrapper.scrollHeight);
        }
        category.appendChild(j);
        const i = document.createElement("div");
        i.className = "choice-a";
        i.textContent = "Items";
        i.style.transform = "scale(0.5)";
        i.onclick = function() {
            wrapper.innerHTML = "";
            const container = document.createElement("div");
            container.style.display = "grid";
            container.style.gridTemplateColumns = "auto 45px 45px auto";
            container.style.gridTemplateRows = "auto 45px 45px 45px auto";
            container.style.height = "100%";
            container.style.width = "40%";
            container.style.margin = "auto";
            container.style.gap = "10px";
            var item_counter = 0;
            for(var v = 0; v < 5; v++) {
                for(var w = 0; w < 4; w++) {
                    const item = document.createElement("div");
                    if (v > 0 && v < 4 && w > 0 && w < 3) {
                        if(target.possessions.items[item_counter]) {
                            item.textContent = target.possessions.items[item_counter].fullName;
                        }
                        item_counter++;
                        item.style.border = "2px solid antiquewhite";
                    }
                    container.appendChild(item);
                }
            }
            wrapper.appendChild(container);
        }
        category.appendChild(i);
        const n = document.createElement("div");
        n.className = "choice-a";
        n.textContent = "Notes";
        n.style.transform = "scale(0.5)";
        n.onclick = function() {
            wrapper.innerHTML = "";
            if(target.possessions.notes.length == 0) {
                wrapper.textContent = "No notes";
            } else {
                const container = document.createElement("div");
                container.style.display = "grid";
                container.style.gridTemplateRows = "repeat(1fr)";
                container.style.gap = "10px";
                for (var v = 0; v < target.possessions.notes.length; v++) {
                    const item = document.createElement("div");
                    item.className = "choice-a";
                    item.style.display = "grid";
                    item.style.gridTemplateColumns = "20px auto";
                    item.style.gap = "5px";
                    const item_icon = document.createElement("div");
                    /* TO DO: display item icon */
                    const item_desc = document.createElement("div");
                    item_desc.textContent = target.possessions.notes[v].fullName + (target.possessions.notes[v].text ? " - " + target.possessions.notes[v].text : "");
                    item.appendChild(item_icon);
                    item.appendChild(item_desc);
                    const count = v;
                    item.onclick = function() {
                        ui_temp.displayNote(target.possessions.notes[count]);
                    }
                    container.appendChild(item);
                }
                wrapper.appendChild(container);
            }
        }
        category.appendChild(n);
        const k = document.createElement("div");
        k.className = "choice-a";
        k.textContent = "Keys";
        k.style.transform = "scale(0.5)";
        k.onclick = function() {
            wrapper.innerHTML = "";
            if(target.possessions.keys.length == 0) {
                wrapper.textContent = "No keys";
            } else {
                const container = document.createElement("div");
                container.style.display = "grid";
                container.style.gridTemplateRows = "repeat(1fr)";
                container.style.gap = "10px";
                for (var v = 0; v < target.possessions.keys.length; v++) {
                    const item = document.createElement("div");
                    item.className = "choice-a";
                    item.style.display = "grid";
                    item.style.gridTemplateColumns = "20px auto";
                    item.style.gap = "5px";
                    const item_icon = document.createElement("div");
                    /* TO DO: display item icon */
                    const item_desc = document.createElement("div");
                    item_desc.textContent = target.possessions.keys[v].fullName + (target.possessions.keys[v].text ? " - " + target.possessions.keys[v].text : "");
                    item.appendChild(item_icon);
                    item.appendChild(item_desc);
                    container.appendChild(item);
                }
                wrapper.appendChild(container);
            }
        }
        category.appendChild(k);
        this.inventory.appendChild(category);
        this.inventory.appendChild(wrapper);
        iface.appendChild(this.inventory);
        i.click();
    }
    hideInventory() {
        if(this.readingNote) {
            this.readingNote = false;
            this.note_wrap.remove();
        }
        this.inventory.remove();
    }
    displayNote(note) {
        this.readingNote = true;
        this.note_wrap = document.createElement("div");
        this.note_wrap.style.position = "absolute";
        this.note_wrap.style.top = "-25%";
        this.note_wrap.style.left = "0%";
        this.note_wrap.style.height = "150%";
        this.note_wrap.style.width = "100%";
        this.note_wrap.style.transform = "scale(0.5)";
        this.note_wrap.style.backgroundPosition = "center";
        this.note_wrap.style.backgroundRepeat = "no-repeat";
        this.note_wrap.style.zIndex = 9999;
        if(note.img) {
            this.note_wrap.style.backgroundImage = `url(${note.img})`;
        }
        iface.appendChild(this.note_wrap);
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
            this.note_wrap.remove();
            return this.inventory && this.inventory.parentNode;
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