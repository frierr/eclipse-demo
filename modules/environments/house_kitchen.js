import { environments, Environment } from "../environment.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_kitchen(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_dining",
                    at: {x: 58, y: 113},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "fridge",
                    at: {x: 63, y: 63},
                    box: {h: 10, w: 20},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "pills",
                    at: {x: 13, y: 95},
                    box: {h: 20, w: 20},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
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
}

const actions = {
    "door_saveroom": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("bg_0", 1);
            environment.unload();
            environments[7].env.loadAt(target, {x: 150, y: 130});
        },
        1: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("save", 1);
            environment.unload();
            environments[7].env.loadAt(target, {x: 150, y: 130});
        }
    },
    "door_dining": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        args[1].ambient.handler.playDoorOpen();
                        args[1].unload();
                        environments[9].env.loadAt(target, environments[9].env.playerPosition);
                        args[1].toggletriggers[1].state = 1;
                        args[2].paused = false;
                    }
                },
                {
                    text: environment_strings.general.no[locale],
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ];
            ui.playerChoice(environment_strings.kitchen.door[locale], choices, [target, environment, game, ui]);
        },
        1: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[9].env.loadAt(target, environments[9].env.playerPosition);
        }
    },
    "fridge": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.kitchen.fridge[locale], 90, {x: 145, y: 55});
        }
    },
    "pills": {
        0: function(object, target, environment, ui, game) {
            if(target.possessions.items.length < 6) {
                //add item to inventory
                target.possessions.items.push(item_collection.pills);
                game.paused = true;
                ui.playerChoice(environment_strings.kitchen.obtained[locale], [
                    {
                        text: "OK",
                        action: function(args) {
                            args[2].paused = false;
                        }
                    }
                ], [target, environment, game, ui]);
                object.state = 1;
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
                ui.playerChoice(environment_strings.general.no_space[locale], [
                    {
                        text: "OK",
                        action: function(args) {
                            args[2].paused = false;
                        }
                    }
                ], [target, environment, game, ui]);
            }
        },
        1: function(object, target, environment, ui, game) {
        }
    }
}