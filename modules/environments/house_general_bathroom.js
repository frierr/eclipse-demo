import { environments, Environment } from "../environment.js";
import { Sprite } from "../sprite.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_general_bathroom(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                }
            ],
            [
                {
                    name: "door_sf",
                    at: {x: 6, y: 91},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "bathtub",
                    at: {x: 55, y: 75},
                    box: {h: 10, w: 40},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "fusebox",
                    at: {x: 77, y: 60},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
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
}

const actions = {
    "mirror": {
        0: function(object, target, environment, ui, game) {
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
            object.state = 1;
        },
        1: function(object, target, environment, ui, game) {
        }
    },
    "door_sf": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[2].env.loadAt(target, {x:238, y:95});
        }
    },
    "bathtub": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.bathroom_1.tub[locale], 90, {x: 155, y: 115});
        }
    },
    "fusebox": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        if(args[0].possessions.items.length < 6) {
                            //add item to inventory
                            args[0].possessions.items.push(item_collection.fuse);
                            args[1].toggletriggers[2].state = 1;
                            args[1].overlay = true;
                            args[1].loadOverlay();
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
        },
        1: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        if(args[0].possessions.hasItem("fuse")) {
                            //add item to inventory
                            args[0].possessions.dropItem("fuse");
                            args[1].toggletriggers[2].state = 0;
                            args[1].overlay = false;
                            args[1].loadOverlay();
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
        }
    }
}