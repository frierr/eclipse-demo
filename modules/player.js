import { Sprite } from "./sprite.js";
import { displayContextTextAt } from "./UI.js";

const animtick = 15; // (60 / 4) animation updates 4 times a second

export class Player {
    //handles player
    constructor() {
        this.name = "Anna";
        this.position = {
            x: 200,
            y: 110
        }
        const spriteSize = {
            w: 32,
            h: 32
        }
        this.box = {
            sides: 8,
            top: 8
        }
        this.speed = 1;
        this.speed_angled = this.speed / 1.41;
        this.sprite = new Sprite("./entities/player_basic.png", this.position, spriteSize);
        this.current_animation_timing = 0;
        this.inEnvironment = undefined;
        this.possessions = {
            notes: [],
            keys: [],
            hasKey: function(key) {
                for (var i = 0; i < this.keys.length; i++) {
                    if (this.keys[i].name == key) {
                        return true;
                    }
                }
                return false;
            },
            items: [],
            hasItem: function(item) {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].name == item) {
                        return true;
                    }
                }
                return false;
            },
            dropItem: function(item) {
                const temp = [];
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].name != item) {
                        temp.push(this.items[i]);
                    }
                }
                this.items = temp;
            },
            journal: []
        };
    }
    rotate(targetX, targetY) {
        this.sprite.rotateSprite(this.position.x, this.position.y, targetX, targetY);
    }
    positionChanged(keys_pressed) {
        const Xaxis = 0 + (keys_pressed.moveLeft ? -1 : 0) + (keys_pressed.moveRight ? 1 : 0);
        const Yaxis = 0 + (keys_pressed.moveUp ? -1 : 0) + (keys_pressed.moveDown ? 1 : 0);
        if (Xaxis != 0 || Yaxis != 0) {
            //do movement
            const prev_pos = {
                x: this.position.x,
                y: this.position.y
            };
            if (Xaxis != 0) {
                if (Yaxis != 0) {
                    this.position.x = this.position.x + Xaxis * this.speed_angled;
                    this.position.y = this.position.y + Yaxis * this.speed_angled;
                } else {
                    this.position.x = this.position.x + Xaxis * this.speed;
                }
            } else {
                this.position.y = this.position.y + Yaxis * this.speed;
            }
            if (!this.inEnvironment.isInsidePlayarea(this)) {
                this.position.x = prev_pos.x;
                this.position.y = prev_pos.y;
            }
            this.setSpriteZIndex();
            return true;
        } else {
            return false;
        }
    }
    setSpriteZIndex() {
        this.sprite.element.style.zIndex = Math.floor(this.position.y);
    }
    move(keys_pressed, sound) {
        if (this.positionChanged(keys_pressed)) {
            //do move animation
            this.current_animation_timing++;
            if(this.current_animation_timing == animtick) {
                this.current_animation_timing = 0;
                this.sprite.frame++;
                if (this.sprite.frame >= 4) {
                    this.sprite.frame = 0;
                }
                this.sprite.doAnimFrame();
                if (this.sprite.frame % 2 == 0) {
                    sound.playerSoundStep();
                }
            }
            this.sprite.updateSpritePosition(this.position);
        } else {
            this.sprite.frame = 0;
            this.current_animation_timing = 0;
            this.sprite.doAnimFrame();
        }
    }
    displayText(text, timeup, at) {
        displayContextTextAt(at, text, timeup);
    }
}