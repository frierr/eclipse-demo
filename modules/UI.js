const iface = document.getElementById("interface");
const gametick = 1000 / 60; //updates at 60 fps

import { sleep } from "./basics.js";
import { environments } from "./environment.js";
import { loadEnvironmentData, loadPlayerData } from "./save.js";

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
        this.inchoice = false;
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
        const ui_temp = this;
        menu_play.onclick = function() {
            iface.innerHTML = "";
            iface.style.background = "none";
            const save = localStorage.getItem("gamesave");
            if (save) {
                //save data exists
                const choices = [
                    {
                        text: "LOAD SAVED",
                        action: function(args) {
                            loadEnvironmentData(environments);
                            loadPlayerData(args[2].player);
                            args[2].playLoaded();
                        }
                    },
                    {
                        text: "START NEW",
                        action: function(args) {
                            args[2].play();
                        }
                    }
                ];
                ui_temp.playerChoice("", choices, [undefined, undefined, game, undefined]);
            } else {
                game.play();
            }
        };
        menu.appendChild(menu_play);
        const menu_controls = document.createElement("div");
        menu_controls.className = "choice-a";
        menu_controls.textContent = "CONTROLS";
        menu_controls.onclick = function() {
            iface.appendChild(ui.makeScreenText("WASD - move around<br>Mouse - look around<br>LMB - hit<br>E - interact<br>TAB - open Inventory", "BACK", undefined));
        };
        menu.appendChild(menu_controls);
        const menu_credits = document.createElement("div");
        menu_credits.className = "choice-a";
        menu_credits.textContent = "CREDITS";
        menu_credits.onclick = function() {
            iface.appendChild(ui.makeScreenText("Music by Sami Hiltunen, Oleg Kirilkov<br><br>Rain Ambient by JuliusH<br><br>SFX by Darkworld Audio, joseppujol<br><br>Sprites by Maranza", "BACK", undefined));
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
    displayTerminalPuzzleScreen(game) {
        const ui = this;
        iface.style.background = "url(./misc/scene/terminal_screen.png)";
        const container = document.createElement("div");
        container.style.display = "grid";
        container.style.gridTemplateRows = "12% 38% 30% 10% auto";
        container.style.height = "100%";
        container.style.width = "100%";
        container.style.textAlign = "center";
        const spacer_top = document.createElement("div");
        container.appendChild(spacer_top);
        const main = document.createElement("div");
        main.style.display = "grid";
        main.style.gridTemplateColumns = "25% 30% 10% 17% auto";
        const main_spacer_0 = document.createElement("div");
        main.appendChild(main_spacer_0);
        const main_screen = document.createElement("div");
        main_screen.style.display = "grid";
        main_screen.style.gridTemplateRows = "auto 25% 15%";
        /* SCREEN */
        const screen_spacer = document.createElement("div");
        main_screen.appendChild(screen_spacer);
        const screen_text = document.createElement("div");
        screen_text.style.color = "rgba(126,175,136,1)";
        screen_text.style.textAlign = "center";
        screen_text.textContent = "";
        main_screen.appendChild(screen_text);
        main.appendChild(main_screen);
        const main_spacer_1 = document.createElement("div");
        main.appendChild(main_spacer_1);
        const inputpanel = document.createElement("div");
        /* INPUT PANEL */
        inputpanel.style.display = "grid";
        inputpanel.style.gridTemplateRows = "1fr 1fr 1fr 1fr";
        inputpanel.style.gap = "2px";
        const inputline0 = document.createElement("div");
        inputline0.style.display = "grid";
        inputline0.style.gridTemplateColumns = "1fr 1fr 1fr";
        inputline0.style.gap = "2px";
        //
        const i00 = document.createElement("div");
        i00.classList = "choice-a";
        i00.textContent = "7";
        i00.onclick = function() {
            terminalInput(screen_text, "7");
        }
        inputline0.appendChild(i00);
        const i01 = document.createElement("div");
        i01.classList = "choice-a";
        i01.textContent = "8";
        i01.onclick = function() {
            terminalInput(screen_text, "8");
        }
        inputline0.appendChild(i01);
        const i02 = document.createElement("div");
        i02.classList = "choice-a";
        i02.textContent = "9";
        i02.onclick = function() {
            terminalInput(screen_text, "9");
        }
        inputline0.appendChild(i02);
        //
        inputpanel.appendChild(inputline0);
        const inputline1 = document.createElement("div");
        inputline1.style.display = "grid";
        inputline1.style.gridTemplateColumns = "1fr 1fr 1fr";
        inputline1.style.gap = "2px";
        //
        const i10 = document.createElement("div");
        i10.classList = "choice-a";
        i10.textContent = "4";
        i10.onclick = function() {
            terminalInput(screen_text, "4");
        }
        inputline1.appendChild(i10);
        const i11 = document.createElement("div");
        i11.classList = "choice-a";
        i11.textContent = "5";
        i11.onclick = function() {
            terminalInput(screen_text, "5");
        }
        inputline1.appendChild(i11);
        const i12 = document.createElement("div");
        i12.classList = "choice-a";
        i12.textContent = "6";
        i12.onclick = function() {
            terminalInput(screen_text, "6");
        }
        inputline1.appendChild(i12);
        //
        inputpanel.appendChild(inputline1);
        const inputline2 = document.createElement("div");
        inputline2.style.display = "grid";
        inputline2.style.gridTemplateColumns = "1fr 1fr 1fr";
        inputline2.style.gap = "2px";
        //
        const i20 = document.createElement("div");
        i20.classList = "choice-a";
        i20.textContent = "1";
        i20.onclick = function() {
            terminalInput(screen_text, "1");
        }
        inputline2.appendChild(i20);
        const i21 = document.createElement("div");
        i21.classList = "choice-a";
        i21.textContent = "2";
        i21.onclick = function() {
            terminalInput(screen_text, "2");
        }
        inputline2.appendChild(i21);
        const i22 = document.createElement("div");
        i22.classList = "choice-a";
        i22.textContent = "3";
        i22.onclick = function() {
            terminalInput(screen_text, "3");
        }
        inputline2.appendChild(i22);
        //
        inputpanel.appendChild(inputline2);
        const inputline3 = document.createElement("div");
        inputline3.style.display = "grid";
        inputline3.style.gridTemplateColumns = "1fr 2fr";
        inputline3.style.gap = "2px";
        //
        const i30 = document.createElement("div");
        i30.classList = "choice-a";
        i30.textContent = "0";
        i30.onclick = function() {
            terminalInput(screen_text, "0");
        }
        inputline3.appendChild(i30);
        const i31 = document.createElement("div");
        i31.classList = "choice-a";
        i31.textContent = "<";
        i31.onclick = function() {
            terminalRemove(screen_text);
        }
        inputline3.appendChild(i31);
        //
        inputpanel.appendChild(inputline3);
        main.appendChild(inputpanel);
        container.appendChild(main);
        const spacer_mid = document.createElement("div");
        container.appendChild(spacer_mid);
        const backbuttonspace = document.createElement("div");
        backbuttonspace.style.display = "grid";
        backbuttonspace.style.gridTemplateColumns = "auto 30% auto";
        const backbuttonspace_spacer = document.createElement("div");
        backbuttonspace.appendChild(backbuttonspace_spacer);
        const backbutton = document.createElement("div");
        backbutton.classList = "choice-a";
        backbutton.textContent = "BACK";
        backbutton.onclick = function () {
            iface.innerHTML = "";
            iface.style.background = "none";
            game.paused = false;
        };
        backbuttonspace.appendChild(backbutton);
        container.appendChild(backbuttonspace);
        iface.appendChild(container);
    }
    playerChoice (text, options, args) {
        this.inchoice = true;
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
            const ui = this;
            answer.addEventListener("click", (event) => {
                options[temp].action(args);
                ui.inchoice = false;
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
            const statusbar = document.createElement("div");
            statusbar.style.position = "absolute";
            statusbar.style.fontSize = "2em";
            statusbar.style.top = "40px";
            statusbar.style.left = "20px";
            wrapper.appendChild(fillItemContainer(target, container, statusbar));
            wrapper.appendChild(setStatusBar(statusbar, target));
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
    interact() {
        if(this.readingNote) {
            this.readingNote = false;
            this.note_wrap.remove();
            return this.inventory && this.inventory.parentNode;
        }
        return this.inchoice;
    }
}

function terminalRemove(screen_text) {
    if (screen_text.textContent.length > 0 && screen_text.textContent != "CORRECT") {
        screen_text.textContent = screen_text.textContent.substring(0, screen_text.textContent.length - 1);
    }
}

function terminalInput(screen_text, value) {
    if (screen_text.textContent.length < 3) {
        screen_text.textContent += value;
    }
    if (screen_text.textContent.length == 3 && Number(screen_text.textContent) == 451) {
        game.sound.playSFX("./audio/sfx/terminal.mp3");
        screen_text.textContent = "CORRECT";
        game.player.inEnvironment.toggletriggers[0].action = function(target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("bg_0", 1);
            environment.unload();
            environments[10].env.loadAt(target, {x: 140, y: 130});
        }
        return true;
    } else {
        return false;
    }
}

function fillItemContainer (target, container, statusbar) {
    container.innerHTML = "";
    var item_counter = 0;
    for(var v = 0; v < 5; v++) {
        for(var w = 0; w < 4; w++) {
            const item = document.createElement("div");
            if (v > 0 && v < 4 && w > 0 && w < 3) {
                if(target.possessions.items[item_counter]) {
                    const item3 = document.createElement("div");
                    if(target.possessions.items[item_counter].img) {
                        item.style.backgroundImage = `url(${target.possessions.items[item_counter].img})`;
                        item.style.backgroundSize = "cover";
                    } else {
                        item3.textContent = target.possessions.items[item_counter].fullName;
                    }
                    item.style.display = "grid";
                    item.style.gridTemplateRows = "auto 20%";
                    item.style.gap = "10px";
                    item.appendChild(item3);
                    if(target.possessions.items[item_counter].equippable) {
                        //add option to equip
                        const equip_item = target.possessions.items[item_counter];
                        const item2 = document.createElement("div");
                        item2.className = "choice-a";
                        if(target.possessions.equipped == equip_item) {
                            item2.textContent = "unequip";
                        } else {
                            item2.textContent = "equip";
                        }
                        item2.onclick = function() {
                            if(target.possessions.equip(equip_item)) {
                                this.textContent = "unequip";
                            } else {
                                this.textContent = "equip";
                            }
                            container = fillItemContainer(target, container);
                        }
                        item.appendChild(item2);
                    }
                    if(target.possessions.items[item_counter].heal) {
                        //add option to equip
                        const equip_item = target.possessions.items[item_counter];
                        const item2 = document.createElement("div");
                        item2.className = "choice-a";
                        item2.textContent = "use";
                        item2.onclick = function() {
                            target.possessions.heal(equip_item, target);
                            container = fillItemContainer(target, container);
                            statusbar = setStatusBar(statusbar, target);
                        }
                        item.appendChild(item2);
                    }
                }
                item_counter++;
                item.style.border = "2px solid antiquewhite";
            }
            container.appendChild(item);
        }
    }
    return container;
}

function setStatusBar(statusbar, target) {
    statusbar.innerHTML = "Condition: ";
    if (target.hp > 80) {
        statusbar.innerHTML += `<span style="color:lime">FINE</span>`;
    } else if (target.hp > 40) {
        statusbar.innerHTML += `<span style="color:gold">CAUTION</span>`;
    } else if (target.hp > 20) {
        statusbar.innerHTML += `<span style="color:red">HURT</span>`;
    } else {
        statusbar.innerHTML += `<span style="color:darkred">NEAR DEATH</span>`;
    }
    return statusbar;
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