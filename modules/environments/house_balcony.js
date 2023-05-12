import { environments, Environment } from "../environment.js";
import { Sprite } from "../sprite.js";
import { environment_strings, locale } from "../localisation.js";

export function get_house_balcony(audio) {
    return {
        name: "house_balcony",
        env: new Environment(
            "./levels/house_balcony.gif", 
            {w:103,h:71}, 
            {x:2, y:49, w:98, h:22}, 
            {x:200,y:121},
            [
                {
                    name: "wet_floor",
                    image: "./levels/objects/balcony_floor.png",
                    at: {x: 0, y: 71},
                    size: {h: 22, w: 98},
                    box: {h: 0, w: 0},
                    zIndex: 0
                },
                {
                    name: "rain",
                    image: "./levels/objects/rain.gif",
                    at: {x: 0, y: 71},
                    size: {h: 71, w: 103},
                    box: {h: 0, w: 0},
                    zIndex: 999
                },
                {
                    name: "blackwall_bugfix",
                    image: "./levels/objects/blackwall.png",
                    at: {x: -5, y: 121},
                    size: {h: 50, w: 108},
                    box: {h: 0, w: 0},
                    zIndex: 3
                },
                {
                    name: "railing",
                    image: "./levels/objects/balcony_railing.png",
                    at: {x: -5, y: 71},
                    size: {h: 37, w: 103},
                    box: {h: 0, w: 0},
                    zIndex: 999
                },
                {
                    name: "canvas",
                    image: "./levels/objects/canvas.png",
                    at: {x: 0, y: 59},
                    size: {h: 51, w: 18},
                    box: {h: 50, w: 15},
                    zIndex: 100
                },
                {
                    name: "drawer",
                    image: "./levels/objects/drawer.png",
                    at: {x: 0, y: 69},
                    size: {h: 20, w: 15},
                    box: {h: 50, w: 15},
                    zIndex: 100
                },
                {
                    name: "paint",
                    image: "./levels/objects/drawer_paint.png",
                    at: {x: 0, y: 69},
                    size: {h: 20, w: 15},
                    box: {h: 50, w: 15},
                    zIndex: 150
                }
            ],
            [],
            [
                {
                    name: "door_sf",
                    at: {x: 95, y: 68},
                    box: {h: 16, w: 10},
                    state: 0,
                    action: function(target, environment, ui, game) {
                        actions[this.name][this.state](this, target, environment, ui, game);
                    }
                },
                {
                    name: "supplies",
                    at: {x: 15, y: 68},
                    box: {h: 10, w: 20},
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
                    reflectionTop: false,
                    startAtY: 5,
                    offsetX: 64,
                    zIndex: 2
                },
                {
                    type: "lightsource",
                    style: "luminescent",
                    obj: {
                        name: "canvas_light",
                        image: "./levels/objects/canvas_light.png",
                        at: {x: 0, y: 59},
                        size: {h: 51, w: 18}
                    },
                    params: [[225, 130], 15]
                }
            ],
            {
                handler: audio,
                ambient: "./audio/ambient/rain_loop.mp3",
                volume: 0.8
            },
            true
        )
    }
}

const actions = {
    "door_sf": {
        0: function(object, target, environment, ui, game) {
            environment.ambient.handler.playDoorOpen();
            environment.unload();
            environments[2].env.loadAt(target, {x: 88, y:85});
        }
    },
    "supplies": {
        0: function(object, target, environment, ui, game) {
            target.displayText(environment_strings.balcony.paint[locale], 90, {x: 15, y: 70});
        }
    }
}