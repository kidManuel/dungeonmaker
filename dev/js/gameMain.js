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
        this.layout = this.dungeonGen.generateFloor(globalparams.dunWidth, globalparams.dunHeight);
        this.entities = new EntitiesController(this.layout);
        this.onReady();
    }

    onReady() {
        this.initTestEntity(2,2);
        if (globalparams.devMode) {
            window.dun = this.layout;
            window.graphs = this.graphics;
        }
        this.graphics.massExpress(this.layout);
    }

    initTestEntity(x, y) {
        window.testdude = new Entity('testInstance', x, y, 'character')
        this.layout[x][y].entity = testdude;
    }
}
