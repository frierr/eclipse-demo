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
        this.music.type = "";
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
    stopMusic() {
        this.music.pause();
        this.music.type = "";
    }
    playMusic(type, volume) {
        this.music.volume = volume * this.general_volume;
        if (this.music.type != type) {
            this.music.type = type;
            switch(type) {
                case "menu":
                    this.music.src = "./audio/music/Mellow_Ambient_Track.ogg";
                    break;
                case "save":
                    this.music.src = "./audio/music/music-box.mp3";
                    break;
                case "bg_0":
                    this.music.src = "./audio/music/Dark_Pulsating_Ambient.ogg";
                    break;
                case "fight_0":
                    this.music.src = "./audio/music/Chaos_Loop.ogg";
                    break;
                case "boss":
                    this.music.src = "./audio/music/Weird_Pedal_Noise_001.ogg";
                    break;
                default:
                    break;
            }
            this.music.load();
            this.music.play();
        }
    }
}