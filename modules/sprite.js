const playarea = document.getElementById("playarea");
const toDegree = 180 / Math.PI;
export class Sprite {
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