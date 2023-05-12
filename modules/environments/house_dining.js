import { environments, Environment } from "../environment.js";
import { Enemy } from "../entity.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_dining(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "wake_enemy_1",
                    at: {x: 0, y: 140},
                    box: {h: 10, w: 40},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                }
            ],
            [
                {
                    name: "door_kitchen",
                    at: {x: 57, y: 59},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "switch",
                    at: {x: 33, y: 59},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "fusebox",
                    at: {x: 93, y: 155},
                    box: {h: 20, w: 20},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
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
}

const actions = {
    "wake_enemy_0": {
        0: function(object, target, environment, ui, game) {
            environment.entities[1].enemy.toggleActive(true);
            game.sound.playMusic("fight_0", 1);
            object.state = 1;
        },
        1: function(object, target, environment, ui, game) {
        }
    },
    "wake_enemy_1": {
        0: function(object, target, environment, ui, game) {
            environment.entities[2].enemy.toggleActive(true);
            game.sound.playMusic("fight_0", 1);
            object.state = 1;
        },
        1: function(object, target, environment, ui, game) {
        }
    },
    "door_kitchen": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            game.sound.playMusic("bg_0", 1);
            environment.unload();
            environments[8].env.loadAt(target, {x:159, y:144});
        }
    },
    "switch": {
        0: function(object, target, environment, ui, game) {
            game.sound.playSFX("./audio/sfx/SwitchButton3.ogg", 1);
            game.paused = true;
            ui.playerChoice(environment_strings.general.not_powered[locale], [
                {
                    text: "OK",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ], [target, environment, game, ui]);
        },
        1: function(object, target, environment, ui, game) {
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
    "fusebox": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        if(args[0].possessions.hasItem("fuse")) {
                            //add item to inventory
                            args[0].possessions.dropItem("fuse");
                            args[1].toggletriggers[2].state = 1;
                            //highlight switch
                            args[1].objects[0].image = "./levels/objects/switch_powered.png";
                            args[1].removeObjects();
                            args[1].setUpObjects();
                            args[1].loadObjects();
                            //change switch function
                            args[1].toggletriggers[1].state = 1;
                            args[2].paused = false;
                        } else {
                            //no item
                            ui.playerChoice(environment_strings.general.no_fuse[locale], [
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
                    text: environment_strings.general.no[locale],
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ];
            ui.playerChoice(environment_strings.general.insert_fuse[locale], choices, [target, environment, game, ui]);
        },
        1: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        if(args[0].possessions.items.length < 6) {
                            //add item to inventory
                            args[0].possessions.items.push(item_collection.fuse);
                            args[1].toggletriggers[2].state = 0;
                            //change switch highlight
                            args[1].objects[0].image = "./levels/objects/switch.png";
                            //change switch function
                            args[1].toggletriggers[1].state = 0;
                            //remove hint if exist
                            args[1].objects[1].image = "";
                            args[1].removeObjects();
                            args[1].setUpObjects();
                            args[1].loadObjects();
                            args[2].paused = false;
                        } else {
                            //no space
                            ui.playerChoice(environment_strings.general.no_space[locale], [
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
                    text: environment_strings.general.no[locale],
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ];
            ui.playerChoice(environment_strings.general.remove_fuse[locale], choices, [target, environment, game, ui]);
        }
    }
}