import { Sprite } from "./sprite.js";

export const scenes = [
    {
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
    }
];
export var environments = [];
export function initEnvironments(audio) {
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
                            if(!target.possessions.hasItem("hook")){
                                environment.ambient.handler.playSFX("./audio/sfx/ClothesSyntheticfabric2.ogg");
                                target.possessions.items.push({
                                    name: "hook",
                                    fullName: "Rusty fishing hook",
                                    quantity: 1,
                                    img: undefined
                                });
                                target.displayText("Found a fishing hook!", 90, {x: 160, y: 50});
                                target.possessions.journal.push("As I rummaged through the wardrobe, my hand brushed against something cold and rusty, and I recoiled in horror as I pulled out a strange, bloodstained hook.");
                                this.action = function(target, environment) {
                                    target.displayText("Nothing useful anymore...", 90, {x: 160, y: 50});
                                }
                            }
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
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[1].env.loadAt(target, environments[1].env.playerPosition);
                        }
                    },
                    {
                        name: "rightdoor",
                        at: {x: 150, y: 100},
                        box: {h: 20, w: 10},
                        action: function(target, environment) {
                            if(target.possessions.hasKey("bedroom_key")) {
                                environment.ambient.handler.playSFX("./audio/sfx/GateWoodChain1.ogg");
                                target.displayText("Unlocked", 90, {x: 212, y: 90});
                                target.possessions.journal.push("With a sense of relief flooding through me, I inserted the key into the lock and slowly turned it, feeling a rush of excitement and fear as I finally opened the door to the room I had been trapped in for what felt like an eternity.");
                                this.action = function(target, environment) {
                                    environment.ambient.handler.playDoorOpen();
                                    environment.unload();
                                    environments[2].env.loadAt(target, {x:129, y:85});
                                    target.possessions.journal.push("With a trembling hand, I pushed open the door and took a deep breath, steeling myself for whatever lay beyond as I stepped into the unknown.");
                                    this.action = function(target, environment) {
                                        environment.ambient.handler.playDoorOpen();
                                        environment.unload();
                                        environments[2].env.loadAt(target, {x:129, y:85});
                                    };
                                };
                            } else  {
                                environment.ambient.handler.playDoorClose();
                                target.displayText("The door is locked...", 90, {x: 212, y: 90});
                            }
                        }
                    },
                    {
                        name: "drawer",
                        at: {x: 20, y: 112},
                        box: {h: 10, w: 10},
                        action: function(target, environment, ui) {
                            environment.ambient.handler.playSFX("./audio/sfx/PaperDocument1.ogg");
                            for (var i = 0; i < environment.objects.length; i++) {
                                if (environment.objects[i].name == "drawer") {
                                    environment.objects[i].image = "./levels/objects/drawer.png";
                                    environment.removeObjects();
                                    environment.setUpObjects();
                                    environment.loadObjects();
                                    break;
                                }
                            }
                            target.possessions.notes.push({
                                name: "bedroom_note",
                                fullName: "Note from bedroom",
                                icon: undefined,
                                text: undefined,
                                img: "./misc/notes/bedroom_note.png"
                            });
                            target.possessions.journal.push("My heart raced as I unfolded the note and read the obscure instructions, feeling a cold sweat break out on my skin as I realized I was being drawn into a sinister game of cat and mouse.");
                            ui.displayNote(target.possessions.notes[target.possessions.notes.length - 1]);
                            this.action = function() {};
                            return true; //true = pauses the game
                        }
                    }
                ],
                [],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.4
                }
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
                            environment.ambient.handler.playDoorOpen();
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
                            const choices = [
                                {
                                    text: "Yes",
                                    action: function(args) {
                                        args[0].position = {x: -1000, y: -1000};
                                        args[0].sprite.updateSpritePosition(args[0].position);
                                        args[3].displayScene(scenes[0], args[2]);
                                        args[3].displayGameoverText("Bad desicion.", 6);
                                    }
                                },
                                {
                                    text: "No",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ];
                            if(target.possessions.items.length > 0) {
                                const items = [];
                                for (var i = 0; i < target.possessions.items.length; i++) {
                                    if (target.possessions.items[i].name == "hook") {
                                        items.push(
                                            {
                                                text: target.possessions.items[i].fullName,
                                                action: function(args) {
                                                    args[0].possessions.keys.push(
                                                        {
                                                            name: "bedroom_key",
                                                            fullName: "Bloody key",
                                                            text: "Unlocks the master bedroom door",
                                                            quantity: 1,
                                                            img: undefined
                                                        }
                                                    );
                                                    //args[3].displayScene(scenes[0], args[2]);
                                                    args[2].paused = false;
                                                    args[0].possessions.journal.push("The metallic scent of blood filled my nostrils as I plunged the hook I found earlier into the murky water of the bathtub, until it closed around the cold, hard shape of a key at the bottom.");
                                                    args[0].possessions.dropItem("hook");
                                                }
                                            }
                                        );
                                    } else {
                                        items.push(
                                            {
                                                text: target.possessions.items[i].fullName,
                                                action: function(args) {
                                                    args[2].paused = false;
                                                }
                                            }
                                        );
                                    }
                                }
                                items.push(
                                    {
                                        text: "Nothing",
                                        action: function(args) {
                                            args[2].paused = false;
                                        }
                                    }
                                );
                                choices.push(
                                    {
                                        text: "Use item",
                                        action: function(args) {
                                            ui.playerChoice("Which item to use?", items, args);
                                        }
                                    }
                                );
                            }
                            ui.playerChoice("Stick your hand in the bathtub?", choices, [target, environment, game, ui]);
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
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.2
                }
            )
        }
    );
    environments.push(
        {
            name: "house_second_floor",
            env: new Environment(
                "./levels/house_second_floor.png", 
                {w:180,h:123}, 
                {x:0, y:49, w:177, h:74}, 
                {x:128,y:87},
                [
                    //objects
                ],
                [
                    {
                        name: "stairs",
                        at: {x: 140, y: 123},
                        box: {h: 10, w: 22},
                        action: function(target, environment) {
                            environment.unload();
                            environments[6].env.loadAt(target, {x:189, y:129});
                        }
                    }
                ],
                [
                    {
                        name: "door_mb",
                        at: {x: 50, y: 59},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[0].env.loadAt(target, {x:231, y:133});
                        }
                    },
                    {
                        name: "door_balcony",
                        at: {x: 8, y: 59},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[3].env.loadAt(target, environments[3].env.playerPosition);
                        }
                    },
                    {
                        name: "door_kids",
                        at: {x: 142, y: 59},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[4].env.loadAt(target, environments[4].env.playerPosition);
                        }
                    },
                    {
                        name: "door_bathroom",
                        at: {x: 170, y: 68},
                        box: {h: 16, w: 10},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[5].env.loadAt(target, environments[5].env.playerPosition);
                        }
                    }
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.2
                }
            )
        }
    );
    environments.push(
        {
            name: "house_balcony",
            env: new Environment(
                "./levels/house_balcony.png", 
                {w:103,h:71}, 
                {x:0, y:49, w:100, h:22}, 
                {x:200,y:121},
                [
                    //objects
                ],
                [],
                [
                    {
                        name: "door_sf",
                        at: {x: 95, y: 68},
                        box: {h: 16, w: 10},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[2].env.loadAt(target, {x: 88, y:85});
                        }
                    }
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.8
                }
            )
        }
    );
    environments.push(
        {
            name: "house_kids_bedroom",
            env: new Environment(
                "./levels/house_kids_bedroom.png", 
                {w:175,h:121}, 
                {x:0, y:49, w:175, h:68}, 
                {x:99,y:146},
                [
                    //objects
                ],
                [],
                [
                    {
                        name: "door_sf",
                        at: {x: 18, y: 117},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[2].env.loadAt(target, {x:218, y:86});
                        }
                    }
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.4
                }
            )
        }
    );
    environments.push(
        {
            name: "house_general_bathroom",
            env: new Environment(
                "./levels/house_general_bathroom.png", 
                {w:100,h:95}, 
                {x:0, y:49, w:100, h:42}, 
                {x:125,y:133},
                [
                    //objects
                ],
                [],
                [
                    {
                        name: "door_sf",
                        at: {x: 6, y: 91},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[2].env.loadAt(target, {x:238, y:95});
                        }
                    }
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.2
                }
            )
        }
    );
    environments.push(
        {
            name: "house_first_floor",
            env: new Environment(
                "./levels/house_first_floor.png", 
                {w:87,h:167}, 
                {x:4, y:49, w:81, h:115}, 
                {x:189,y:130},
                [
                    //objects
                ],
                [
                    {
                        name: "stairs",
                        at: {x: 60, y: 81},
                        box: {h: 10, w: 22},
                        action: function(target, environment) {
                            environment.unload();
                            environments[2].env.loadAt(target, {x:220, y:111});
                        }
                    }
                ],
                [
                    //toggle triggers
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.2
                }
            )
        }
    );
    environments.push(
        {
            name: "house_save_room",
            env: new Environment(
                "./levels/house_save_room.png", 
                {w:87,h:115}, 
                {x:4, y:49, w:81, h:64}, 
                {x:149,y:146},
                [
                    //objects
                ],
                [],
                [
                    //toggle triggers
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.4
                }
            )
        }
    );
    environments.push(
        {
            name: "house_kitchen",
            env: new Environment(
                "./levels/house_kitchen.png", 
                {w:137,h:115}, 
                {x:0, y:49, w:134, h:64}, 
                {x:217,y:130},
                [
                    //objects
                ],
                [],
                [
                    //toggle triggers
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.4
                }
            )
        }
    );
    environments.push(
        {
            name: "house_dining",
            env: new Environment(
                "./levels/house_dining.png", 
                {w:118,h:180}, 
                {x:0, y:49, w:115, h:132}, 
                {x:160,y:57},
                [
                    //objects
                ],
                [],
                [
                    //toggle triggers
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.4
                }
            )
        }
    );
    environments.push(
        {
            name: "house_office",
            env: new Environment(
                "./levels/house_office.png", 
                {w:107,h:115}, 
                {x:4, y:49, w:105, h:64}, 
                {x:118,y:132},
                [
                    //objects
                ],
                [],
                [
                    //toggle triggers
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.4
                }
            )
        }
    );
    environments.push(
        {
            name: "house_living_room",
            env: new Environment(
                "./levels/house_living_room.png", 
                {w:320,h:180}, 
                {x:0, y:49, w:317, h:131}, 
                {x:308,y:66},
                [
                    //objects
                ],
                [],
                [
                    //toggle triggers
                ],
                [
                    //entities
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.4
                }
            )
        }
    );
}
class Environment {
    //handles level data, backgrounds, objects, etc
    constructor(background, size, playarea, position, objects, autotriggers, toggletriggers, entities, ambient) {
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
        this.visualiseTriggers(this.autotriggers);
        this.toggletriggers = toggletriggers;
        this.visualiseTriggers(this.toggletriggers);
        this.entities = entities;
        this.ambient = ambient;
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
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].sprite.updateSpritePosition({x: -100, y:-100});
        }
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
            if (this.checkInTrigger(this.toggletriggers[i], target, ui, game)) {
                return true;
            }
        }
    }
    checkInTrigger(trigger, target, ui, game) {
        if (target.position.x - target.box.sides <= trigger.at.x + trigger.box.w + this.position.x && target.position.x + target.box.sides >= trigger.at.x + this.position.x
        && target.position.y - target.box.top <= trigger.at.y + this.position.y && target.position.y >= trigger.at.y - trigger.box.h + this.position.y) {
            if(trigger.action(target, this, ui, game)) {
                return true;
            }
        }
    }
    load() {
        playarea.appendChild(this.element);
        this.setUpObjects();
        this.loadObjects();
        this.ambient.handler.playAmbient(this.ambient.ambient, this.ambient.volume);
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