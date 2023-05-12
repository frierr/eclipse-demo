import { environments, Environment } from "../environment.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_second_floor(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                }
            ],
            [
                {
                    name: "door_mb",
                    at: {x: 50, y: 59},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_balcony",
                    at: {x: 8, y: 59},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_kids",
                    at: {x: 142, y: 59},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_bathroom",
                    at: {x: 170, y: 68},
                    box: {h: 16, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "paintings",
                    at: {x: 85, y: 55},
                    box: {h: 10, w: 40},
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
            environments[6].env.loadAt(target, {x:189, y:129});
        }
    },
    "door_mb": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[0].env.loadAt(target, {x:231, y:133});
        }
    },
    "door_balcony": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[3].env.loadAt(target, environments[3].env.playerPosition);
        }
    },
    "door_kids": {
        0: function(object, target, environment, ui, game) {
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
            target.possessions.notes.push(item_collection.note_1);
            game.paused = true;
            ui.displayNote(target.possessions.notes[target.possessions.notes.length - 1]);
            object.state = 1;
        },
        1: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        args[1].ambient.handler.playDoorOpen();
                        args[1].ambient.handler.stopMusic();
                        args[1].unload();
                        environments[4].env.loadAt(target, environments[4].env.playerPosition);
                        args[1].toggletriggers[2].state = 2;
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
            ui.playerChoice(environment_strings.second_floor.door[locale], choices, [target, environment, game, ui]);
        },
        2: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.stopMusic();
            environment.unload();
            environments[4].env.loadAt(target, environments[4].env.playerPosition);
        }
    },
    "door_bathroom": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[5].env.loadAt(target, environments[5].env.playerPosition);
        }
    },
    "paintings": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.second_floor.art[locale], 90, {x: 115, y: 40});
        }
    }
}