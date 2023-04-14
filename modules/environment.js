import { Boss, Enemy } from "./entity.js";
import { Sprite } from "./sprite.js";
import { saveEnvironments, savePlayerData } from "./save.js";

const playareadark = document.getElementById("playarea-dark");
const dark = playareadark.getContext("2d");
const toDegree = 180 / Math.PI;

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
    //master bedroom
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
                        action: function(target, environment, ui, game) {
                            if(!target.possessions.hasItem("hook")){
                                environment.ambient.handler.playSFX("./audio/sfx/ClothesSyntheticfabric2.ogg");
                                target.possessions.items.push({
                                    name: "hook",
                                    fullName: "Rusty fishing hook",
                                    quantity: 1,
                                    img: "./misc/items/hook.png"
                                });
                                game.paused = true;
                                //no space
                                ui.playerChoice("Found a rusty fishing hook. Might be useful.", [
                                    {
                                        text: "OK",
                                        action: function(args) {
                                            args[2].paused = false;
                                        }
                                    }
                                ], [target, environment, game, ui]);
                                target.possessions.journal.push("As I rummaged through the wardrobe, my hand brushed against something cold and rusty, and I recoiled in horror as I pulled out a strange, bloodstained hook.");
                                this.action = function(target, environment, ui, game) {
                                    target.displayText("Nothing useful anymore...", 90, {x: 160, y: 50});
                                }
                            }
                        }
                    },
                    {
                        name: "window",
                        at: {x: 72, y: 60},
                        box: {h: 10, w: 34},
                        action: function(target, environment, ui, game) {
                            target.displayText("It's dark and raining...", 90, {x: 87, y: 45});
                        }
                    },
                    {
                        name: "topdoor",
                        at: {x: 15, y: 60},
                        box: {h: 10, w: 16},
                        action: function(target, environment, ui, game) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[1].env.loadAt(target, environments[1].env.playerPosition);
                        }
                    },
                    {
                        name: "rightdoor",
                        at: {x: 150, y: 100},
                        box: {h: 20, w: 10},
                        action: function(target, environment, ui, game) {
                            if(target.possessions.hasKey("bedroom_key")) {
                                environment.ambient.handler.playSFX("./audio/sfx/GateWoodChain1.ogg");
                                target.displayText("Unlocked", 90, {x: 212, y: 90});
                                target.possessions.journal.push("With a sense of relief flooding through me, I inserted the key into the lock and slowly turned it, feeling a rush of excitement and fear as I finally opened the door to the room I had been trapped in for what felt like an eternity.");
                                this.action = function(target, environment, ui, game) {
                                    environment.ambient.handler.playDoorOpen();
                                    environment.ambient.handler.playMusic("bg_0", 1);
                                    environment.unload();
                                    environments[2].env.loadAt(target, {x:129, y:85});
                                    target.possessions.journal.push("With a trembling hand, I pushed open the door and took a deep breath, steeling myself for whatever lay beyond as I stepped into the unknown.");
                                    this.action = function(target, environment, ui, game) {
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
                        action: function(target, environment, ui, game) {
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
    //master bathroom
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
                        action: function(target, environment, ui, game) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[0].env.loadAt(target, {x:105, y:90});
                        }
                    },
                    {
                        name: "mirror",
                        at: {x: 65, y: 55},
                        box: {h: 10, w: 10},
                        action: function(target, environment, ui, game) {
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
                                    text: "OK",
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
                                                    ui.playerChoice("Obtained a key.", [
                                                        {
                                                            text: "OK",
                                                            action: function(args) {
                                                                args[2].paused = false;
                                                            }
                                                        }
                                                    ], args);
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
                                                    ui.playerChoice("Can't be used here", [
                                                        {
                                                            text: "OK",
                                                            action: function(args) {
                                                                args[2].paused = false;
                                                            }
                                                        }
                                                    ], args);
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
                            ui.playerChoice("I'm not sticking my hand in that.", choices, [target, environment, game, ui]);
                        }
                    }
                ],
                [
                    {
                        type: "reflection",
                        sprite: new Sprite("./entities/player_basic.png", {x:0, y:0}, {w:32, h:32}),
                        reflectionTop: true,
                        startAtY: 49,
                        offsetX: 32,
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
    //second floor hall
    environments.push(
        {
            name: "house_second_floor",
            env: new Environment(
                "./levels/house_second_floor.png", 
                {w:180,h:123}, 
                {x:0, y:49, w:177, h:74}, 
                {x:128,y:87},
                [
                    {
                        name: "boundary",
                        image: "",
                        at: {x: 0, y: 123},
                        size: {h: 0, w: 0},
                        box: {h: 50, w: 142}
                    },
                    {
                        name: "boundary",
                        image: "",
                        at: {x: 165, y: 123},
                        size: {h: 0, w: 0},
                        box: {h: 50, w: 20}
                    },
                    {
                        name: "railing",
                        image: "./levels/objects/second_floor_railing.png",
                        at: {x: 81, y: 123},
                        size: {h: 64, w: 61},
                        box: {h: 0, w: 0},
                        zIndex: 101
                    },
                    {
                        name: "note",
                        image: "./levels/objects/note_on_the_door.png",
                        at: {x: 145, y: 35},
                        size: {h: 11, w: 10},
                        box: {h: 0, w: 0},
                        zIndex: 50
                    },
                    {
                        name: "door_bg_anim",
                        image: "./levels/objects/balcony_door.gif",
                        at: {x: 10, y: 38},
                        size: {h: 20, w: 14},
                        box: {h: 0, w: 0},
                        zIndex: 0
                    }
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
                        action: function(target, environment, ui, game) {
                            environment.ambient.handler.playSFX("./audio/sfx/PaperDocument1.ogg");
                            for (var i = 0; i < environment.objects.length; i++) {
                                if (environment.objects[i].name == "note") {
                                    environment.objects[i].image = "";
                                    environment.removeObjects();
                                    environment.setUpObjects();
                                    environment.loadObjects();
                                    break;
                                }
                            }
                            target.possessions.notes.push({
                                name: "door_note",
                                fullName: "Note from the door",
                                icon: undefined,
                                text: undefined,
                                img: "./misc/notes/door_note.png"
                            });
                            target.possessions.journal.push("[[add flavour text]]");
                            ui.displayNote(target.possessions.notes[target.possessions.notes.length - 1]);
                            this.action = function(target, environment, ui, game) {
                                game.paused = true;
                                const choices = [
                                    {
                                        text: "Yes",
                                        action: function(args) {
                                            args[1].ambient.handler.playDoorOpen();
                                            args[1].ambient.handler.stopMusic();
                                            args[1].unload();
                                            environments[4].env.loadAt(target, environments[4].env.playerPosition);
                                            args[1].toggletriggers[2].action = function(target, environment, ui, game) {
                                                environment.ambient.handler.playDoorOpen();
                                                environment.ambient.handler.stopMusic();
                                                environment.unload();
                                                environments[4].env.loadAt(target, environments[4].env.playerPosition);
                                            }
                                            args[2].paused = false;
                                        }
                                    },
                                    {
                                        text: "No",
                                        action: function(args) {
                                            args[2].paused = false;
                                        }
                                    }
                                ];
                                ui.playerChoice("Might be dangerous. Enter anyway?", choices, [target, environment, game, ui]);
                            };
                            return true;
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
                    },
                    {
                        name: "paintings",
                        at: {x: 85, y: 55},
                        box: {h: 10, w: 40},
                        action: function(target, environment) {
                            target.displayText("Exquisite art...", 90, {x: 115, y: 40});
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
    //balcony
    environments.push(
        {
            name: "house_balcony",
            env: new Environment(
                "./levels/house_balcony.gif", 
                {w:103,h:71}, 
                {x:2, y:49, w:98, h:22}, 
                {x:200,y:121},
                [
                    {
                        name: "wet_floor",
                        image: "./levels/objects/balcony_floor.png",
                        at: {x: 0, y: 71},
                        size: {h: 22, w: 98},
                        box: {h: 0, w: 0},
                        zIndex: 0
                    },
                    {
                        name: "rain",
                        image: "./levels/objects/rain.gif",
                        at: {x: 0, y: 71},
                        size: {h: 71, w: 103},
                        box: {h: 0, w: 0},
                        zIndex: 999
                    },
                    {
                        name: "blackwall_bugfix",
                        image: "./levels/objects/blackwall.png",
                        at: {x: -5, y: 121},
                        size: {h: 50, w: 108},
                        box: {h: 0, w: 0},
                        zIndex: 3
                    },
                    {
                        name: "railing",
                        image: "./levels/objects/balcony_railing.png",
                        at: {x: -5, y: 71},
                        size: {h: 37, w: 103},
                        box: {h: 0, w: 0},
                        zIndex: 999
                    },
                    {
                        name: "canvas",
                        image: "./levels/objects/canvas.png",
                        at: {x: 0, y: 59},
                        size: {h: 51, w: 18},
                        box: {h: 50, w: 15},
                        zIndex: 100
                    },
                    {
                        name: "drawer",
                        image: "./levels/objects/drawer.png",
                        at: {x: 0, y: 69},
                        size: {h: 20, w: 15},
                        box: {h: 50, w: 15},
                        zIndex: 100
                    },
                    {
                        name: "paint",
                        image: "./levels/objects/drawer_paint.png",
                        at: {x: 0, y: 69},
                        size: {h: 20, w: 15},
                        box: {h: 50, w: 15},
                        zIndex: 150
                    }
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
                    },
                    {
                        name: "supplies",
                        at: {x: 15, y: 68},
                        box: {h: 10, w: 20},
                        action: function(target, environment) {
                            target.displayText("A bunch of luminescent paint...", 90, {x: 15, y: 70});
                        }
                    }
                ],
                [
                    {
                        type: "reflection",
                        sprite: new Sprite("./entities/player_basic.png", {x:0, y:0}, {w:32, h:32}),
                        reflectionTop: false,
                        startAtY: 5,
                        offsetX: 64,
                        zIndex: 2
                    },
                    {
                        type: "lightsource",
                        style: "luminescent",
                        obj: {
                            name: "canvas_light",
                            image: "./levels/objects/canvas_light.png",
                            at: {x: 0, y: 59},
                            size: {h: 51, w: 18}
                        },
                        params: [[225, 130], 15]
                    }
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.8
                },
                true
            )
        }
    );
    //kids bedroom
    environments.push(
        {
            name: "house_kids_bedroom",
            env: new Environment(
                "./levels/house_kids_bedroom.png", 
                {w:175,h:121}, 
                {x:0, y:49, w:175, h:68}, 
                {x:99,y:146},
                [
                    {
                        name: "spotlight",
                        image: "./levels/objects/spotlight.png",
                        at: {x: 63, y: 62},
                        size: {h: 10, w: 10},
                        box: {h: -10, w: -10},
                        zIndex: 92
                    },
                    {
                        name: "uv",
                        image: "./levels/objects/uv_stick.png",
                        at: {x: 145, y: 105},
                        size: {h: 9, w: 15},
                        box: {h: -10, w: -10},
                        zIndex: 138
                    },
                    {
                        name: "bed",
                        image: "./levels/objects/kids_bed.png",
                        at: {x: 45, y: 117},
                        size: {h: 57, w: 31},
                        box: {h: 42, w: 31},
                        zIndex: 180
                    },
                    {
                        name: "wardrobe",
                        image: "./levels/objects/wardrobe.png",
                        at: {x: 145, y: 60},
                        size: {h: 57, w: 34},
                        box: {h: 10, w: 34},
                        zIndex: 90
                    }
                ],
                [
                    {
                        name: "start_encounter",
                        at: {x: 70, y: 80},
                        box: {h: 40, w: 10},
                        action: function(target, environment) {}
                    }
                ],
                [
                    {
                        name: "door_sf",
                        at: {x: 18, y: 117},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.ambient.handler.playMusic("bg_0", 1);
                            environment.unload();
                            environments[2].env.loadAt(target, {x:218, y:86});
                        }
                    },
                    {
                        name: "enemy_pos",
                        at: {x: 17, y: 63},
                        box: {h: 10, w: 10},
                        action: function(target, environment) {
                            target.displayText("What the fuck is this?..", 90, {x: 17, y: 50});
                        }
                    },
                    {
                        name: "uv",
                        at: {x: 147, y: 105},
                        box: {h: 10, w: 10},
                        action: function(target, environment, ui, game) {
                            game.paused = true;
                            const choices = [
                                {
                                    text: "Yes",
                                    action: function(args) {
                                        if(args[0].possessions.items.length < 6) {
                                            //add item to inventory
                                            args[0].possessions.items.push(
                                                {
                                                    name: "uv",
                                                    fullName: "UV Stick",
                                                    text: "Emmits ultraviolet light",
                                                    quantity: 1,
                                                    img: "./misc/items/uv.png",
                                                    equippable: true
                                                }
                                            );
                                            args[1].toggletriggers[1].action = function() {};
                                            args[1].toggletriggers[2].action = function() {};
                                            args[1].autotriggers[0].action = reusableFunctionsCollection.kids_encounter();
                                            args[1].entities[1].style = "";
                                            args[1].entities[2].style = "";
                                            args[1].objects[1].image = "";
                                            args[1].removeObjects();
                                            args[1].setUpObjects();
                                            args[1].loadObjects();
                                            args[1].ambient.handler.playSFX("./audio/sfx/LargeGlassMirrorSmash2.ogg");
                                            args[2].paused = false;
                                            ui.playerChoice("Obtained a light source", [
                                                {
                                                    text: "OK",
                                                    action: function(args) {
                                                        args[2].paused = false;
                                                    }
                                                }
                                            ], args);
                                        } else {
                                            //no space
                                            ui.playerChoice("No space in inventory", [
                                                {
                                                    text: "OK",
                                                    action: function(args) {
                                                        args[2].paused = false;
                                                    }
                                                }
                                            ], [target, environment, game, ui]);
                                        }
                                    }
                                },
                                {
                                    text: "No",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ];
                            ui.playerChoice("Pick up the light source?", choices, [target, environment, game, ui]);
                        }
                    }
                ],
                [
                    {
                        type: "enemy",
                        enemy: new Enemy({x: 0, y: 90}, false)
                    },
                    {
                        type: "lightsource",
                        style: "custom_0",
                        params: [[145, 87], [93, 57], [93, 87]]
                    },
                    {
                        type: "lightsource",
                        style: "uv",
                        params: [[225, 130], 15]
                    }
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.4
                },
                true
            )
        }
    );
    //second floor bathroom
    environments.push(
        {
            name: "house_general_bathroom",
            env: new Environment(
                "./levels/house_general_bathroom.png", 
                {w:100,h:95}, 
                {x:0, y:49, w:100, h:42}, 
                {x:125,y:133},
                [
                    {
                        name: "mirror_bg",
                        image: "./levels/objects/mirror_bg.png",
                        at: {x: 14, y: 31},
                        size: {h: 21, w: 30},
                        box: {h: 0, w: 0},
                        zIndex: 0
                    },
                    {
                        name: "mirror_crack",
                        image: "./levels/objects/mirror_crack.png",
                        at: {x: 14, y: 31},
                        size: {h: 21, w: 30},
                        box: {h: 0, w: 0},
                        zIndex: -5
                    },
                    {
                        name: "blackwall_bugfix_top",
                        image: "./levels/objects/blackwall.png",
                        at: {x: -5, y: 0},
                        size: {h: 50, w: 108},
                        box: {h: 0, w: 0},
                        zIndex: 999
                    },
                    {
                        name: "blackwall_bugfix_left",
                        image: "./levels/objects/blackwall.png",
                        at: {x: -10, y: 100},
                        size: {h: 100, w: 10},
                        box: {h: 0, w: 0},
                        zIndex: 999
                    },
                    {
                        name: "blackwall_bugfix_right",
                        image: "./levels/objects/blackwall.png",
                        at: {x: 100, y: 100},
                        size: {h: 100, w: 10},
                        box: {h: 0, w: 0},
                        zIndex: 999
                    },
                    {
                        name: "bathtub",
                        image: "./levels/objects/bathtub_2.png",
                        at: {x: 50, y: 90},
                        size: {h: 19, w: 49},
                        box: {h: 10, w: 50},
                        zIndex: 300
                    }
                ],
                [
                    {
                        name: "mirror",
                        at: {x: 15, y: 60},
                        box: {h: 10, w: 30},
                        action: function(target, environment, ui) {
                            environment.ambient.handler.playSFX("./audio/sfx/glasscrack.ogg");
                            for (var i = 0; i < environment.objects.length; i++) {
                                if (environment.objects[i].name == "mirror_crack") {
                                    environment.objects[i].zIndex = 6;
                                    environment.removeObjects();
                                    environment.setUpObjects();
                                    environment.loadObjects();
                                    break;
                                }
                            }
                            this.action = function() {};
                        }
                    }
                ],
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
                    },
                    {
                        name: "bathtub",
                        at: {x: 55, y: 75},
                        box: {h: 10, w: 40},
                        action: function(target, environment) {
                            target.displayText("Empty...", 90, {x: 155, y: 115});
                        }
                    },
                    {
                        name: "fusebox",
                        at: {x: 77, y: 60},
                        box: {h: 10, w: 10},
                        action: reusableFunctionsCollection.fuse_0()
                    }
                ],
                [
                    {
                        type: "reflection",
                        sprite: new Sprite("./entities/player_basic.png", {x:0, y:0}, {w:32, h:32}),
                        reflectionTop: true,
                        startAtY: 42,
                        offsetX: 130,
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
    //first floor foyer
    environments.push(
        {
            name: "house_first_floor",
            env: new Environment(
                "./levels/house_first_floor.png", 
                {w:87,h:167}, 
                {x:4, y:49, w:81, h:115}, 
                {x:189,y:130},
                [
                    {
                        name: "boundary",
                        image: "",
                        at: {x: 60, y: 71},
                        size: {h: 50, w: 50},
                        box: {h: 50, w: 50}
                    },
                    {
                        name: "boundary",
                        image: "",
                        at: {x: 60, y: 121},
                        size: {h: 50, w: 1},
                        box: {h: 50, w: 1},
                        zIndex: 999
                    },
                    {
                        name: "umbrella",
                        image: "./levels/objects/umbrella_stand.png",
                        at: {x: 48, y: 120},
                        size: {h: 31, w: 9},
                        box: {h: 3, w: 9},
                        zIndex: 123
                    }
                ],
                [
                    {
                        name: "stairs",
                        at: {x: 60, y: 81},
                        box: {h: 10, w: 22},
                        action: function(target, environment) {
                            environment.unload();
                            environments[2].env.loadAt(target, {x:222, y:111});
                        }
                    }
                ],
                [
                    {
                        name: "door_saveroom",
                        at: {x: 24, y: 59},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.unload();
                            environments[7].env.loadAt(target, {x:150, y:145});
                        }
                    },
                    {
                        name: "door_front",
                        at: {x: 28, y: 162},
                        box: {h: 10, w: 32},
                        action: function(target, environment) {
                            target.displayText("Locked...", 90, {x: 125, y: 170});
                        }
                    },
                    {
                        name: "door_dining",
                        at: {x: 5, y: 153},
                        box: {h: 16, w: 10},
                        action: function(target, environment) {
                            target.displayText("Can't be opened...", 90, {x: 6, y: 130});
                        }
                    },
                    {
                        name: "door_living",
                        at: {x: 72, y: 153},
                        box: {h: 16, w: 10},
                        action: function(target, environment) {
                            target.displayText("Blocked from the other side...", 90, {x: 165, y: 130});
                        }
                    },
                    {
                        name: "umbrella",
                        at: {x: 42, y: 125},
                        box: {h: 20, w: 15},
                        action: function(target, environment, ui, game) {
                            game.paused = true;
                            const choices = [
                                {
                                    text: "Yes",
                                    action: function(args) {
                                        if(args[0].possessions.items.length < 6) {
                                            //add item to inventory
                                            args[0].possessions.items.push(
                                                {
                                                    name: "umbrella",
                                                    fullName: "Umbrella",
                                                    text: "Can be used to as a weapon",
                                                    quantity: 1,
                                                    img: "./misc/items/umbrella.png",
                                                    equippable: true
                                                }
                                            );
                                            ui.playerChoice("Obtained a weapon", [
                                                {
                                                    text: "OK",
                                                    action: function(args) {
                                                        args[2].paused = false;
                                                    }
                                                }
                                            ], args);
                                            for (var i = 0; i < args[1].objects.length; i++) {
                                                if (args[1].objects[i].name == "umbrella") {
                                                    args[1].objects[i].image = "./levels/objects/umbrella_stand_empty.png";
                                                    args[1].removeObjects();
                                                    args[1].setUpObjects();
                                                    args[1].loadObjects();
                                                    break;
                                                }
                                            }
                                            args[1].toggletriggers[4].action = function() {};
                                        } else {
                                            //no space
                                            ui.playerChoice("No space in inventory", [
                                                {
                                                    text: "OK",
                                                    action: function(args) {
                                                        args[2].paused = false;
                                                    }
                                                }
                                            ], [target, environment, game, ui]);
                                        }
                                    }
                                },
                                {
                                    text: "No",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ];
                            ui.playerChoice("The umbrella seems sturdy enough to be used as a weapon. Take it?", choices, [target, environment, game, ui]);
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
    //save room
    environments.push(
        {
            name: "house_save_room",
            env: new Environment(
                "./levels/house_save_room.png", 
                {w:87,h:115}, 
                {x:4, y:49, w:81, h:64}, 
                {x:149,y:146},
                [
                    {
                        name: "rain",
                        image: "./levels/objects/rain.gif",
                        at: {x: 5, y: 50},
                        size: {h: 50, w: 80},
                        box: {h: 0, w: 0},
                        zIndex: 0
                    },
                    {
                        name: "table",
                        image: "./levels/objects/breakfast_table.png",
                        at: {x: 5, y: 65},
                        size: {h: 29, w: 40},
                        box: {h: 29, w: 40},
                        zIndex: 10
                    },
                    {
                        name: "music_box",
                        image: "./levels/objects/music_box_closed.png",
                        at: {x: 20, y: 48},
                        size: {h: 12, w: 16},
                        box: {h: 0, w: 0},
                        zIndex: 12
                    },
                    {
                        name: "easel",
                        image: "./levels/objects/easel.png",
                        at: {x: 57, y: 57},
                        size: {h: 39, w: 18},
                        box: {h: 5, w: 18},
                        zIndex: 90
                    },
                    {
                        name: "computer",
                        image: "./levels/objects/computer.png",
                        at: {x: 62, y: 80},
                        size: {h: 20, w: 21},
                        box: {h: 5, w: 21},
                        zIndex: 110
                    }
                ],
                [],
                [
                    {
                        name: "door_office",
                        at: {x: 73, y: 98},
                        box: {h: 16, w: 10},
                        action: function(target, environment, ui, game) {
                            target.displayText("The lock is connected to the terminal...", 90, {x: 170, y: 95});
                        }
                    },
                    {
                        name: "door_kitchen",
                        at: {x: 4, y: 98},
                        box: {h: 16, w: 10},
                        action: function(target, environment, ui, game) {
                            environment.ambient.handler.playDoorOpen();
                            environment.ambient.handler.playMusic("bg_0", 1);
                            environment.unload();
                            environments[8].env.loadAt(target, environments[8].env.playerPosition);
                        }
                    },
                    {
                        name: "door_foyer",
                        at: {x: 24, y: 112},
                        box: {h: 10, w: 16},
                        action: function(target, environment, ui, game) {
                            environment.ambient.handler.playDoorOpen();
                            environment.ambient.handler.playMusic("bg_0", 1);
                            environment.unload();
                            environments[6].env.loadAt(target, {x: 149, y: 64});
                        }
                    },
                    {
                        name: "music_box",
                        at: {x: 20, y: 70},
                        box: {h: 10, w: 10},
                        action: function(target, environment, ui, game) {
                            environment.ambient.handler.playSFX("./audio/sfx/PlasticBox1.ogg");
                            for (var i = 0; i < environment.objects.length; i++) {
                                if (environment.objects[i].name == "music_box") {
                                    environment.objects[i].image = "./levels/objects/music_box_opened.png";
                                    environment.removeObjects();
                                    environment.setUpObjects();
                                    environment.loadObjects();
                                    break;
                                }
                            }
                            environment.ambient.handler.playMusic("save", 1);
                            //set music box audio for the doors
                            environments[6].env.toggletriggers[0].action = function(target, environment, ui, game) {
                                environment.ambient.handler.playDoorOpen();
                                environment.ambient.handler.playMusic("save", 1);
                                environment.unload();
                                environments[7].env.loadAt(target, {x:150, y:145});
                            }
                            environments[8].env.toggletriggers[0].action = function(target, environment, ui, game) {
                                environment.ambient.handler.playDoorOpen();
                                environment.ambient.handler.playMusic("save", 1);
                                environment.unload();
                                environments[7].env.loadAt(target, {x: 150, y: 130});
                            }
                            environments[10].env.toggletriggers[0].action = function(target, environment, ui, game) {
                                environment.ambient.handler.playDoorOpen();
                                environment.ambient.handler.playMusic("save", 1);
                                environment.unload();
                                environments[7].env.loadAt(target, {x: 180, y: 130});
                            }
                            this.action = function(target, environment, ui, game) {
                                //save game function
                                game.paused = true;
                                const choices = [
                                    {
                                        text: "Yes",
                                        action: function(args) {
                                            savePlayerData(args[2].player);
                                            saveEnvironments(environments);
                                            args[2].paused = false;
                                        }
                                    },
                                    {
                                        text: "No",
                                        action: function(args) {
                                            args[2].paused = false;
                                        }
                                    }
                                ];
                                ui.playerChoice("Do you want to save your progress?", choices, [target, environment, game, ui]);
                            };
                        }
                    },
                    {
                        name: "computer",
                        at: {x: 55, y: 85},
                        box: {h: 10, w: 10},
                        action: reusableFunctionsCollection.fuse_terminal_0()
                    },
                    {
                        name: "easel",
                        at: {x: 57, y: 65},
                        box: {h: 10, w: 10},
                        action: function(target, environment, ui, game) {
                            target.displayText("A portrait in a round frame...", 90, {x: 87, y: 45});
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
    //kitchen
    environments.push(
        {
            name: "house_kitchen",
            env: new Environment(
                "./levels/house_kitchen.png", 
                {w:137,h:115}, 
                {x:0, y:49, w:134, h:64}, 
                {x:217,y:130},
                [
                    {
                        name: "rain",
                        image: "./levels/objects/rain.gif",
                        at: {x: 5, y: 50},
                        size: {h: 50, w: 120},
                        box: {h: 0, w: 0},
                        zIndex: 0
                    },
                    {
                        name: "wall",
                        image: "./levels/objects/kitchen_wall.png",
                        at: {x: 0, y: 56},
                        size: {h: 47, w: 66},
                        box: {h: 47, w: 66},
                        zIndex: 56
                    },
                    {
                        name: "fridge",
                        image: "./levels/objects/fridge.png",
                        at: {x: 67, y: 56},
                        size: {h: 41, w: 16},
                        box: {h: 41, w: 16},
                        zIndex: 56
                    },
                    {
                        name: "kitchen_top",
                        image: "./levels/objects/kitchen_top.png",
                        at: {x: 20, y: 90},
                        size: {h: 32, w: 65},
                        box: {h: 13, w: 65},
                        zIndex: 110
                    },
                    {
                        name: "pills",
                        image: "./misc/items/pills.png",
                        at: {x: 20, y: 68},
                        size: {h: 8, w: 8},
                        box: {h: -10, w: -10},
                        zIndex: 120
                    }
                ],
                [],
                [
                    {
                        name: "door_saveroom",
                        at: {x: 125, y: 98},
                        box: {h: 16, w: 10},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.ambient.handler.playMusic("bg_0", 1);
                            environment.unload();
                            environments[7].env.loadAt(target, {x: 150, y: 130});
                        }
                    },
                    {
                        name: "door_dining",
                        at: {x: 58, y: 113},
                        box: {h: 10, w: 16},
                        action: function(target, environment, ui, game) {
                            game.paused = true;
                            const choices = [
                                {
                                    text: "Yes",
                                    action: function(args) {
                                        args[1].ambient.handler.playDoorOpen();
                                        args[1].unload();
                                        environments[9].env.loadAt(target, environments[9].env.playerPosition);
                                        args[1].toggletriggers[1].action = function(target, environment, ui, game) {
                                            environment.ambient.handler.playDoorOpen();
                                            environment.unload();
                                            environments[9].env.loadAt(target, environments[9].env.playerPosition);
                                        }
                                        args[2].paused = false;
                                    }
                                },
                                {
                                    text: "No",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ];
                            ui.playerChoice("There's no light in the next room. Prepared to go inside?", choices, [target, environment, game, ui]);
                        }
                    },
                    {
                        name: "fridge",
                        at: {x: 63, y: 63},
                        box: {h: 10, w: 20},
                        action: function(target, environment, ui, game) {
                            target.displayText("Empty...", 90, {x: 145, y: 55});
                        }
                    },
                    {
                        name: "pills",
                        at: {x: 13, y: 95},
                        box: {h: 20, w: 20},
                        action: function(target, environment, ui, game) {
                            if(target.possessions.items.length < 6) {
                                //add item to inventory
                                target.possessions.items.push(
                                    {
                                        name: "pills",
                                        fullName: "Pills",
                                        text: "Restore your health",
                                        quantity: 1,
                                        img: "./misc/items/pills.png",
                                        heal: 40
                                    }
                                );
                                game.paused = true;
                                ui.playerChoice("Obtained a healing item", [
                                    {
                                        text: "OK",
                                        action: function(args) {
                                            args[2].paused = false;
                                        }
                                    }
                                ], [target, environment, game, ui]);
                                this.action = function() {};
                                for (var i = 0; i < environment.objects.length; i++) {
                                    if (environment.objects[i].name == "pills") {
                                        environment.objects[i].image = "";
                                        environment.removeObjects();
                                        environment.setUpObjects();
                                        environment.loadObjects();
                                        break;
                                    }
                                }
                            } else {
                                game.paused = true;
                                //no space
                                ui.playerChoice("No space in inventory", [
                                    {
                                        text: "OK",
                                        action: function(args) {
                                            args[2].paused = false;
                                        }
                                    }
                                ], [target, environment, game, ui]);
                            }
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
    //dining room
    environments.push(
        {
            name: "house_dining",
            env: new Environment(
                "./levels/house_dining.png", 
                {w:118,h:180}, 
                {x:0, y:49, w:115, h:132}, 
                {x:160,y:57},
                [
                    {
                        name: "switch",
                        image: "./levels/objects/switch.png",
                        at: {x: 35, y: 42},
                        size: {h: 10, w: 7},
                        box: {h: -10, w: -10},
                        zIndex: 40
                    },
                    {
                        name: "hint",
                        image: "",
                        at: {x: 17, y: 33},
                        size: {h: 18, w: 12},
                        box: {h: -10, w: -10},
                        zIndex: 40
                    },
                    {
                        name: "table",
                        image: "./levels/objects/dining_table.png",
                        at: {x: 40, y: 155},
                        size: {h: 87, w: 34},
                        box: {h: 70, w: 34},
                        zIndex: 154
                    },
                    {
                        name: "barricade",
                        image: "./levels/objects/barricade.png",
                        at: {x: 63, y: 135},
                        size: {h: 34, w: 50},
                        box: {h: 10, w: 50},
                        zIndex: 125
                    },
                    {
                        name: "chair0",
                        image: "./levels/objects/chair_0.png",
                        at: {x: 28, y: 105},
                        size: {h: 28, w: 12},
                        box: {h: 10, w: 12},
                        zIndex: 95
                    },
                    {
                        name: "chair1",
                        image: "./levels/objects/chair_1.png",
                        at: {x: 0, y: 140},
                        size: {h: 13, w: 26},
                        box: {h: 5, w: 10},
                        zIndex: 135
                    }
                ],
                [
                    {
                        name: "wake_enemy_0",
                        at: {x: 75, y: 95},
                        box: {h: 10, w: 40},
                        action: function(target, environment, ui, game) {
                            environment.entities[1].enemy.toggleActive(true);
                            game.sound.playMusic("fight_0", 1);
                            environment.autotriggers[0].action = function() {};
                        }
                    },
                    {
                        name: "wake_enemy_1",
                        at: {x: 0, y: 140},
                        box: {h: 10, w: 40},
                        action: function(target, environment, ui, game) {
                            environment.entities[2].enemy.toggleActive(true);
                            game.sound.playMusic("fight_0", 1);
                            environment.autotriggers[1].action = function() {};}
                    }
                ],
                [
                    {
                        name: "door_kitchen",
                        at: {x: 57, y: 59},
                        box: {h: 10, w: 10},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            game.sound.playMusic("bg_0", 1);
                            environment.unload();
                            environments[8].env.loadAt(target, {x:159, y:144});
                        }
                    },
                    {
                        name: "switch",
                        at: {x: 33, y: 59},
                        box: {h: 10, w: 10},
                        action: reusableFunctionsCollection.switch_0()
                    },
                    {
                        name: "fusebox",
                        at: {x: 93, y: 155},
                        box: {h: 20, w: 20},
                        action: reusableFunctionsCollection.fuse_d_0()
                    }
                ],
                [
                    {
                        type: "lightsource",
                        style: "uv",
                        params: [[138, 38], 15]
                    },
                    {
                        type: "enemy",
                        enemy: new Enemy({x: 37, y: 120}, false, {x: 40, y: 30})
                    },
                    {
                        type: "enemy",
                        enemy: new Enemy({x: -70, y: 165}, false, {x: 75, y: 32})
                    }
                ],
                {
                    handler: audio,
                    ambient: "./audio/ambient/rain_loop.mp3",
                    volume: 0.4
                },
                true
            )
        }
    );
    //office
    environments.push(
        {
            name: "house_office",
            env: new Environment(
                "./levels/house_office.png", 
                {w:107,h:115}, 
                {x:4, y:49, w:105, h:64}, 
                {x:118,y:132},
                [
                    {
                        name: "rain",
                        image: "./levels/objects/rain.gif",
                        at: {x: 5, y: 50},
                        size: {h: 50, w: 60},
                        box: {h: 0, w: 0},
                        zIndex: 0
                    },
                    {
                        name: "bookshelf",
                        image: "./levels/objects/bookshelf.png",
                        at: {x: 70, y: 60},
                        size: {h: 56, w: 36},
                        box: {h: 10, w: 36},
                        zIndex: 90
                    },
                    {
                        name: "office_table",
                        image: "./levels/objects/office_table.png",
                        at: {x: 33, y: 90},
                        size: {h: 36, w: 74},
                        box: {h: 11, w: 74},
                        zIndex: 124
                    },
                    {
                        name: "pills",
                        image: "./misc/items/pills.png",
                        at: {x: 35, y: 68},
                        size: {h: 8, w: 8},
                        box: {h: -10, w: -10},
                        zIndex: 125
                    }
                ],
                [],
                [
                    {
                        name: "door_saveroom",
                        at: {x: 2, y: 98},
                        box: {h: 16, w: 10},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.ambient.handler.playMusic("bg_0", 1);
                            environment.unload();
                            environments[7].env.loadAt(target, {x: 180, y: 130});
                        }
                    },
                    {
                        name: "door_livingroom",
                        at: {x: 23, y: 115},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            environment.ambient.handler.playDoorOpen();
                            environment.ambient.handler.playMusic("bg_0", 1);
                            environment.unload();
                            environments[11].env.loadAt(target, {x: 308, y: 67});
                        }
                    },
                    {
                        name: "shelf",
                        at: {x: 70, y: 70},
                        box: {h: 10, w: 34},
                        action: function(target, environment, ui, game) {
                            target.displayText("Nothing useful for me...", 90, {x: 105, y: 58});
                        }
                    },
                    {
                        name: "desk",
                        at: {x: 50, y: 80},
                        box: {h: 10, w: 34},
                        action: function(target, environment, ui, game) {
                            target.displayText("Desk...", 90, {x: 155, y: 98});
                        }
                    },
                    {
                        name: "pills",
                        at: {x: 28, y: 95},
                        box: {h: 20, w: 20},
                        action: function(target, environment, ui, game) {
                            if(target.possessions.items.length < 6) {
                                //add item to inventory
                                target.possessions.items.push(
                                    {
                                        name: "pills",
                                        fullName: "Pills",
                                        text: "Restore your health",
                                        quantity: 1,
                                        img: "./misc/items/pills.png",
                                        heal: 60
                                    }
                                );
                                game.paused = true;
                                ui.playerChoice("Obtained a healing item", [
                                    {
                                        text: "OK",
                                        action: function(args) {
                                            args[2].paused = false;
                                        }
                                    }
                                ], [target, environment, game, ui]);
                                this.action = function() {};
                                for (var i = 0; i < environment.objects.length; i++) {
                                    if (environment.objects[i].name == "pills") {
                                        environment.objects[i].image = "";
                                        environment.removeObjects();
                                        environment.setUpObjects();
                                        environment.loadObjects();
                                        break;
                                    }
                                }
                            } else {
                                game.paused = true;
                                //no space
                                ui.playerChoice("No space in inventory", [
                                    {
                                        text: "OK",
                                        action: function(args) {
                                            args[2].paused = false;
                                        }
                                    }
                                ], [target, environment, game, ui]);
                            }
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
    //living room
    environments.push(
        {
            name: "house_living_room",
            env: new Environment(
                "./levels/house_living_room_alt.png", 
                {w:320,h:180}, 
                {x:0, y:49, w:317, h:131}, 
                {x:308,y:66},
                [
                    {
                        name: "column",
                        image: "./levels/objects/column.png",
                        at: {x: 90, y: 85},
                        size: {h: 58, w: 11},
                        box: {h: 6, w: 11},
                        zIndex: 80
                    },
                    {
                        name: "column",
                        image: "./levels/objects/column.png",
                        at: {x: 90, y: 160},
                        size: {h: 58, w: 11},
                        box: {h: 6, w: 11},
                        zIndex: 155
                    },
                    {
                        name: "column",
                        image: "./levels/objects/column.png",
                        at: {x: 225, y: 85},
                        size: {h: 58, w: 11},
                        box: {h: 6, w: 11},
                        zIndex: 80
                    },
                    {
                        name: "column",
                        image: "./levels/objects/column.png",
                        at: {x: 225, y: 160},
                        size: {h: 58, w: 11},
                        box: {h: 6, w: 11},
                        zIndex: 155
                    },
                    {
                        name: "key_holder",
                        image: "./levels/objects/key_holder.png",
                        at: {x: 155, y: 118},
                        size: {h: 17, w: 7},
                        box: {h: 0, w: 0},
                        zIndex: 125
                    }
                ],
                [],
                [
                    {
                        name: "door_office",
                        at: {x: 305, y: 69},
                        box: {h: 16, w: 10},
                        action: function(target, environment, ui, game) {
                            game.paused = true;
                            //no space
                            ui.playerChoice("No going back now", [
                                {
                                    text: "OK",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], [target, environment, game, ui]);
                        }
                    },
                    {
                        name: "door_foyer",
                        at: {x: 30, y: 59},
                        box: {h: 10, w: 16},
                        action: function(target, environment, ui, game) {
                            game.paused = true;
                            //no space
                            ui.playerChoice("Need a key to unlock", [
                                {
                                    text: "OK",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], [target, environment, game, ui]);
                        }
                    },
                    {
                        name: "central",
                        at: {x: 150, y: 125},
                        box: {h: 20, w: 20},
                        action: function(target, environment, ui, game) {
                            game.paused = true;
                            //no space
                            ui.playerChoice("Take the key from the hand?", [
                                {
                                    text: "Yes",
                                    action: function(args) {
                                        args[0].possessions.keys.push(
                                            {
                                                name: "house_key",
                                                fullName: "House key",
                                                text: "Unlocks the front door",
                                                quantity: 1,
                                                img: undefined
                                            }
                                        );
                                        for (var i = 0; i < environment.objects.length; i++) {
                                            if (environment.objects[i].name == "key_holder") {
                                                environment.objects[i].image = "";
                                                environment.objects[i].at = {x: -100, y: -100};
                                                environment.removeObjects();
                                                environment.setUpObjects();
                                                environment.loadObjects();
                                                break;
                                            }
                                        }
                                        ui.playerChoice("Obtained a key.", [
                                            {
                                                text: "OK",
                                                action: function(args) {
                                                    args[1].entities.push({
                                                        type: "enemy",
                                                        enemy: new Boss({x: -200, y: 120}, true, {x: 208, y: 32})
                                                    });
                                                    args[2].sound.playMusic("boss", 0.8);
                                                    args[1].toggletriggers[1].action = function(target, environment, ui, game) {
                                                        game.paused = true;
                                                        ui.playerChoice("Now is not the time", [
                                                            {
                                                                text: "OK",
                                                                action: function(args) {
                                                                    args[2].paused = false;
                                                                }
                                                            }
                                                        ], [target, environment, game, ui]);
                                                    };
                                                    args[1].toggletriggers[2].action = function() {};
                                                    args[2].paused = false;
                                                }
                                            }
                                        ], args);
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
                        type: "lightsource",
                        style: "light",
                        params: [[160, 110], 69]
                    },
                    {
                        type: "lightsource",
                        style: "light",
                        params: [[95, 60], 35]
                    },
                    {
                        type: "lightsource",
                        style: "light",
                        params: [[230, 60], 35]
                    },
                    {
                        type: "lightsource",
                        style: "light",
                        params: [[95, 135], 35]
                    },
                    {
                        type: "lightsource",
                        style: "light",
                        params: [[230, 135], 35]
                    },
                    {
                        type: "lightsource",
                        style: "light",
                        params: [[37, 37], 0]
                    }
                ],
                {
                    handler: audio,
                    ambient: "./audio/music/Long_Distorted_Ambient.ogg",
                    volume: 0.4
                },
                true
            )
        }
    );
    window.environments = environments;
    window.reusableFunctionsCollection = reusableFunctionsCollection;
}
class Environment {
    //handles level data, backgrounds, objects, etc
    constructor(background, size, playarea, position, objects, autotriggers, toggletriggers, entities, ambient, overlay) {
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
        //this.visualiseTriggers(this.autotriggers);
        this.toggletriggers = toggletriggers;
        //this.visualiseTriggers(this.toggletriggers);
        this.entities = entities;
        this.ambient = ambient;
        this.overlay = overlay;
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
            elem.style.backgroundSize = `cover`;
            this.objects_elems.push(elem);
        }
    }
    removeObjects() {
        for (var i = 0; i < this.objects_elems.length; i++) {
            this.objects_elems[i].remove();
        }
        this.objects_elems = [];
        for (var i = 0; i < this.entities.length; i++) {
            switch(this.entities[i].type) {
                case "enemy":
                    this.entities[i].enemy.sprite.updateSpritePosition({x: -100, y:-100});
                    this.entities[i].enemy.freeze(true);
                    break;
                case "lightsource":
                    break;
                case "reflection":
                default:
                    this.entities[i].sprite.updateSpritePosition({x: -100, y:-100});
                    break;
            }
        }
    }
    loadObjects() {
        for (var i = 0; i < this.objects_elems.length; i++) {
            playarea.appendChild(this.objects_elems[i]);
        }
        for (var i = 0; i < this.entities.length; i++) {
            switch(this.entities[i].type) {
                case "enemy":
                    this.entities[i].enemy.freeze(false);
                    break;
                default:
                    break;
            }
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
    loadOverlay() {
        if (this.overlay) {
            dark.fillStyle = "black";
            dark.fillRect(0,0,320,180);
            dark.save();
        } else {
            dark.clearRect(0, 0, 320, 180);
        }
    }
    updateOverlay(player) {
        //fill in the space
        dark.globalCompositeOperation = "source-over";
        dark.fillStyle = "black";
        dark.fillRect(0,0,320,180);
        //draw player sources
        dark.globalCompositeOperation = "destination-out";
        const plx = player.position.x;
        const ply = player.position.y - 16;
        var grad;
        if (player.possessions.equipped && player.possessions.equipped.name == "uv") {
            grad = dark.createRadialGradient(plx,ply,0,plx,ply,40);
            grad.addColorStop(0,"black");
            grad.addColorStop(1,"transparent");
            dark.fillStyle = grad;
            dark.fillRect(0,0,320,180);
            dark.globalCompositeOperation = "source-over";
            grad.addColorStop(0,"rgba(125,50,255,0.5)");
            grad.addColorStop(1,"transparent");
            dark.fillStyle = grad;
            dark.fillRect(0,0,320,180);
            dark.globalCompositeOperation = "destination-out";
        } else {
            grad = dark.createRadialGradient(plx,ply,0,plx,ply,20);
            grad.addColorStop(0,"black");
            grad.addColorStop(1,"transparent");
            dark.fillStyle = grad;
            dark.fillRect(0,0,320,180);
        }
        //draw entity sources
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].type == "lightsource") {
                dark.beginPath();
                switch(this.entities[i].style) {
                    case "custom_0":
                        dark.moveTo(...this.entities[i].params[0]);
                        dark.lineTo(...this.entities[i].params[2]);
                        dark.bezierCurveTo(80, 77, 80, 67, ...this.entities[i].params[1]);
                        dark.lineTo(...this.entities[i].params[0]);
                        dark.fillStyle = "rgba(0,0,0,0.5)";
                        dark.fill();
                        grad = dark.createRadialGradient(this.entities[i].params[0][0] - 5, this.entities[i].params[0][1],1,this.entities[i].params[0][0] - 5, this.entities[i].params[0][1],10);
                        grad.addColorStop(0,"rgba(0,0,0,0.5)");
                        grad.addColorStop(1,"transparent");
                        dark.fillStyle = grad;
                        dark.fillRect(0,0,320,180);
                        break;
                    case "uv":
                        grad = dark.createRadialGradient(...this.entities[i].params[0],0,...this.entities[i].params[0],this.entities[i].params[1]);
                        grad.addColorStop(0,"black");
                        grad.addColorStop(1,"transparent");
                        dark.fillStyle = grad;
                        dark.fillRect(0,0,320,180);
                        dark.globalCompositeOperation = "source-over";
                        grad.addColorStop(0,"rgba(125,50,255,0.5)");
                        grad.addColorStop(1,"transparent");
                        dark.fillStyle = grad;
                        dark.fillRect(0,0,320,180);
                        dark.globalCompositeOperation = "destination-out";
                        break;
                    case "luminescent":
                        dark.clearRect(0,0,320,180);
                        if (player.possessions.equipped && player.possessions.equipped.name == "uv") {
                            const ent = this.entities[i].obj;
                            const corrpos = this.position;
                            const img = new Image();
                            img.onload = function() {
                                dark.globalCompositeOperation = "source-over";
                                dark.drawImage(img, ent.at.x + corrpos.x, ent.at.y + corrpos.y - ent.size.h);
                                dark.globalCompositeOperation = "destination-in";
                                grad = dark.createRadialGradient(plx,ply,35,plx,ply,40);
                                grad.addColorStop(0,"black");
                                grad.addColorStop(1,"transparent");
                                dark.fillStyle = grad;
                                dark.fillRect(0,0,320,180);
                                dark.globalCompositeOperation = "destination-out";
                            }
                            img.src = ent.image;
                        }
                        break;
                    case "light":
                        grad = dark.createRadialGradient(...this.entities[i].params[0],0,...this.entities[i].params[0],this.entities[i].params[1]);
                        grad.addColorStop(0,"black");
                        grad.addColorStop(1,"transparent");
                        dark.fillStyle = grad;
                        dark.fillRect(0,0,320,180);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    load() {
        playarea.appendChild(this.element);
        this.setUpObjects();
        this.loadObjects();
        this.ambient.handler.playAmbient(this.ambient.ambient, this.ambient.volume);
        this.loadOverlay();
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
            //check for enemy collision
            const correctionEnemy = {
                x: this.position.x + 16
            }
            for (var i = 0; i < this.entities.length; i++) {
                if(this.entities[i].type == "enemy") {
                    if (target.position.x - target.box.sides <= this.entities[i].enemy.position.x + this.entities[i].enemy.box.sides + correctionEnemy.x + 8
                    && target.position.x + target.box.sides >= this.entities[i].enemy.position.x + this.entities[i].enemy.box.sides + correctionEnemy.x
                    && target.position.y - target.box.top <= this.entities[i].enemy.position.y 
                    && target.position.y >= this.entities[i].enemy.position.y - this.entities[i].enemy.box.top) {
                        return false;
                    }
                }
            }
        }
        return result;
    }
}

/*
ADDITIONAL FUNCTIONS
*/

const reusableFunctionsCollection = {
    fuse_0: function() {
        return function(target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: "Yes",
                    action: function(args) {
                        if(args[0].possessions.items.length < 6) {
                            //add item to inventory
                            args[0].possessions.items.push(
                                {
                                    name: "fuse",
                                    fullName: "Fuse",
                                    text: "Protect against excessive current",
                                    quantity: 1,
                                    img: "./misc/items/fuse.png"
                                }
                            );
                            args[1].toggletriggers[2].action = reusableFunctionsCollection.fuse_1();
                            args[1].overlay = true;
                            args[1].loadOverlay();
                            args[2].paused = false;
                        } else {
                            //no space
                            ui.playerChoice("No space in inventory", [
                                {
                                    text: "OK",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], [target, environment, game, ui]);
                        }
                    }
                },
                {
                    text: "No",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ];
            ui.playerChoice("Remove fuse from the box?", choices, [target, environment, game, ui]);
        }
    },
    fuse_1: function() {
        return function(target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: "Yes",
                    action: function(args) {
                        if(args[0].possessions.hasItem("fuse")) {
                            //add item to inventory
                            args[0].possessions.dropItem("fuse");
                            args[1].toggletriggers[2].action = reusableFunctionsCollection.fuse_0();
                            args[1].overlay = false;
                            args[1].loadOverlay();
                            args[2].paused = false;
                        } else {
                            //no item
                            ui.playerChoice("No fuse in inventory", [
                                {
                                    text: "OK",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], [target, environment, game, ui]);
                        }
                    }
                },
                {
                    text: "No",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ];
            ui.playerChoice("Insert fuse into the box?", choices, [target, environment, game, ui]);
        }
    },
    fuse_d_0: function() {
        return function(target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: "Yes",
                    action: function(args) {
                        if(args[0].possessions.hasItem("fuse")) {
                            //add item to inventory
                            args[0].possessions.dropItem("fuse");
                            args[1].toggletriggers[2].action = reusableFunctionsCollection.fuse_d_1();
                            //highlight switch
                            args[1].objects[0].image = "./levels/objects/switch_powered.png";
                            args[1].removeObjects();
                            args[1].setUpObjects();
                            args[1].loadObjects();
                            //change switch function
                            args[1].toggletriggers[1].action = reusableFunctionsCollection.switch_1();
                            args[2].paused = false;
                        } else {
                            //no item
                            ui.playerChoice("No fuse in inventory", [
                                {
                                    text: "OK",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], [target, environment, game, ui]);
                        }
                    }
                },
                {
                    text: "No",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ];
            ui.playerChoice("Insert fuse into the box?", choices, [target, environment, game, ui]);
        }
    },
    fuse_d_1: function() {
        return function(target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: "Yes",
                    action: function(args) {
                        if(args[0].possessions.items.length < 6) {
                            //add item to inventory
                            args[0].possessions.items.push(
                                {
                                    name: "fuse",
                                    fullName: "Fuse",
                                    text: "Protect against excessive current",
                                    quantity: 1,
                                    img: "./misc/items/fuse.png"
                                }
                            );
                            args[1].toggletriggers[2].action = reusableFunctionsCollection.fuse_d_0();
                            //change switch highlight
                            args[1].objects[0].image = "./levels/objects/switch.png";
                            //change switch function
                            args[1].toggletriggers[1].action = reusableFunctionsCollection.switch_0();
                            //remove hint if exist
                            args[1].objects[1].image = "";
                            args[1].removeObjects();
                            args[1].setUpObjects();
                            args[1].loadObjects();
                            args[2].paused = false;
                        } else {
                            //no space
                            ui.playerChoice("No space in inventory", [
                                {
                                    text: "OK",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], [target, environment, game, ui]);
                        }
                    }
                },
                {
                    text: "No",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ];
            ui.playerChoice("Remove fuse from the box?", choices, [target, environment, game, ui]);
        }
    },
    switch_0: function() {
        return function(target, environment, ui, game) {
            game.sound.playSFX("./audio/sfx/SwitchButton3.ogg", 1);
            game.paused = true;
            ui.playerChoice("It's not powered", [
                {
                    text: "OK",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ], [target, environment, game, ui]);
        }
    },
    switch_1: function() {
        return function(target, environment, ui, game) {
            game.sound.playSFX("./audio/sfx/SwitchButton3.ogg", 1);
            if (environment.objects[1].image == "") {
                environment.objects[1].image = "./levels/objects/dining_hint.png";
            } else {
                environment.objects[1].image = "";
            }
            environment.removeObjects();
            environment.setUpObjects();
            environment.loadObjects();
        }
    },
    fuse_terminal_0: function() {
        return function(target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: "Yes",
                    action: function(args) {
                        if (args[0].possessions.hasItem("fuse")) {
                            args[0].possessions.dropItem("fuse");
                            args[1].toggletriggers[4].action = reusableFunctionsCollection.fuse_terminal_1();
                            args[2].paused = false;
                        } else {
                            args[3].playerChoice("No fuse in inventory", [
                                {
                                    text: "OK",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], [target, environment, game, ui]);
                        }
                    }
                },
                {
                    text: "No",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ];
            ui.playerChoice("Requires a fuse to power. Insert fuse?", choices, [target, environment, game, ui]);
        };
    },
    fuse_terminal_1: function() {
        return function(target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: "Use Terminal",
                    action: function(args) {
                        args[3].displayTerminalPuzzleScreen(args[2]);
                    }
                },
                {
                    text: "Remove fuse",
                    action: function(args) {
                        if(args[0].possessions.items.length < 6) {
                            //add item to inventory
                            args[0].possessions.items.push(
                                {
                                    name: "fuse",
                                    fullName: "Fuse",
                                    text: "Protect against excessive current",
                                    quantity: 1,
                                    img: "./misc/items/fuse.png"
                                }
                            );
                            args[1].toggletriggers[4].action = reusableFunctionsCollection.fuse_terminal_0();
                            args[2].paused = false;
                        } else {
                            //no space
                            ui.playerChoice("No space in inventory", [
                                {
                                    text: "OK",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], [target, environment, game, ui]);
                        }
                    }
                }
            ];
            ui.playerChoice("", choices, [target, environment, game, ui]);
        };
    },
    kids_encounter: function() {
        return function(target, environment, ui, game) {
            environment.entities[0].enemy.toggleActive(true);
            environment.autotriggers[0].action = function() {};
        }
    }
}

export function afterFinalLoad(env) {
    env.entities[0].params[1] = 110;
    env.entities[5].params[1] = 25;
    env.toggletriggers[1].action = function(target, environment, ui, game) {
        game.paused = true;
        ui.playerChoice("Unlocked", [
            {
                text: "OK",
                action: function(args) {
                    args[1].toggletriggers[1].action = function(target, environment, ui, game) {
                        environment.ambient.handler.playDoorOpen();
                        environment.ambient.handler.playMusic("bg_0", 1);
                        environment.unload();
                        environments[6].env.loadAt(target, {x: 193, y: 160});
                    };
                    args[2].paused = false;
                }
            }
        ], [target, environment, game, ui]);
    };
    environments[6].env.toggletriggers[3].action = function(target, environment, ui, game) {
        game.paused = true;
        ui.playerChoice("Not going back", [
            {
                text: "OK",
                action: function(args) {
                    args[2].paused = false;
                }
            }
        ], [target, environment, game, ui]);
    };
    environments[6].env.toggletriggers[1].action = function(target, environment, ui, game) {
        game.paused = true;
        ui.playerChoice("The front door is unlocked now. I can finally leave the house.", [
            {
                text: "Go outside",
                action: function(args) {
                    args[3].displayGameEnd();
                }
            }
        ], [target, environment, game, ui]);
    };
}