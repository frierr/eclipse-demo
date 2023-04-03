const outer = document.getElementById("outer");
const inner = document.getElementById("inner");

import { sleep } from "./modules/basics.js";
import { GameInterface, tickContextText } from "./modules/UI.js";
import { Entity } from "./modules/entity.js";
import { Player } from "./modules/player.js";
import { initEnvironments, environments, scenes } from "./modules/environment.js";

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
    window.game = game;//for debug purposes, delete later?
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
    game.ui.displayStartingScreen(game);
    //game.play();
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
    case "Tab":
        if(game) {
            game.showPlayerInventory();
        }
        event.preventDefault();
        event.stopPropagation();
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

/*
MAIN GAME FUNCTIONS
*/

const gametick = 1000 / 60; //updates at 60 fps
class Game {
    //controls all game related stuff
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.player = new Player();
        this.ui = new GameInterface();
        //this.stages = new StageCollection();
        this.paused = true;
        this.inInventory = false;
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
            if(this.player.inEnvironment.toggleTrigger(this.player, this.ui, this)){
                this.paused = true;
                return;
            }
        } else {
            this.paused = this.ui.interact();
        }
    }
    showPlayerInventory() {
        if (!this.paused && !this.inInventory) {
            this.paused = true;
            this.inInventory = true;
            this.ui.displayInventory(this.player);
        } else {
            this.paused = false;
            this.inInventory = false;
            this.ui.hideInventory();
        }
    }
    async play() {
        this.paused = false;
        //this.ui.displayScene(scenes[0], this);
        this.player.possessions.journal.push("As I opened my eyes, I felt the pounding in my head and the soreness in my limbs. I looked around and realized I was in an unfamiliar bedroom, with no memory of how I got there. The room was dimly lit, with heavy curtains covering the windows. Everything felt surreal and hazy, like a dream. Panic set in as I struggled to remember who I was and how I ended up in this strange place.");
        environments[0].env.loadAt(this.player, environments[0].env.playerPosition);
        while(true) {//update condition later
            let sleeper = sleep(gametick);
            if(!this.paused) {
                this.handlePlayer();
                this.handleEntities();
                this.ui.tickUI();
                tickContextText();
            }
            await sleeper;
        }
    }
    handlePlayer() {
        this.player.rotate(this.mouseX, this.mouseY);
        this.player.move(keys_pressed);
    }
    handleEntities() {
        for (var i = 0; i < this.player.inEnvironment.entities.length; i++) {
            var ent = this.player.inEnvironment.entities[i];
            switch(ent.type) {
                case "reflection":
                    Entity.doReflection(ent, this.player, this.player.inEnvironment.position);
                    break;
                default:
                    break;
            }
        }
    }
}

/*
UNUSED
REMOVE THESE??
*/

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
