import { environments, Environment } from "../environment.js";
import { Enemy } from "../entity.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_kids_bedroom(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                }
            ],
            [
                {
                    name: "door_sf",
                    at: {x: 18, y: 117},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "enemy_pos",
                    at: {x: 17, y: 63},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "uv",
                    at: {x: 147, y: 105},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
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
}

const actions = {
    "start_encounter": {
        0: function(object, target, environment, ui, game) {
        },
        1: function(object, target, environment, ui, game) {
            environment.entities[0].enemy.toggleActive(true);
            object.state = 0;
        }
    },
    "door_sf": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("bg_0", 1);
            environment.unload();
            environments[2].env.loadAt(target, {x:218, y:86});
        }
    },
    "enemy_pos": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.kids.what[locale], 90, {x: 17, y: 50});
        },
        1: function(object, target, environment, ui, game) {
        }
    },
    "uv": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        if(args[0].possessions.items.length < 6) {
                            //add item to inventory
                            args[0].possessions.items.push(item_collection.uv);
                            args[1].toggletriggers[1].state = 1;
                            args[1].toggletriggers[2].state = 1;
                            args[1].autotriggers[0].state = 1;
                            args[1].entities[1].style = "";
                            args[1].entities[2].style = "";
                            args[1].objects[1].image = "";
                            args[1].removeObjects();
                            args[1].setUpObjects();
                            args[1].loadObjects();
                            args[1].ambient.handler.playSFX("./audio/sfx/LargeGlassMirrorSmash2.ogg");
                            args[2].paused = false;
                            ui.playerChoice(environment_strings.kids.obtained_stick[locale], [
                                {
                                    text: "OK",
                                    action: function(args) {
                                        args[2].paused = false;
                                    }
                                }
                            ], args);
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
            ui.playerChoice(environment_strings.kids.pick[locale], choices, [target, environment, game, ui]);
        },
        1: function(object, target, environment, ui, game) {
        }
    }
}