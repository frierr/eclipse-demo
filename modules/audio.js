const sources = [
    "./audio/sfx/FootstepsStoneDirt4.ogg", //0 - player step
    "./audio/sfx/OldDoorOpen.ogg", //1 - door open
    "./audio/sfx/OldDoorClose.ogg" //2 - door close
];

export class AudioHandler {
    constructor(volume) {
        this.general_volume = volume;
        this.ambient = new Audio();
        this.ambient.loop = true;
        this.music = new Audio();
        this.music.loop = true;
        this.sfx_player = new Audio();
        this.sfx = new Audio();
    }
    playerSoundStep() {
        this.sfx_player.volume = 0.2 * this.general_volume;
        this.sfx_player.setAttribute('src', sources[0]);
        this.sfx_player.load();
        this.sfx_player.play();
    }
    playAmbient(source, volume) {
        this.ambient.volume = volume * this.general_volume;
        if(source != this.ambient.src) {
            this.ambient.setAttribute('src', source);
            this.ambient.load();
            this.ambient.play();
        }
    }
    playDoorOpen() {
        this.sfx.volume = 0.8 * this.general_volume;
        this.sfx.setAttribute('src', sources[1]);
        this.sfx.load();
        this.sfx.play();
    }
    playDoorClose() {
        this.sfx.volume = 0.8 * this.general_volume;
        this.sfx.setAttribute('src', sources[2]);
        this.sfx.load();
        this.sfx.play();
    }
    playSFX(source) {
        this.sfx.volume = 0.8 * this.general_volume;
        this.sfx.setAttribute('src', source);
        this.sfx.load();
        this.sfx.play();
    }
}