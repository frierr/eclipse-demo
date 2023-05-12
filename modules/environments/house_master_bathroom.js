import { environments, Environment } from "../environment.js";
import { Sprite } from "../sprite.js";
import { item_collection } from "../items.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_master_bathroom(audio) {
    return {
        name: "house_master_bathroom",
        env: new Environment(
            "./levels/house_master_bathroom.png", 
            {w:90,h:70}, 
            {x:0, y:49, w:90, h:21}, 
            {x:195,y:120},
            [
                {
                    name: "mirror_bg",
                    image: "./levels/objects/bathroom_mirror_bg.png",
                    at: {x: 63, y: 49},
                    size: {h: 49, w: 16},
                    box: {h: 0, w: 0},
                    zIndex: 1
                },
                {
                    name: "bathtub",
                    image: "./levels/objects/bathtub_filled.png",
                    at: {x: 0, y: 70},
                    size: {h: 34, w: 17},
                    box: {h: 30, w: 17}
                },
                {
                    name: "blackwall_bugfix",
                    image: "./levels/objects/blackwall.png",
                    at: {x: 90, y: 49},
                    size: {h: 49, w: 16},
                    box: {h: 0, w: 0},
                    zIndex: 3
                }
            ],
            [],
            [
                {
                    name: "door",
                    at: {x: 85, y: 65},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "mirror",
                    at: {x: 65, y: 55},
                    box: {h: 10, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "bathtub",
                    at: {x: 15, y: 65},
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
                    startAtY: 49,
                    offsetX: 32,
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
    "door": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[0].env.loadAt(target, {x:105, y:90});
        }
    },
    "mirror": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.bathroom_0.mirror[locale], 90, {x: 125, y: 70});
        }
    },
    "bathtub": {
        0: function(object, target, environment, ui, game) {
            game.paused = true;
            const choices = [
                {
                    text: "OK",
                    action: function(args) {
                        args[2].paused = false;
                    }
                }
            ];
            if(target.possessions.items.length > 0) {
                const items = [];
                for (var i = 0; i < target.possessions.items.length; i++) {
                    if (target.possessions.items[i].name == "hook") {
                        items.push(
                            {
                                text: target.possessions.items[i].fullName,
                                action: function(args) {
                                    args[0].possessions.keys.push(item_collection.key_0);
                                    ui.playerChoice(environment_strings.bathroom_0.obtained_key[locale], [
                                        {
                                            text: "OK",
                                            action: function(args) {
                                                args[2].paused = false;
                                            }
                                        }
                                    ], args);
                                    args[2].paused = false;
                                    args[0].possessions.dropItem("hook");
                                }
                            }
                        );
                    } else {
                        items.push(
                            {
                                text: target.possessions.items[i].fullName,
                                action: function(args) {
                                    ui.playerChoice(environment_strings.bathroom_0.cant_use[locale], [
                                        {
                                            text: "OK",
                                            action: function(args) {
                                                args[2].paused = false;
                                            }
                                        }
                                    ], args);
                                }
                            }
                        );
                    }
                }
                items.push(
                    {
                        text: environment_strings.bathroom_0.nothing[locale],
                        action: function(args) {
                            args[2].paused = false;
                        }
                    }
                );
                choices.push(
                    {
                        text: environment_strings.bathroom_0.use_item[locale],
                        action: function(args) {
                            ui.playerChoice(environment_strings.bathroom_0.which_item[locale], items, args);
                        }
                    }
                );
            }
            ui.playerChoice(environment_strings.bathroom_0.not_stick[locale], choices, [target, environment, game, ui]);
        }
    }
}