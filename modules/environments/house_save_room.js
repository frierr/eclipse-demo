import { environments, Environment } from "../environment.js";
import { saveEnvironments, savePlayerData } from "../save.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_save_room(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_kitchen",
                    at: {x: 4, y: 98},
                    box: {h: 16, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "door_foyer",
                    at: {x: 24, y: 112},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "music_box",
                    at: {x: 20, y: 70},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "computer",
                    at: {x: 55, y: 85},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "easel",
                    at: {x: 57, y: 65},
                    box: {h: 10, w: 10},
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
    "door_office": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.saveroom.office_door[locale], 90, {x: 170, y: 95});
        }
    },
    "door_kitchen": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("bg_0", 1);
            environment.unload();
            environments[8].env.loadAt(target, environments[8].env.playerPosition);
        }
    },
    "door_foyer": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("bg_0", 1);
            environment.unload();
            environments[6].env.loadAt(target, {x: 149, y: 64});
        }
    },
    "music_box": {
        0: function(object, target, environment, ui, game) {
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
            environments[6].env.toggletriggers[0].state = 1;//foyer
            environments[8].env.toggletriggers[0].state = 1;//kitchen
            environments[10].env.toggletriggers[0].state = 1;//office
            object.state = 1;
        },
        1: function(object, target, environment, ui, game) {
            //save game function
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        savePlayerData(args[2].player);
                        saveEnvironments(environments);
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
            ui.playerChoice(environment_strings.saveroom.savegame[locale], choices, [target, environment, game, ui]);
        }
    },
    "computer": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.yes[locale],
                    action: function(args) {
                        if (args[0].possessions.hasItem("fuse")) {
                            args[0].possessions.dropItem("fuse");
                            args[1].toggletriggers[4].state = 1;
                            args[2].paused = false;
                        } else {
                            args[3].playerChoice(environment_strings.general.no_fuse[locale], [
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
            ui.playerChoice(environment_strings.general.requires_fuse[locale], choices, [target, environment, game, ui]);
        },
        1: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: environment_strings.general.terminal.use[locale],
                    action: function(args) {
                        args[3].displayTerminalPuzzleScreen(args[2]);
                    }
                },
                {
                    text: environment_strings.general.terminal.remove_fuse[locale],
                    action: function(args) {
                        if(args[0].possessions.items.length < 6) {
                            //add item to inventory
                            args[0].possessions.items.push(item_collection.fuse);
                            args[1].toggletriggers[4].state = 0();
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
                }
            ];
            ui.playerChoice("", choices, [target, environment, game, ui]);
        }
    },
    "easel": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.saveroom.easel[locale], 90, {x: 87, y: 45});
        }
    }
}