import { environments, Environment } from "../environment.js";
import { item_collection } from "../items.js";
import { environment_strings, journal_strings, locale } from "../localisation.js";

export function get_house_master_bedroom(audio) {
    return {
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
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "window",
                    at: {x: 72, y: 60},
                    box: {h: 10, w: 34},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "topdoor",
                    at: {x: 15, y: 60},
                    box: {h: 10, w: 16},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "rightdoor",
                    at: {x: 150, y: 100},
                    box: {h: 20, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "drawer",
                    at: {x: 20, y: 112},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
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
    };
}

const actions = {
    "wardrobe": {
        0: function(object, target, environment, ui, game) {
            if(!target.possessions.hasItem("hook")){
                environment.ambient.handler.playSFX("./audio/sfx/ClothesSyntheticfabric2.ogg");
                target.possessions.items.push(item_collection.hook);
                game.paused = true;
                //no space
                ui.playerChoice(environment_strings.bedroom.found_hook[locale], [
                    {
                        text: "OK",
                        action: function(args) {
                            args[2].paused = false;
                        }
                    }
                ], [target, environment, game, ui]);
                object.state = 1;
            }
        },
        1: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.bedroom.nothing_useful[locale], 90, {x: 160, y: 50});
        }
    },
    "window": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.bedroom.window[locale], 90, {x: 87, y: 45});
        }
    },
    "topdoor": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[1].env.loadAt(target, environments[1].env.playerPosition);
        }
    },
    "rightdoor": {
        0: function(object, target, environment, ui, game) {
            if(target.possessions.hasKey("bedroom_key")) {
                environment.ambient.handler.playSFX("./audio/sfx/GateWoodChain1.ogg");
                target.displayText(environment_strings.bedroom.unlocked_door[locale], 90, {x: 212, y: 90});
                object.state = 1;
            } else  {
                environment.ambient.handler.playDoorClose();
                target.displayText(environment_strings.bedroom.locked_door[locale], 90, {x: 212, y: 90});
            }
        },
        1: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.ambient.handler.playMusic("bg_0", 1);
            environment.unload();
            environments[2].env.loadAt(target, {x:129, y:85});
            target.possessions.journal.push(journal_strings.bedroom_exit[locale]);
            object.state = 2;
        },
        2: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[2].env.loadAt(target, {x:129, y:85});
        }
    },
    "drawer": {
        0: function(object, target, environment, ui, game) {
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
            target.possessions.notes.push(item_collection.note_0);
            game.paused = true;
            ui.displayNote(target.possessions.notes[target.possessions.notes.length - 1]);
            object.state = 1;
        },
        1: function(object, target, environment, ui, game) {
        }
    }
}