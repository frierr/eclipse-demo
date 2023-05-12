import { environments, Environment } from "../environment.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_first_floor(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                }
            ],
            [
                {
                    name: "door_saveroom",
                    at: {x: 24, y: 59},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_front",
                    at: {x: 28, y: 162},
                    box: {h: 10, w: 32},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_dining",
                    at: {x: 5, y: 153},
                    box: {h: 16, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_living",
                    at: {x: 72, y: 153},
                    box: {h: 16, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "umbrella",
                    at: {x: 42, y: 125},
                    box: {h: 20, w: 15},
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
                volume: 0.2
            }
        )
    }
}

const actions = {
    "stairs": {
        0: function(object, target, environment, ui, game) {
            environment.unload();
            environments[2].env.loadAt(target, {x:222, y:111});
        }
    },
    "door_saveroom": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[7].env.loadAt(target, {x:150, y:145});
        },
        1: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("save", 1);
            environment.unload();
            environments[7].env.loadAt(target, {x:150, y:145});
        }
    },
    "door_front": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.first_floor.locked[locale], 90, {x: 125, y: 170});
        },
        1: function(object, target, environment, ui, game) {
            game.paused = true;
            ui.playerChoice(environment_strings.end.leave[locale], [
                {
                    text: environment_strings.end.go[locale],
                    action: function(args) {
                        args[3].displayGameEnd();
                    }
                }
            ], [target, environment, game, ui]);
        }
    },
    "door_dining": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.first_floor.cant_open[locale], 90, {x: 6, y: 130});
        }
    },
    "door_living": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.first_floor.blocked[locale], 90, {x: 165, y: 130});
        },
        1: function(object, target, environment, ui, game) {
            game.paused = true;
            ui.playerChoice(environment_strings.end.not_going_back[locale], [
                {
                    text: "OK",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ], [target, environment, game, ui]);
        }
    },
    "umbrella": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        if(args[0].possessions.items.length < 6) {
                            //add item to inventory
                            args[0].possessions.items.push(item_collection.umbrella);
                            ui.playerChoice(environment_strings.first_floor.obtained[locale], [
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
                            args[1].toggletriggers[4].state = 1;
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
            ui.playerChoice(environment_strings.first_floor.umbrella_stand[locale], choices, [target, environment, game, ui]);
        },
        1: function(object, target, environment, ui, game) {
        }
    }
}