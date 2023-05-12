import { environments, Environment } from "../environment.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_office(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_livingroom",
                    at: {x: 23, y: 115},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "shelf",
                    at: {x: 70, y: 70},
                    box: {h: 10, w: 34},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "desk",
                    at: {x: 50, y: 80},
                    box: {h: 10, w: 34},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "pills",
                    at: {x: 28, y: 95},
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
            environments[7].env.loadAt(target, {x: 180, y: 130});
        },
        1: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("save", 1);
            environment.unload();
            environments[7].env.loadAt(target, {x: 180, y: 130});
        }
    },
    "door_livingroom": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("bg_0", 1);
            environment.unload();
            environments[11].env.loadAt(target, {x: 308, y: 67});
        }
    },
    "shelf": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.office.nothing[locale], 90, {x: 105, y: 58});
        }
    },
    "desk": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.office.desk[locale], 90, {x: 155, y: 98});
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