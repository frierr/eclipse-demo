import { Sprite } from "./sprite.js";
import { fastRoot } from "./basics.js";

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
const stun_affection = 120;
const stun_duration = 180;
const attack_readiness = 60;

export class Enemy {
    //handles player
    constructor(at, active) {
        this.frozen = true;
        this.stun = {
            stunned: false,
            affection: 0,
            duration: 0
        };
        this.attack = {
            readiness: 0,
            damage: 20
        };
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
            if (this.stun.stunned) {
                this.stun.duration++;
                if (this.stun.duration > stun_duration) {
                    this.stun.stunned = false;
                    this.stun.duration = 0;
                }
            } else {
                const envpos = target.inEnvironment.position;
                const corrected_pos = {x: target.position.x - envpos.x - 16, y: target.position.y - envpos.y + 32};
                this.rotate(corrected_pos.x, corrected_pos.y);
                this.move(corrected_pos);
                const dist = this.getDistanceToTarget(corrected_pos);
                if (dist < 30 && target.possessions.equipped && target.possessions.equipped.name == "uv") {
                    //&& equiped uv -> stun
                    this.stun.affection++;
                    if (this.stun.affection % 30 == 0) {
                        this.sounds.src = "./audio/enemy/WoodSnap3.ogg";
                        this.sounds.load();
                        this.sounds.play();
                    }
                    if (this.stun.affection > stun_affection) {
                        this.stun.stunned = true;
                        this.stun.affection = 0;
                        this.attack.readiness = 0;
                    }
                } else {
                    this.stun.affection--;
                    this.stun.affection = Math.max(0, this.stun.affection);
                }
                if (dist < 7) {
                    //do attack
                    this.attack.readiness++;
                    if(this.attack.readiness > attack_readiness) {
                        this.attack.readiness = 0;
                        this.sounds.src = "./audio/enemy/anteater.ogg";
                        this.sounds.load();
                        this.sounds.play();
                        target.receiveDamage(this.attack.damage);
                    }
                }
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
        const d0 = this.position.x - targetpos.x;
        const d1 = this.position.y - targetpos.y;
        const r2 = d0 * d0 + d1 * d1;
        return fastRoot(r2, fastRoot(r2, Math.max(Math.abs(d0), Math.abs(d1))));
    }
    receiveDamage(damage) {
        if (this.active && !this.frozen && this.stun.stunned) {
            this.sounds.src = "./audio/enemy/hurt.ogg";
            this.sounds.load();
            this.sounds.play();
            this.hp -= damage;
            if (this.hp <= 0) {
                this.toggleActive(false);
                this.sounds.src = "./audio/enemy/dead.ogg";
                this.sounds.load();
                this.sounds.play();
                this.box = {
                    sides: -10,
                    top: -10
                }
                this.sprite.animation = 10;
                this.sprite.frame = 1;
                this.sprite.doAnimFrame();
            }
        }
    }
}