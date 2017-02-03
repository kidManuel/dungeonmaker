spriteSheet = new Image();
spriteSheet.src = 'imgs/spr.png';
characters = new Image();
characters.src = 'imgs/characters.png';

document.addEventListener('DOMContentLoaded', function(event) {
    document.removeEventListener('DOMContentLoaded', arguments.callee, false);
    Object.freeze(window.globalparams = userParams ? userParams : defaultParams);
    window.game = new GameMain(globalparams);
});

class GameMain {
    constructor() {
        this.graphics = new GraphicsController();
        this.dungeonGen = new DungeonGenerator();
        this.mouse = new MouseController();
        this.floor = this.dungeonGen.generateFloor(globalparams.dunWidth, globalparams.dunHeight);
        this.onReady();
    }

    onReady() {
        this.initTestEntity();
        if (globalparams.devMode) {
            window.dun = this.floor;
        }
        this.graphics.massExpress(this.floor);
    }

    initTestEntity() {
        this.floor[0][2].entity = new Entity('testInstance', 'character');
    }
}
