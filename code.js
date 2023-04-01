const outer = document.getElementById("outer");
const inner = document.getElementById("inner");

const size = {
    width: 320,
    height: 180
} //size of the inner screen

/*
ESSENTIALS
*/

//scales the image according to current screen size
window.onresize = function() {
    updateScale();
}
var rect;
function updateScale() {
    const bounds = [outer.clientWidth, outer.clientHeight];
    inner.style.transform = `scale(${Math.min(bounds[0] / size.width, bounds[1] / size.height)})`;
    rect = inner.getBoundingClientRect();
}

var game;
var mouseX = 0, mouseY = 0;
var mouse_down = false;
window.onload = function() {
    updateScale();
    game = new Game();
    //adds controls handle
    window.onmousemove = function(e) {
        mouseX = (size.width * (e.clientX - rect.x)) / rect.width;
        mouseY = (size.height * (e.clientY - rect.y)) / rect.height;
        game.mousemove(mouseX, mouseY);
    }
    window.onmousedown = function() {
        mouse_down = true;
        game.mousestate(mouse_down);
    }
    window.onmouseup = function() {
        mouse_down = false;
        game.mousestate(mouse_down);
    }
    initEnvironments();
    game.play();
}

/*
KEY BINDING
*/

var keys_pressed = {
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false
}
document.addEventListener('keydown', (event) => {
    switch (event.code) {
    case "KeyW":
        keys_pressed.moveUp = true;
        break;
    case "KeyA":
        keys_pressed.moveLeft = true;
        break;
    case "KeyS":
        keys_pressed.moveDown = true;
        break;
    case "KeyD":
        keys_pressed.moveRight = true;
        break;
    case "KeyE":
        if(game) {
            game.playerInteract();
        }
        break;
    default:
        return;
    }
});

document.addEventListener('keyup', (event) => {
	switch (event.code) {
    case "KeyW":
        keys_pressed.moveUp = false;
        break;
    case "KeyA":
        keys_pressed.moveLeft = false;
        break;
    case "KeyS":
        keys_pressed.moveDown = false;
        break;
    case "KeyD":
        keys_pressed.moveRight = false;
        break;
    default:
        return;
    }
});

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
MAIN GAME FUNCTIONS
*/

const gametick = 1000 / 60; //updates at 60 fps
const animtick = 15; // (60 / 4) animation updates 4 times a second
class Game {
    //controls all game related stuff
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.player = new Player();
        //this.stages = new StageCollection();
        this.current_environment = 0;
        this.paused = true;
    }
    mousemove(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        if(!this.paused) {
            this.player.rotate(this.mouseX, this.mouseY);
        }
    }
    mousestate(mouse) {
        //console.log(mouse);
        if(!this.paused) {
        }
    }
    playerInteract() {
        if(!this.paused) {
            environments[0].env.toggleTrigger(this.player);
        }
    }
    async play() {
        this.paused = false;
        environments[0].env.load();
        while(true) {//update condition later
            let sleeper = sleep(gametick);
            if(!this.paused) {
                this.handlePlayer();
                tickContextText();
            }
            await sleeper;
        }
    }
    handlePlayer() {
        this.player.rotate(this.mouseX, this.mouseY);
        this.player.move(keys_pressed, environments[this.current_environment].env);
    }
}

class Player {
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
    }
    rotate(targetX, targetY) {
        this.sprite.rotateSprite(this.position.x, this.position.y, targetX, targetY);
    }
    positionChanged(keys_pressed, environment) {
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
            if (!environment.isInsidePlayarea(this)) {
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
    move(keys_pressed, environment) {
        if (this.positionChanged(keys_pressed, environment)) {
            //do move animation
            this.current_animation_timing++;
            if(this.current_animation_timing == animtick) {
                this.current_animation_timing = 0;
                this.sprite.frame++;
                if (this.sprite.frame >= 4) {
                    this.sprite.frame = 0;
                }
                this.sprite.doAnimFrame();
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

const contexttext = document.getElementById("contexttext");
const cttime = 10;
var ctcurrent = 0;
var ctopacity = 0;
function tickContextText() {
    ctcurrent = Math.max(0, ctcurrent - 1);
    if (ctcurrent < cttime) {
        ctopacity -= 0.1;
    }
    contexttext.style.opacity = Math.max(0, ctopacity);
}
function displayContextTextAt(position, text, timeup) {
    ctopacity = 1;
    ctcurrent = timeup;
    contexttext.textContent = text;
    contexttext.style.top = `${position.y}px`;
    contexttext.style.left = `${position.x}px`;
}

const playarea = document.getElementById("playarea");
const toDegree = 180 / Math.PI;
class Sprite {
    //handles entity sprites
    constructor(image, position, size) {
        this.size = size;
        this.element = document.createElement("canvas");
        this.graphics = this.element.getContext("2d");
        this.element.style.width = `${size.w}px`;
        this.element.style.height = `${size.h}px`;
        this.element.style.position = "relative";
        this.element.style.zIndex = 69;
        this.updateSpritePosition(position);
        this.element.width = size.w;
        this.element.height = size.h;
        playarea.appendChild(this.element);
        this.img = new Image();
        this.img.src = image;
        this.animation = 0;
        this.frame = 0;
    }
    rotateSprite(posX, posY, targetX, targetY) {
        const angle = Math.atan2(posY - targetY, posX - targetX) * toDegree;
        //0-bot,1-bot-right,2-right,3-top-right,4-top,5-top-left,6-left,7-bot-left
        if (angle >= -22.5 && angle <= 22.5) {
            this.animation = 6;
        } else if (angle > 22.5 && angle < 67.5) {
            this.animation = 5;
        } else if (angle >= 67.5 && angle <= 112.5) {
            this.animation = 4;
        } else if (angle > 112.5 && angle < 147.5) {
            this.animation = 3;
        } else if (angle < -22.5 && angle > -67.5) {
            this.animation = 7;
        } else if (angle <= -67.5 && angle >= -112.5) {
            this.animation = 0;
        } else if (angle < -112.5 && angle > -147.5) {
            this.animation = 1;
        } else {
            this.animation = 2;
        }
    }
    doAnimFrame() {
        this.graphics.clearRect(0, 0, this.size.w, this.size.h);
        this.graphics.drawImage(this.img, this.frame * this.size.w, this.animation * this.size.h, this.size.w, this.size.h, 0, 0, this.size.w, this.size.h);
    }
    updateSpritePosition(position) {
        this.element.style.top = `${position.y - 32}px`;
        this.element.style.left = `${position.x - 16}px`;
    }
}

const iface = document.getElementById("interface");
class GameInterface {
    //displays menus and other ui
}

var environments = [];
function initEnvironments() {
    environments.push(
        {
            name: "house_master_bedroom",
            env: new Environment(
                "./levels/house_master_bedroom.png", 
                {w:160,h:112}, 
                {x:0, y:49, w:160, h:63}, 
                {x:160,y:110},
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
                        action: function(target, environment) {
                            target.displayText("Nothing useful inside...", 90, {x: 160, y: 50});
                        }
                    },
                    {
                        name: "window",
                        at: {x: 72, y: 60},
                        box: {h: 10, w: 34},
                        action: function(target, environment) {
                            target.displayText("It's dark and raining...", 90, {x: 87, y: 45});
                        }
                    },
                    {
                        name: "topdoor",
                        at: {x: 15, y: 60},
                        box: {h: 10, w: 16},
                        action: function(target, environment) {
                            target.displayText("door", 90, {x: 90, y: 50});
                        }
                    },
                    {
                        name: "rightdoor",
                        at: {x: 150, y: 100},
                        box: {h: 20, w: 10},
                        action: function(target, environment) {
                            target.displayText("The door is locked...", 90, {x: 212, y: 90});
                        }
                    },
                    {
                        name: "drawer",
                        at: {x: 20, y: 112},
                        box: {h: 10, w: 10},
                        action: function(target, environment) {
                            for (var i = 0; i < environment.objects.length; i++) {
                                if (environment.objects[i].name == "drawer") {
                                    environment.objects[i].image = "./levels/objects/drawer.png";
                                    environment.removeObjects();
                                    environment.setUpObjects();
                                    environment.loadObjects();
                                    break;
                                }
                            }
                        }
                    }
                ]
                )
        }
    );
}
class Environment {
    //handles level data, backgrounds, objects, etc
    constructor(background, size, playarea, position, objects, autotriggers, toggletriggers) {
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
        this.toggletriggers = toggletriggers;
        //this.visualiseTriggers(this.toggletriggers);
    }
    setUpObjects() {
        for (var i = 0; i < this.objects.length; i++) {
            const elem = document.createElement("div");
            elem.style.width = `${this.objects[i].size.w}px`;
            elem.style.height = `${this.objects[i].size.h}px`;
            elem.style.position = "absolute";
            elem.style.top = `${this.objects[i].at.y - this.objects[i].size.h + this.position.y}px`;
            elem.style.left = `${this.objects[i].at.x + this.position.x}px`;
            elem.style.zIndex = this.objects[i].at.y + this.position.y;
            elem.style.backgroundImage = `url(${this.objects[i].image})`;
            this.objects_elems.push(elem);
        }
    }
    removeObjects() {
        for (var i = 0; i < this.objects_elems.length; i++) {
            this.objects_elems[i].remove();
        }
        this.objects_elems = [];
    }
    loadObjects() {
        for (var i = 0; i < this.objects_elems.length; i++) {
            playarea.appendChild(this.objects_elems[i]);
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
    toggleTrigger(target) {
        //determine if player is in any trigger area
        for (var i = 0; i < this.toggletriggers.length; i++) {
            if (target.position.x - target.box.sides <= this.toggletriggers[i].at.x + this.toggletriggers[i].box.w + this.position.x && target.position.x + target.box.sides >= this.toggletriggers[i].at.x + this.position.x
            && target.position.y - target.box.top <= this.toggletriggers[i].at.y + this.position.y && target.position.y >= this.toggletriggers[i].at.y - this.toggletriggers[i].box.h + this.position.y) {
                this.toggletriggers[i].action(target, this);
                return;
            }
        }
    }
    load() {
        playarea.appendChild(this.element);
        this.loadObjects();
    }
    unload() {
        this.element.remove();
        this.removeObjects();
    }
    loadAt(player, position) {
        //move player to starting position
        playarea.appendChild(this.element);
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
        }
        return result;
    }
}

class StageCollection {
    //contains all the stages
    constructor() {
        this.collection = [];
        this.collection.push(new Stage());
    }
}

class Stage {
    //handles level scripting
    constructor() {
        //
    }
}

class Actor {
    //handles other actors
}
