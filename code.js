const outer = document.getElementById("outer");
const inner = document.getElementById("inner");
const playarea = document.getElementById("playarea");
const iface = document.getElementById("interface");
const fakemouse = document.getElementById("fakemouse");

window.onload = function() {
    updateScale();
    tempAddCharacterSprite1();
    //waitingTest();
    playerControlTest();
}

//scales the image according to current screen size
window.onresize = function() {
    updateScale();
}

var rect;
function updateScale() {
    const bounds = [outer.clientWidth, outer.clientHeight];
    inner.style.transform = `scale(${Math.min(bounds[0] / 320, bounds[1] / 180)})`;
    rect = inner.getBoundingClientRect();
}

const elem = document.createElement("canvas");
const gr = elem.getContext("2d");
var img = new Image();
img.addEventListener('load', function() {
    //sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
    gr.drawImage(img, 0, 0, 32, 32, 0, 0, 32, 32);
});
img.src = "./player_basic.png";

function tempAddCharacterSprite1() {
    elem.style.width = "32px";
    elem.style.height = "32px";
    elem.style.position = "relative";
    elem.style.top = (player.pos.y - 32) + "px";
    elem.style.left = (player.pos.x - 16) + "px";
    elem.width = 32;
    elem.height = 32;
    player.model = elem;
    playarea.appendChild(elem);
}

var frame = 0;
function doAnimFrame() {
    gr.clearRect(0,0,32,32);
    gr.drawImage(img, frame * 32, animation * 32, 32, 32, 0, 0, 32, 32);
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitingTest() {
    var sleeper = sleep(1000 * 2); //does something for 2 seconds
    console.log("do smth");
    console.log("do smth");
    console.log("do smth");
    await sleep(1000 * 3); //does something for 3 seconds
    console.log("3 sec passed");
    await sleeper; //should return immedeately
    console.log("done");
}

const fps = 1000/60;
const anim_timing = 10;
var current_at = 0;
var animation = 0;//depending on rotation

async function playerControlTest() {
    while(true) {
        var sleeper = sleep(fps);
        playerRotation();
        if (playerMove()) {
            //do move animation
            current_at++;
            if(current_at == anim_timing) {
                current_at = 0;
                frame++;
                if(frame >= 4){
                    frame = 0;
                }
                doAnimFrame();
            }
        } else {
            frame = 0;
            current_at = 0;
            doAnimFrame();
        }
        await sleeper;
    }
}

var player = {
    model: undefined,
    pos: {
        x: 160,
        y: 90
    }
}

function playerRotation() {
    const angle = Math.atan2(player.pos.y - mouseY, player.pos.x - mouseX) * 180 / Math.PI;
    //8 directions: 0 - left, 45 - left bot, 90 - bot, etc
    //0-bot,1-bot-right,2-right,3-top-right,4-top,5-top-left,6-left,7-bot-left
    if (angle >= -22.5 && angle <= 22.5) {
        animation = 6;
    } else if (angle > 22.5 && angle < 67.5) {
        animation = 5;
    } else if (angle >= 67.5 && angle <= 112.5) {
        animation = 4;
    } else if (angle > 112.5 && angle < 147.5) {
        animation = 3;
    } else if (angle < -22.5 && angle > -67.5) {
        animation = 7;
    } else if (angle <= -67.5 && angle >= -112.5) {
        animation = 0;
    } else if (angle < -112.5 && angle > -147.5) {
        animation = 1;
    } else {
        animation = 2;
    }
}

function updateModelPos() {
    player.model.style.top = (player.pos.y - 32) + "px";
    player.model.style.left = (player.pos.x - 16) + "px";
}

function playerMove() {
    const Xaxis = 0 + (keys_pressed[1] ? -1 : 0) + (keys_pressed[3] ? 1 : 0);
    const Yaxis = 0 + (keys_pressed[0] ? -1 : 0) + (keys_pressed[2] ? 1 : 0);
    if (Xaxis != 0 || Yaxis != 0) {
        //do movement
        if (Xaxis != 0) {
            if (Yaxis != 0) {
                player.pos.x = player.pos.x + Xaxis * 1;
                player.pos.y = player.pos.y + Yaxis * 1;
            } else {
                player.pos.x = player.pos.x + Xaxis * 2;
            }
        } else {
            player.pos.y = player.pos.y + Yaxis * 2;
        }
        updateModelPos();
        return true;
    } else {
        return false;
    }
}

/*
CONTROLS
*/

var mouseX = 0, mouseY = 0;
window.onmousemove = function(e) {
    mouseX = (320 * (e.clientX - rect.x)) / rect.width;
    mouseY = (180 * (e.clientY - rect.y)) / rect.height;
    fakemouse.style.top = mouseY + "px";
    fakemouse.style.left = mouseX + "px";
}

var mouse_down = false;
window.onmousedown = function() {
    mouse_down = true;
}

window.onmouseup = function() {
    mouse_down = false;
}

var keys_pressed = [false, false, false, false]; //W A S D
document.addEventListener('keydown', (event) => {
    switch (event.code) {
    case "KeyW":
        keys_pressed[0] = true;
        break;
    case "KeyA":
        keys_pressed[1] = true;
        break;
    case "KeyS":
        keys_pressed[2] = true;
        break;
    case "KeyD":
        keys_pressed[3] = true;
        break;
    default:
        return;
    }
});

document.addEventListener('keyup', (event) => {
	switch (event.code) {
    case "KeyW":
        keys_pressed[0] = false;
        break;
    case "KeyA":
        keys_pressed[1] = false;
        break;
    case "KeyS":
        keys_pressed[2] = false;
        break;
    case "KeyD":
        keys_pressed[3] = false;
        break;
    default:
        return;
    }
});