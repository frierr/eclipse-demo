import { Sprite } from "./sprite.js";
import { fastRoot } from "./basics.js";
import { on_boss_death } from "./environments/house_living_room.js";

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
const stun_duration = 90;
const attack_readiness = 30;
const default_speed = 2 / 1.41;
const stunned_speed = 1.2 / 1.41;

export class Enemy {
    //handles player
    constructor(at, active, correction) {
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
        this.correction = correction;
        this.speed = default_speed;
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
                const corrected_pos = {x: target.position.x - envpos.x - 16 - (this.correction ? this.correction.x : 0), y: target.position.y - envpos.y + 32 - (this.correction ? this.correction.y : 0)};
                this.rotate(corrected_pos.x, corrected_pos.y);
                this.move(corrected_pos);
                const dist = this.getDistanceToTarget(corrected_pos);
                if (dist < 30 && target.possessions.equipped && target.possessions.equipped.name == "uv") {
                    //&& equiped uv -> stun
                    this.speed = stunned_speed;
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
                    this.speed = default_speed;
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
            this.position.x = this.position.x + Xaxis * this.speed;
            this.position.y = this.position.y + Yaxis * this.speed;
        }
    }
    getDistanceToTarget(targetpos) {
        const d0 = this.position.x - targetpos.x;
        const d1 = this.position.y - targetpos.y;
        const r2 = d0 * d0 + d1 * d1;
        return fastRoot(r2, fastRoot(r2, Math.max(Math.abs(d0), Math.abs(d1))));
    }
    getDistanceToTargetNoCorrection(target) {
        const envpos = target.inEnvironment.position;
        const corrected_pos = {x: target.position.x - envpos.x - 16 - (this.correction ? this.correction.x : 0), y: target.position.y - envpos.y + 32 - (this.correction ? this.correction.y : 0)};
        const d0 = this.position.x - corrected_pos.x;
        const d1 = this.position.y - corrected_pos.y;
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

const boss_stun_affection = 120;
const boss_stun_duration = 90;
const boss_attack_readiness = 30;
const boss_default_speed = 0.5 / 1.41;
const boss_dash_speed = 5 / 1.41;
const boss_stunned_speed = 0.5 / 1.41;

export class Boss extends Enemy {
    constructor(at, active, correction) {
        super(at, active, correction);
        this.frozen = false;
        this.attack.damage = 40;
        this.hp = 1000;
        this.speed = boss_default_speed;
        this.stage = 0;
        this.substage = 0;
        this.tickcounter = 0;
        this.stage_data = undefined;
        this.stage_counter = 0;
        this.vulnerable = false;
    }
    toggleActive(active) {
        this.active = active;
        if(this.active) {
            //active
            this.sprite.img.src = "./entities/boss_basic.png";
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
            switch (this.stage) {
                case 0:
                    this.#doStage0(target);
                    break;
                case 1:
                    this.#doStage1(target);
                    break;
                case 2:
                    this.#doStage2(target);
                    break;
                case 3:
                    this.#doStage3(target);
                    break;
                default:
                    break;
            }
        }
        this.sprite.element.style.zIndex = Math.floor(this.position.y);
        this.sprite.updateSpritePosition(this.position);
        this.sprite.doAnimFrame();
    }
    #getTargetTruePosition(target) {
        const envpos = target.inEnvironment.position;
        return {x: target.position.x - envpos.x - 16 - (this.correction ? this.correction.x : 0), y: target.position.y - envpos.y + 32 - (this.correction ? this.correction.y : 0)};
    }
    #doStage0(target) {
        switch(this.substage) {
            case 3:
                this.tickcounter++;
                if (this.tickcounter >= 120) {
                    //repeat
                    this.vulnerable = false;
                    this.sprite.img.src = "./entities/boss_basic.png";
                    if(this.hp < 750) {
                        this.stage = 1;
                        this.speed = boss_dash_speed;
                        this.stage_counter = 0;
                        this.substage = 0;
                        this.tickcounter = 0;
                    } else {
                        this.speed = boss_default_speed;
                        this.stage_counter = 0;
                        this.substage = 0;
                        this.tickcounter = 0;
                    }
                }
                break;
            case 2:
                //attack
                this.move(this.stage_data);
                if (this.getDistanceToTarget(this.stage_data) < 10) {
                    //check if target nearby
                    const corrected_pos = this.#getTargetTruePosition(target);
                    if (this.getDistanceToTarget(corrected_pos) < 10) {
                        target.receiveDamage(this.attack.damage);
                    }
                    this.stage_counter++;
                    if (this.stage_counter > 2) {
                        //vulnerable
                        this.vulnerable = true;
                        this.sprite.img.src = "./entities/boss_vulnerable.png";
                        this.substage = 3;
                        this.tickcounter = 0;
                    } else {
                        //repeat
                        this.speed = boss_default_speed;
                        this.substage = 0;
                        this.tickcounter = 0;
                    }
                }
                break;
            case 1:
                //prepare to attack
                this.tickcounter++;
                const corrected_pos = this.#getTargetTruePosition(target);
                this.rotate(corrected_pos.x, corrected_pos.y);
                if(this.tickcounter >= 20) {
                    this.stage_data = corrected_pos;
                    this.tickcounter = 0;
                    this.speed = boss_dash_speed;
                    this.substage = 2;
                }
                break;
            case 0:
            default:
                //move to target
                const corrected_pos1 = this.#getTargetTruePosition(target);
                this.#moveToTarget(corrected_pos1);
                if (this.getDistanceToTarget(corrected_pos1) < 50) {
                    this.substage = 1;
                    this.tickcounter = 0;
                }
                break;
        }
    }
    #doStage1(target) {
        switch(this.substage) {
            case 2:
                this.tickcounter++;
                if (this.tickcounter >= 120) {
                    //repeat
                    this.vulnerable = false;
                    this.sprite.img.src = "./entities/boss_basic.png";
                    if(this.hp < 500) {
                        this.stage = 2;
                        this.speed = boss_dash_speed;
                        this.stage_data = this.#getTargetTruePosition({inEnvironment: {position: target.inEnvironment.position}, position: {x: -100, y: 90}});
                        this.stage_counter = 0;
                        this.substage = 0;
                        this.tickcounter = 0;
                        this.#changeArenaToStage2(target.inEnvironment);
                    } else {
                        this.speed = boss_dash_speed;
                        this.stage_counter = 0;
                        this.substage = 0;
                        this.tickcounter = 0;
                    }
                }
                break;
            case 1:
                //leap
                this.move(this.stage_data);
                if (this.getDistanceToTarget(this.stage_data) < 10) {
                    //check if target nearby
                    const corrected_pos = this.#getTargetTruePosition(target);
                    if (this.getDistanceToTarget(corrected_pos) < 10) {
                        target.receiveDamage(this.attack.damage);
                    }
                    this.stage_counter++;
                    if (this.stage_counter > 4) {
                        //vulnerable
                        this.vulnerable = true;
                        this.sprite.img.src = "./entities/boss_vulnerable.png";
                        this.substage = 2;
                        this.tickcounter = 0;
                    } else {
                        //repeat
                        this.substage = 0;
                        this.tickcounter = 0;
                    }
                }
                break;
            case 0:
            default:
                //stall and turn
                this.tickcounter++;
                const corrected_pos = this.#getTargetTruePosition(target);
                this.rotate(corrected_pos.x, corrected_pos.y);
                if(this.tickcounter >= 20) {
                    this.stage_data = corrected_pos;
                    this.tickcounter = 0;
                    this.substage = 1;
                }
                break;
        }
    }
    #changeArenaToStage2(environment) {
        environment.entities[0].params[1] = 89;
        environment.entities[1].params[1] = 0;
        environment.entities[2].params[1] = 0;
        environment.entities[3].params[1] = 0;
        environment.entities[4].params[1] = 0;
    }
    #doStage2(target) {
        switch(this.substage) {
            case 3:
                this.tickcounter++;
                if (this.tickcounter >= 120) {
                    //repeat
                    this.vulnerable = false;
                    this.sprite.img.src = "./entities/boss_basic.png";
                    if(this.hp < 250) {
                        this.stage = 3;
                        this.speed = boss_dash_speed;
                        this.stage_data = this.#getTargetTruePosition({inEnvironment: {position: target.inEnvironment.position}, position: {x: 160, y: 110}});
                        this.stage_counter = 0;
                        this.substage = 0;
                        this.tickcounter = 0;
                    } else {
                        this.stage_data = this.#getTargetTruePosition({inEnvironment: {position: target.inEnvironment.position}, position: {x: -100, y: 90}});
                        this.stage_counter = 0;
                        this.substage = 0;
                        this.tickcounter = 0;
                    }
                }
                break;
            case 2:
                //leap
                this.move(this.stage_data);
                if (this.getDistanceToTarget(this.stage_data) < 10) {
                    //check if target nearby
                    const corrected_pos = this.#getTargetTruePosition(target);
                    if (this.getDistanceToTarget(corrected_pos) < 10) {
                        target.receiveDamage(this.attack.damage);
                    }
                    this.stage_counter++;
                    if (this.stage_counter > 2) {
                        //vulnerable
                        this.vulnerable = true;
                        this.sprite.img.src = "./entities/boss_vulnerable.png";
                        this.substage = 3;
                        this.tickcounter = 0;
                    } else {
                        //repeat
                        this.stage_data = this.#getTargetTruePosition({inEnvironment: {position: target.inEnvironment.position}, position: {x: -100, y: 90}});
                        this.substage = 0;
                        this.tickcounter = 0;
                    }
                }
                break;
            case 1:
                //wait
                this.tickcounter++;
                const corrected_pos = this.#getTargetTruePosition(target);
                this.rotate(corrected_pos.x, corrected_pos.y);
                if(this.tickcounter >= this.stage_data) {
                    this.stage_data = corrected_pos;
                    this.tickcounter = 0;
                    this.substage = 2;
                }
                break;
            case 0:
            default:
                //get of arena
                this.move(this.stage_data);
                if (this.getDistanceToTarget(this.stage_data) < 10) {
                    //get random position
                    const positions = [{inEnvironment: {position: target.inEnvironment.position}, position: {x: -100, y: 90}}, 
                        {inEnvironment: {position: target.inEnvironment.position}, position: {x: 420, y: 90}}, 
                        {inEnvironment: {position: target.inEnvironment.position}, position: {x: 160, y: -100}}, 
                        {inEnvironment: {position: target.inEnvironment.position}, position: {x: 160, y: 280}}];
                    this.position = this.#getTargetTruePosition(positions[Math.floor(Math.random() * positions.length)]);
                    this.stage_data = Math.floor(Math.random() * 120 + 20);
                    this.substage = 1;
                    this.tickcounter = 0;
                }
                break;
        }
    }
    #doStage3(target) {
        switch(this.substage) {
            case 10:
                this.tickcounter++;
                if (this.tickcounter >= 180) {
                    //repeat
                    this.vulnerable = false;
                    if(this.hp < 0) {
                        this.stage = 4;
                        this.stage_counter = 0;
                        this.substage = 0;
                        this.tickcounter = 0;
                        this.toggleActive(false);
                        target.inEnvironment.ambient.handler.stopMusic();
                        this.sounds.src = "./audio/enemy/dead.ogg";
                        this.sounds.load();
                        this.sounds.play();
                        this.box = {
                            sides: -10,
                            top: -10
                        }
                        this.sprite.animation = 8;
                        this.sprite.frame = 3;
                        this.sprite.doAnimFrame();
                        on_boss_death();
                    } else {
                        this.sprite.img.src = "./entities/boss_basic.png";
                        this.stage_data = this.#getTargetTruePosition({inEnvironment: {position: target.inEnvironment.position}, position: {x: 160, y: 110}});
                        this.stage_counter = 0;
                        this.substage = 0;
                        this.tickcounter = 0;
                    }
                }
                break;
            case 9:
                //wait
                this.tickcounter++;
                const corrected_pos4 = this.#getTargetTruePosition(target);
                this.rotate(corrected_pos4.x, corrected_pos4.y);
                if(this.tickcounter >= 10) {
                    this.stage_data = corrected_pos4;
                    this.tickcounter = 0;
                    this.substage = 8;
                }
                break;
            case 8:
                //leap
                this.move(this.stage_data);
                if (this.getDistanceToTarget(this.stage_data) < 10) {
                    //check if target nearby
                    const corrected_pos = this.#getTargetTruePosition(target);
                    if (this.getDistanceToTarget(corrected_pos) < 10) {
                        target.receiveDamage(this.attack.damage);
                    }
                    this.stage_counter++;
                    if (this.stage_counter > 2) {
                        //vulnerable
                        this.vulnerable = true;
                        this.sprite.img.src = "./entities/boss_vulnerable.png";
                        this.substage = 10;
                        this.tickcounter = 0;
                        this.stage_counter = 0;
                    } else {
                        //repeat
                        this.substage = 9;
                        this.tickcounter = 0;
                    }
                }
                break;
            case 7:
                //wait
                this.tickcounter++;
                const corrected_pos3 = this.#getTargetTruePosition(target);
                this.rotate(corrected_pos3.x, corrected_pos3.y);
                if(this.tickcounter >= 60) {
                    this.stage_data = corrected_pos3;
                    this.tickcounter = 0;
                    this.substage = 8;
                }
                break;
            case 6:
                //leap
                this.move(this.stage_data);
                if (this.getDistanceToTarget(this.stage_data) < 10) {
                    //check if target nearby
                    const corrected_pos = this.#getTargetTruePosition(target);
                    if (this.getDistanceToTarget(corrected_pos) < 10) {
                        target.receiveDamage(this.attack.damage);
                    }
                    this.substage = 7;
                    this.tickcounter = 0;
                }
                break;
            case 5:
                //wait
                this.tickcounter++;
                const corrected_pos2 = this.#getTargetTruePosition(target);
                this.rotate(corrected_pos2.x, corrected_pos2.y);
                if(this.tickcounter >= 120) {
                    this.stage_data = corrected_pos2;
                    this.tickcounter = 0;
                    this.substage = 6;
                }
                break;
            case 4:
                //leap
                this.move(this.stage_data);
                if (this.getDistanceToTarget(this.stage_data) < 10) {
                    //check if target nearby
                    const corrected_pos = this.#getTargetTruePosition(target);
                    if (this.getDistanceToTarget(corrected_pos) < 10) {
                        target.receiveDamage(this.attack.damage);
                    }
                    this.substage = 5;
                    this.tickcounter = 0;
                }
                break;
            case 3:
                //wait
                this.tickcounter++;
                const corrected_pos1 = this.#getTargetTruePosition(target);
                this.rotate(corrected_pos1.x, corrected_pos1.y);
                if(this.tickcounter >= 10) {
                    this.stage_data = corrected_pos1;
                    this.tickcounter = 0;
                    this.substage = 4;
                }
                break;
            case 2:
                //leap
                this.move(this.stage_data);
                if (this.getDistanceToTarget(this.stage_data) < 10) {
                    //check if target nearby
                    const corrected_pos = this.#getTargetTruePosition(target);
                    if (this.getDistanceToTarget(corrected_pos) < 10) {
                        target.receiveDamage(this.attack.damage);
                    }
                    this.substage = 3;
                    this.tickcounter = 0;
                }
                break;
            case 1:
                //wait
                this.tickcounter++;
                const corrected_pos = this.#getTargetTruePosition(target);
                this.rotate(corrected_pos.x, corrected_pos.y);
                if(this.tickcounter >= 120) {
                    this.stage_data = corrected_pos;
                    this.tickcounter = 0;
                    this.substage = 2;
                }
                break;
            case 0:
            default:
                //get to the center
                this.move(this.stage_data);
                if (this.getDistanceToTarget(this.stage_data) < 10) {
                    this.substage = 1;
                    this.tickcounter = 0;
                }
                break;
        }
    }
    #moveToTarget(corrected_pos) {
        this.rotate(corrected_pos.x, corrected_pos.y);
        this.move(corrected_pos);
    }
    receiveDamage(damage) {
        if (this.active && !this.frozen && this.vulnerable) {
            this.sounds.src = "./audio/enemy/hurt.ogg";
            this.sounds.load();
            this.sounds.play();
            this.hp -= damage;
        }
    }
}