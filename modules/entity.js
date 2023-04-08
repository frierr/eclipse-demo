import { Sprite } from "./sprite.js";

export class Entity {
    static doReflection(entity, target, env_pos) {
        entity.sprite.element.style.zIndex = entity.zIndex;
        entity.sprite.frame = target.sprite.frame;
        entity.sprite.img = target.sprite.img;
        if(entity.reflectionTop) {
            //mirror reflection
            entity.sprite.element.style.transform = "scaleX(-1)";
            entity.sprite.animation = target.sprite.animation + 4;
            if (entity.sprite.animation > 7) {
                entity.sprite.animation -= 8;
            }
            entity.sprite.updateSpritePosition({x: target.position.x - entity.offsetX, y: 2 * entity.startAtY - target.position.y + target.sprite.size.h + env_pos.y + entity.sprite.size.h});
        } else {
            //water reflection
            entity.sprite.element.style.transform = "scaleY(-1)";
            entity.sprite.animation = target.sprite.animation;
            entity.sprite.updateSpritePosition({x: target.position.x - entity.offsetX, y: target.position.y + entity.sprite.size.h - entity.startAtY});
        }
        entity.sprite.doAnimFrame();
    }
}

const animtick = 15;

export class Enemy {
    //handles player
    constructor(at, active) {
        this.frozen = true;
        this.hp = 100;
        this.position = at;
        this.active = false;
        const spriteSize = {
            w: 32,
            h: 32
        }
        this.box = {
            sides: 4,
            top: 4
        }
        this.speed = 0.8;
        this.speed_angled = this.speed / 1.41;
        this.sprite = new Sprite("./entities/enemy_basic.png", this.position, spriteSize);
        this.current_animation_timing = 0;
        this.sounds = new Audio();
        this.sounds.volume = 1;
        this.ambient = new Audio();
        this.ambient.loop = true;
        this.ambient.volume = 0.5;
        this.ambient.src = "./audio/enemy/Breathless_Oblivion.ogg";
        this.ambient.load();
        this.toggleActive(active);
    }
    freeze(frozen) {
        //stop activity when leaving area
        this.frozen = frozen;
        if(this.frozen) {
            this.ambient.pause();
        } else if(this.active) {
            this.ambient.play();
        }
    }
    toggleActive(active) {
        this.active = active;
        if(this.active) {
            //active
            this.sprite.img.src = "./entities/enemy_basic.png";
            this.sounds.src = "./audio/enemy/awakened.mp3";
            this.sounds.load();
            this.sounds.play();
            this.ambient.play();
            this.box = {
                sides: -10,
                top: -10
            }
        } else {
            //not active
            this.sprite.img.src = "./entities/enemy_basic_stunned.png";
            this.ambient.pause();
            this.box = {
                sides: 4,
                top: 4
            }
        }
    }
    doTick(target) {
        if(this.active && !this.frozen) {
            const envpos = target.inEnvironment.position;
            const corrected_pos = {x: target.position.x - envpos.x - 16, y: target.position.y - envpos.y + 32};
            this.rotate(corrected_pos.x, corrected_pos.y);
            this.move(corrected_pos);
            if (this.getDistanceToTarget(corrected_pos) < 30) {
                //&& equiped uv -> stun
            } else if (this.getDistanceToTarget(corrected_pos) < 7) {
                //do attack
            }
        }
        this.sprite.element.style.zIndex = Math.floor(this.position.y);
        this.sprite.updateSpritePosition(this.position);
        this.sprite.doAnimFrame();
    }
    rotate(targetX, targetY) {
        this.sprite.rotateSprite(this.position.x, this.position.y, targetX, targetY);
    }
    move(targetpos) {
        this.trymove(targetpos);
        //animate
        this.current_animation_timing++;
        if(this.current_animation_timing == animtick) {
            this.current_animation_timing = 0;
            this.sprite.frame++;
            if (this.sprite.frame >= 4) {
                this.sprite.frame = 0;
            }
        }
    }
    trymove(targetpos) {
        const Xdiff = this.position.x - targetpos.x;
        const Ydiff = this.position.y - targetpos.y;
        const sum = Math.abs(Xdiff) + Math.abs(Ydiff);
        if (sum != 0) {
            const Xaxis = (-1) * Xdiff / sum;
            const Yaxis = (-1) * Ydiff / sum;
            this.position.x = this.position.x + Xaxis * this.speed_angled;
            this.position.y = this.position.y + Yaxis * this.speed_angled;
        }
    }
    getDistanceToTarget(targetpos) {
        //
    }




    //review and redo
    
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
}