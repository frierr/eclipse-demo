import { Boss, Enemy } from "./entity.js";
import { item_collection } from "./items.js";
import { environment_strings, locale } from "./localisation.js";
import { get_house_master_bedroom } from "./environments/house_master_bedroom.js";
import { get_house_master_bathroom } from "./environments/house_master_bathroom.js";
import { get_house_second_floor } from "./environments/house_second_floor.js";
import { get_house_balcony } from "./environments/house_balcony.js";
import { get_house_kids_bedroom } from "./environments/house_kids_bedroon.js";
import { get_house_general_bathroom } from "./environments/house_general_bathroom.js";
import { get_house_first_floor } from "./environments/house_first_floor.js";
import { get_house_save_room } from "./environments/house_save_room.js";
import { get_house_kitchen } from "./environments/house_kitchen.js";
import { get_house_dining } from "./environments/house_dining.js";
import { get_house_office } from "./environments/house_office.js";
import { get_house_living_room } from "./environments/house_living_room.js";

const playareadark = document.getElementById("playarea-dark");
const dark = playareadark.getContext("2d");

export const scenes = [
    {
        frames: [
            {
                frame: "./misc/scene/bathroom_fail_1.png",
                time: 60
            },
            {
                frame: "./misc/scene/bathroom_fail_2.png",
                time: 60
            },
            {
                frame: "./misc/scene/bathroom_fail_3.png",
                time: 60
            },
            {
                frame: "./misc/scene/bathroom_fail_4.png",
                time: 60
            },
            {
                frame: "./misc/scene/bathroom_fail_5.png",
                time: 60
            },
            {
                frame: "./misc/scene/bathroom_fail_6.png",
                time: 60
            }
        ]
    }
];
export var environments = [];
export function initEnvironments(audio) {
    //master bedroom
    environments.push(get_house_master_bedroom(audio));
    //master bathroom
    environments.push(get_house_master_bathroom(audio));
    //second floor hall
    environments.push(get_house_second_floor(audio));
    //balcony
    environments.push(get_house_balcony(audio));
    //kids bedroom
    environments.push(get_house_kids_bedroom(audio));
    //second floor bathroom
    environments.push(get_house_general_bathroom(audio));
    //first floor foyer
    environments.push(get_house_first_floor(audio));
    //save room
    environments.push(get_house_save_room(audio));
    //kitchen
    environments.push(get_house_kitchen(audio));
    //dining room
    environments.push(get_house_dining(audio));
    //office
    environments.push(get_house_office(audio));
    //living room
    environments.push(get_house_living_room(audio));
    window.environments = environments;
}
export class Environment {
    //handles level data, backgrounds, objects, etc
    constructor(background, size, playarea, position, objects, autotriggers, toggletriggers, entities, ambient, overlay) {
        this.element = document.createElement("div");
        this.element.style.width = `${size.w}px`;
        this.element.style.height = `${size.h}px`;
        this.element.style.position = "absolute";
        this.position = {
            x: (320 - size.w) / 2,
            y: (180 - size.h) / 2
        }
        this.element.style.top = `${this.position.y}px`;
        this.element.style.left = `${this.position.x}px`;
        this.element.style.zIndex = 5;
        this.element.style.backgroundImage = `url(${background})`;
        this.playarea = playarea;
        this.playerPosition = position;
        this.objects = objects;
        this.objects_elems = [];
        this.setUpObjects();
        this.autotriggers = autotriggers;
        //this.visualiseTriggers(this.autotriggers);
        this.toggletriggers = toggletriggers;
        //this.visualiseTriggers(this.toggletriggers);
        this.entities = entities;
        this.ambient = ambient;
        this.overlay = overlay;
    }
    setUpObjects() {
        for (var i = 0; i < this.objects.length; i++) {
            const elem = document.createElement("div");
            elem.style.width = `${this.objects[i].size.w}px`;
            elem.style.height = `${this.objects[i].size.h}px`;
            elem.style.position = "absolute";
            elem.style.top = `${this.objects[i].at.y - this.objects[i].size.h + this.position.y}px`;
            elem.style.left = `${this.objects[i].at.x + this.position.x}px`;
            elem.style.zIndex = (this.objects[i].zIndex ? this.objects[i].zIndex : this.objects[i].at.y + this.position.y);
            elem.style.backgroundImage = `url(${this.objects[i].image})`;
            elem.style.backgroundSize = `cover`;
            this.objects_elems.push(elem);
        }
    }
    removeObjects() {
        for (var i = 0; i < this.objects_elems.length; i++) {
            this.objects_elems[i].remove();
        }
        this.objects_elems = [];
        for (var i = 0; i < this.entities.length; i++) {
            switch(this.entities[i].type) {
                case "enemy":
                    this.entities[i].enemy.sprite.updateSpritePosition({x: -100, y:-100});
                    this.entities[i].enemy.freeze(true);
                    break;
                case "lightsource":
                    break;
                case "reflection":
                default:
                    this.entities[i].sprite.updateSpritePosition({x: -100, y:-100});
                    break;
            }
        }
    }
    loadObjects() {
        for (var i = 0; i < this.objects_elems.length; i++) {
            playarea.appendChild(this.objects_elems[i]);
        }
        for (var i = 0; i < this.entities.length; i++) {
            switch(this.entities[i].type) {
                case "enemy":
                    this.entities[i].enemy.freeze(false);
                    break;
                default:
                    break;
            }
        }
    }
    visualiseTriggers(triggers) {
        for (var i = 0; i < triggers.length; i++) {
            const elem = document.createElement("div");
            elem.style.width = `${triggers[i].box.w}px`;
            elem.style.height = `${triggers[i].box.h}px`;
            elem.style.position = "absolute";
            elem.style.top = `${triggers[i].at.y - triggers[i].box.h}px`;
            elem.style.left = `${triggers[i].at.x}px`;
            elem.style.zIndex = triggers[i].at.y + this.position.y;
            elem.style.backgroundColor = "yellow";
            elem.style.opacity = 0.2;
            this.element.appendChild(elem);
        }
    }
    toggleTrigger(target, ui, game) {
        //determine if player is in any trigger area
        for (var i = 0; i < this.toggletriggers.length; i++) {
            if (this.checkInTrigger(this.toggletriggers[i], target, ui, game)) {
                return true;
            }
        }
    }
    checkInTrigger(trigger, target, ui, game) {
        if (target.position.x - target.box.sides <= trigger.at.x + trigger.box.w + this.position.x && target.position.x + target.box.sides >= trigger.at.x + this.position.x
        && target.position.y - target.box.top <= trigger.at.y + this.position.y && target.position.y >= trigger.at.y - trigger.box.h + this.position.y) {
            if(trigger.action(target, this, ui, game)) {
                return true;
            }
        }
    }
    loadOverlay() {
        if (this.overlay) {
            dark.fillStyle = "black";
            dark.fillRect(0,0,320,180);
            dark.save();
        } else {
            dark.clearRect(0, 0, 320, 180);
        }
    }
    updateOverlay(player) {
        //fill in the space
        dark.globalCompositeOperation = "source-over";
        dark.fillStyle = "black";
        dark.fillRect(0,0,320,180);
        //draw player sources
        dark.globalCompositeOperation = "destination-out";
        const plx = player.position.x;
        const ply = player.position.y - 16;
        var grad;
        if (player.possessions.equipped && player.possessions.equipped.name == "uv") {
            grad = dark.createRadialGradient(plx,ply,0,plx,ply,40);
            grad.addColorStop(0,"black");
            grad.addColorStop(1,"transparent");
            dark.fillStyle = grad;
            dark.fillRect(0,0,320,180);
            dark.globalCompositeOperation = "source-over";
            grad.addColorStop(0,"rgba(125,50,255,0.5)");
            grad.addColorStop(1,"transparent");
            dark.fillStyle = grad;
            dark.fillRect(0,0,320,180);
            dark.globalCompositeOperation = "destination-out";
        } else {
            grad = dark.createRadialGradient(plx,ply,0,plx,ply,20);
            grad.addColorStop(0,"black");
            grad.addColorStop(1,"transparent");
            dark.fillStyle = grad;
            dark.fillRect(0,0,320,180);
        }
        //draw entity sources
        for (var i = 0; i < this.entities.length; i++) {
            if (this.entities[i].type == "lightsource") {
                dark.beginPath();
                switch(this.entities[i].style) {
                    case "custom_0":
                        dark.moveTo(...this.entities[i].params[0]);
                        dark.lineTo(...this.entities[i].params[2]);
                        dark.bezierCurveTo(80, 77, 80, 67, ...this.entities[i].params[1]);
                        dark.lineTo(...this.entities[i].params[0]);
                        dark.fillStyle = "rgba(0,0,0,0.5)";
                        dark.fill();
                        grad = dark.createRadialGradient(this.entities[i].params[0][0] - 5, this.entities[i].params[0][1],1,this.entities[i].params[0][0] - 5, this.entities[i].params[0][1],10);
                        grad.addColorStop(0,"rgba(0,0,0,0.5)");
                        grad.addColorStop(1,"transparent");
                        dark.fillStyle = grad;
                        dark.fillRect(0,0,320,180);
                        break;
                    case "uv":
                        grad = dark.createRadialGradient(...this.entities[i].params[0],0,...this.entities[i].params[0],this.entities[i].params[1]);
                        grad.addColorStop(0,"black");
                        grad.addColorStop(1,"transparent");
                        dark.fillStyle = grad;
                        dark.fillRect(0,0,320,180);
                        dark.globalCompositeOperation = "source-over";
                        grad.addColorStop(0,"rgba(125,50,255,0.5)");
                        grad.addColorStop(1,"transparent");
                        dark.fillStyle = grad;
                        dark.fillRect(0,0,320,180);
                        dark.globalCompositeOperation = "destination-out";
                        break;
                    case "luminescent":
                        dark.clearRect(0,0,320,180);
                        if (player.possessions.equipped && player.possessions.equipped.name == "uv") {
                            const ent = this.entities[i].obj;
                            const corrpos = this.position;
                            const img = new Image();
                            img.onload = function() {
                                dark.globalCompositeOperation = "source-over";
                                dark.drawImage(img, ent.at.x + corrpos.x, ent.at.y + corrpos.y - ent.size.h);
                                dark.globalCompositeOperation = "destination-in";
                                grad = dark.createRadialGradient(plx,ply,35,plx,ply,40);
                                grad.addColorStop(0,"black");
                                grad.addColorStop(1,"transparent");
                                dark.fillStyle = grad;
                                dark.fillRect(0,0,320,180);
                                dark.globalCompositeOperation = "destination-out";
                            }
                            img.src = ent.image;
                        }
                        break;
                    case "light":
                        grad = dark.createRadialGradient(...this.entities[i].params[0],0,...this.entities[i].params[0],this.entities[i].params[1]);
                        grad.addColorStop(0,"black");
                        grad.addColorStop(1,"transparent");
                        dark.fillStyle = grad;
                        dark.fillRect(0,0,320,180);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    load() {
        playarea.appendChild(this.element);
        this.setUpObjects();
        this.loadObjects();
        this.ambient.handler.playAmbient(this.ambient.ambient, this.ambient.volume);
        this.loadOverlay();
    }
    unload() {
        this.element.remove();
        this.removeObjects();
    }
    loadAt(player, position) {
        //move player to starting position
        this.load();
        player.position = position;
        player.sprite.updateSpritePosition(player.position);
        player.inEnvironment = this;
    }
    isInsidePlayarea(target) {
        var result = true;
        result = target.position.x - target.box.sides >= this.playarea.x + this.position.x && target.position.x + target.box.sides <= this.playarea.x + this.position.x + this.playarea.w
        && target.position.y - target.box.top >= this.playarea.y + this.position.y && target.position.y <= this.playarea.y + this.position.y + this.playarea.h;
        if(result) {
            //is inside playarea -> check for object collision
            for (var i = 0; i < this.objects.length; i++) {
                if (target.position.x - target.box.sides <= this.objects[i].at.x + this.objects[i].box.w + this.position.x && target.position.x + target.box.sides >= this.objects[i].at.x + this.position.x
                && target.position.y - target.box.top <= this.objects[i].at.y + this.position.y && target.position.y >= this.objects[i].at.y - this.objects[i].box.h + this.position.y) {
                    return false;
                }
            }
            //check for enemy collision
            const correctionEnemy = {
                x: this.position.x + 16
            }
            for (var i = 0; i < this.entities.length; i++) {
                if(this.entities[i].type == "enemy") {
                    if (target.position.x - target.box.sides <= this.entities[i].enemy.position.x + this.entities[i].enemy.box.sides + correctionEnemy.x + 8
                    && target.position.x + target.box.sides >= this.entities[i].enemy.position.x + this.entities[i].enemy.box.sides + correctionEnemy.x
                    && target.position.y - target.box.top <= this.entities[i].enemy.position.y 
                    && target.position.y >= this.entities[i].enemy.position.y - this.entities[i].enemy.box.top) {
                        return false;
                    }
                }
            }
        }
        return result;
    }
}