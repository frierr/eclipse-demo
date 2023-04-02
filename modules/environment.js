import { Sprite } from "./sprite.js";

export var environments = [];
export function initEnvironments() {
    environments.push(
        {
            name: "house_master_bedroom",
            env: new Environment(
                "./levels/house_master_bedroom.png", 
                {w:160,h:112}, 
                {x:0, y:49, w:160, h:63}, 
                {x:180,y:120},
                [
                    {
                        name: "wardrobe",
                        image: "./levels/objects/wardrobe.png",
                        at: {x: 125, y: 60},
                        size: {h: 57, w: 34},
                        box: {h: 10, w: 34}
                    },
                    {
                        name: "bed",
                        image: "./levels/objects/bed.png",
                        at: {x: 0, y: 100},
                        size: {h: 44, w: 77},
                        box: {h: 30, w: 75}
                    },
                    {
                        name: "drawer",
                        image: "./levels/objects/drawer_note.png",
                        at: {x: 0, y: 112},
                        size: {h: 20, w: 18},
                        box: {h: 20, w: 18}
                    }
                ],
                [],
                [
                    {
                        name: "wardrobe",
                        at: {x: 125, y: 70},
                        box: {h: 10, w: 34},
                        action: function(target, environment) {
                            target.displayText("Nothing useful inside...", 90, {x: 160, y: 50});
                        }
                    },
                    {
                        name: "window",
                        at: {x: 72, y: 60},
                        box: {h: 10, w: 34},
                        action: function(target, environment) {
                            target.displayText("It's dark and raining...", 90, {x: 87, y: 45});
                        }
                    },
                    {
                        name: "topdoor",
                        at: {x: 15, y: 60},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            environment.unload();
                            environments[1].env.loadAt(target, environments[1].env.playerPosition);
                        }
                    },
                    {
                        name: "rightdoor",
                        at: {x: 150, y: 100},
                        box: {h: 20, w: 10},
                        action: function(target, environment) {
                            target.displayText("The door is locked...", 90, {x: 212, y: 90});
                        }
                    },
                    {
                        name: "drawer",
                        at: {x: 20, y: 112},
                        box: {h: 10, w: 10},
                        action: function(target, environment, ui) {
                            for (var i = 0; i < environment.objects.length; i++) {
                                if (environment.objects[i].name == "drawer") {
                                    environment.objects[i].image = "./levels/objects/drawer.png";
                                    environment.removeObjects();
                                    environment.setUpObjects();
                                    environment.loadObjects();
                                    break;
                                }
                            }
                            //display note and pause the game
                            //add note to player inv
                            target.notes.push({
                                name: "Bedroom note",
                                text: undefined,
                                img: "./misc/notes/bedroom_note.png"
                            });
                            ui.displayNote(target.notes[target.notes.length - 1]);
                            return true; //true = pauses the game
                        }
                    }
                ],
                []
            )
        }
    );
    environments.push(
        {
            name: "house_master_bathroom",
            env: new Environment(
                "./levels/house_master_bathroom.png", 
                {w:90,h:70}, 
                {x:0, y:49, w:90, h:21}, 
                {x:195,y:120},
                [
                    {
                        name: "mirror_bg",
                        image: "./levels/objects/bathroom_mirror_bg.png",
                        at: {x: 63, y: 49},
                        size: {h: 49, w: 16},
                        box: {h: 0, w: 0},
                        zIndex: 1
                    },
                    {
                        name: "bathtub",
                        image: "./levels/objects/bathtub_filled.png",
                        at: {x: 0, y: 70},
                        size: {h: 34, w: 17},
                        box: {h: 30, w: 17}
                    },
                    {
                        name: "blackwall_bugfix",
                        image: "./levels/objects/blackwall.png",
                        at: {x: 90, y: 49},
                        size: {h: 49, w: 16},
                        box: {h: 0, w: 0},
                        zIndex: 3
                    }
                ],
                [],
                [
                    {
                        name: "door",
                        at: {x: 85, y: 65},
                        box: {h: 10, w: 10},
                        action: function(target, environment) {
                            environment.unload();
                            environments[0].env.loadAt(target, {x:105, y:90});
                        }
                    },
                    {
                        name: "mirror",
                        at: {x: 65, y: 55},
                        box: {h: 10, w: 10},
                        action: function(target, environment) {
                            target.displayText("Looks familiar...", 90, {x: 125, y: 70});
                        }
                    },
                    {
                        name: "bathtub",
                        at: {x: 15, y: 65},
                        box: {h: 10, w: 10},
                        action: function(target, environment, ui, game) {
                            game.paused = true;
                            ui.playerChoice("Stick your hand in the bathtub?", [
                                {
                                    text: "Yes",
                                    action: function(args) {
                                        if (false) { //player has item
                                            //
                                        } else {
                                            args[3].displayScene({
                                                frames: [
                                                    {
                                                        frame: "./misc/scene/bathroom_fail_1.png",
                                                        time: 60
                                                    },
                                                    {
                                                        frame: "./misc/scene/bathroom_fail_2.png",
                                                        time: 60
                                                    },
                                                    {
                                                        frame: "./misc/scene/bathroom_fail_3.png",
                                                        time: 60
                                                    },
                                                    {
                                                        frame: "./misc/scene/bathroom_fail_4.png",
                                                        time: 60
                                                    },
                                                    {
                                                        frame: "./misc/scene/bathroom_fail_5.png",
                                                        time: 60
                                                    },
                                                    {
                                                        frame: "./misc/scene/bathroom_fail_6.png",
                                                        time: 60
                                                    }
                                                ]
                                            }, args[2]);
                                        }
                                    }
                                },
                                {
                                    text: "No",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], [target, environment, game, ui]);
                        }
                    }
                ],
                [
                    {
                        type: "reflection",
                        sprite: new Sprite("./entities/player_basic.png", {x:0, y:0}, {w:32, h:32}),
                        reflectionTop: true,
                        startAtY: 49,
                        zIndex: 2
                    }
                ]
            )
        }
    );
}
class Environment {
    //handles level data, backgrounds, objects, etc
    constructor(background, size, playarea, position, objects, autotriggers, toggletriggers, entities) {
        this.element = document.createElement("div");
        this.element.style.width = `${size.w}px`;
        this.element.style.height = `${size.h}px`;
        this.element.style.position = "absolute";
        this.position = {
            x: (320 - size.w) / 2,
            y: (180 - size.h) / 2
        }
        this.element.style.top = `${this.position.y}px`;
        this.element.style.left = `${this.position.x}px`;
        this.element.style.zIndex = 5;
        this.element.style.backgroundImage = `url(${background})`;
        this.playarea = playarea;
        this.playerPosition = position;
        this.objects = objects;
        this.objects_elems = [];
        this.setUpObjects();
        this.autotriggers = autotriggers;
        this.toggletriggers = toggletriggers;
        //this.visualiseTriggers(this.toggletriggers);
        this.entities = entities;
    }
    setUpObjects() {
        for (var i = 0; i < this.objects.length; i++) {
            const elem = document.createElement("div");
            elem.style.width = `${this.objects[i].size.w}px`;
            elem.style.height = `${this.objects[i].size.h}px`;
            elem.style.position = "absolute";
            elem.style.top = `${this.objects[i].at.y - this.objects[i].size.h + this.position.y}px`;
            elem.style.left = `${this.objects[i].at.x + this.position.x}px`;
            elem.style.zIndex = (this.objects[i].zIndex ? this.objects[i].zIndex : this.objects[i].at.y + this.position.y);
            elem.style.backgroundImage = `url(${this.objects[i].image})`;
            this.objects_elems.push(elem);
        }
    }
    removeObjects() {
        for (var i = 0; i < this.objects_elems.length; i++) {
            this.objects_elems[i].remove();
        }
        this.objects_elems = [];
    }
    loadObjects() {
        for (var i = 0; i < this.objects_elems.length; i++) {
            playarea.appendChild(this.objects_elems[i]);
        }
    }
    visualiseTriggers(triggers) {
        for (var i = 0; i < triggers.length; i++) {
            const elem = document.createElement("div");
            elem.style.width = `${triggers[i].box.w}px`;
            elem.style.height = `${triggers[i].box.h}px`;
            elem.style.position = "absolute";
            elem.style.top = `${triggers[i].at.y - triggers[i].box.h}px`;
            elem.style.left = `${triggers[i].at.x}px`;
            elem.style.zIndex = triggers[i].at.y + this.position.y;
            elem.style.backgroundColor = "yellow";
            elem.style.opacity = 0.2;
            this.element.appendChild(elem);
        }
    }
    toggleTrigger(target, ui, game) {
        //determine if player is in any trigger area
        for (var i = 0; i < this.toggletriggers.length; i++) {
            if (target.position.x - target.box.sides <= this.toggletriggers[i].at.x + this.toggletriggers[i].box.w + this.position.x && target.position.x + target.box.sides >= this.toggletriggers[i].at.x + this.position.x
            && target.position.y - target.box.top <= this.toggletriggers[i].at.y + this.position.y && target.position.y >= this.toggletriggers[i].at.y - this.toggletriggers[i].box.h + this.position.y) {
                if(this.toggletriggers[i].action(target, this, ui, game)) {
                    return true;
                }
                return;
            }
        }
    }
    load() {
        playarea.appendChild(this.element);
        this.setUpObjects();
        this.loadObjects();
    }
    unload() {
        this.element.remove();
        this.removeObjects();
    }
    loadAt(player, position) {
        //move player to starting position
        this.load();
        player.position = position;
        player.sprite.updateSpritePosition(player.position);
        player.inEnvironment = this;
    }
    isInsidePlayarea(target) {
        var result = true;
        result = target.position.x - target.box.sides >= this.playarea.x + this.position.x && target.position.x + target.box.sides <= this.playarea.x + this.position.x + this.playarea.w
        && target.position.y - target.box.top >= this.playarea.y + this.position.y && target.position.y <= this.playarea.y + this.position.y + this.playarea.h;
        if(result) {
            //is inside playarea -> check for object collision
            for (var i = 0; i < this.objects.length; i++) {
                if (target.position.x - target.box.sides <= this.objects[i].at.x + this.objects[i].box.w + this.position.x && target.position.x + target.box.sides >= this.objects[i].at.x + this.position.x
                && target.position.y - target.box.top <= this.objects[i].at.y + this.position.y && target.position.y >= this.objects[i].at.y - this.objects[i].box.h + this.position.y) {
                    return false;
                }
            }
        }
        return result;
    }
}