import { environments, Environment } from "../environment.js";
import { Boss } from "../entity.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_living_room(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_foyer",
                    at: {x: 30, y: 59},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "central",
                    at: {x: 150, y: 125},
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
}

const actions = {
    "door_office": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            //no space
            ui.playerChoice(environment_strings.living.door_office[locale], [
                {
                    text: "OK",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ], [target, environment, game, ui]);
        }
    },
    "door_foyer": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            //no space
            ui.playerChoice(environment_strings.living.need_key[locale], [
                {
                    text: "OK",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ], [target, environment, game, ui]);
        },
        1: function(object, target, environment, ui, game) {
            game.paused = true;
            ui.playerChoice(environment_strings.living.not_time[locale], [
                {
                    text: "OK",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ], [target, environment, game, ui]);
        },
        2: function(object, target, environment, ui, game) {
            game.paused = true;
            ui.playerChoice(environment_strings.end.unlocked[locale], [
                {
                    text: "OK",
                    action: function(args) {
                        args[1].toggletriggers[1].state = 3;
                        args[2].paused = false;
                    }
                }
            ], [target, environment, game, ui]);
        },
        3: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("bg_0", 1);
            environment.unload();
            environments[6].env.loadAt(target, {x: 193, y: 160});
        }
    },
    "central": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            //no space
            ui.playerChoice(environment_strings.living.take_key[locale], [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        args[0].possessions.keys.push(item_collection.key_1);
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
                        ui.playerChoice(environment_strings.bathroom_0.obtained_key[locale], [
                            {
                                text: "OK",
                                action: function(args) {
                                    args[1].entities.push({
                                        type: "enemy",
                                        enemy: new Boss({x: -200, y: 120}, true, {x: 208, y: 32})
                                    });
                                    args[2].sound.playMusic("boss", 0.8);
                                    args[1].toggletriggers[1].state = 1;
                                    args[1].toggletriggers[2].state = 1;
                                    args[2].paused = false;
                                }
                            }
                        ], args);
                    }
                },
                {
                    text: environment_strings.general.no[locale],
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ], [target, environment, game, ui]);
        },
        1: function(object, target, environment, ui, game) {
        }
    }
}

export function on_boss_death() {
    environments[11].env.entities[0].params[1] = 110;
    environments[11].env.entities[5].params[1] = 25;
    environments[11].env.toggletriggers[1].state = 2;
    environments[6].env.toggletriggers[3].state = 1;
    environments[6].env.toggletriggers[1].state = 1;
}