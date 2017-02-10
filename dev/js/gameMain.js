spriteSheet = new Image();
spriteSheet.src = 'imgs/spr.png';
characters = new Image();
characters.src = 'imgs/characters.png';

document.addEventListener('DOMContentLoaded', function(event) {
    document.removeEventListener('DOMContentLoaded', arguments.callee, false);
    Object.freeze(window.globalparams = userParams ? userParams : defaultParams);
    window.devmode = globalparams.devMode;
    window.game = new GameMain(globalparams);
});

class GameMain {
    constructor() {
        let coms = this.comunications = new ComunicationController();
        this.graphics = new GraphicsController(coms);
        this.dungeonGen = new DungeonGenerator();
        this.mouse = new MouseController();
        this.layout = this.dungeonGen.generateFloor(globalparams.dunWidth, globalparams.dunHeight);
        this.entities = new EntitiesController(coms, this.layout);
        this.player = new Player();
        this.onReady();
    }

    onReady() {
        this.initTestEntity(2,2);
        if (devmode) {
            window.dun = this.layout;
            window.graphs = this.graphics;
        }
        this.graphics.massExpress(this.layout);
    }

    initTestEntity(x, y) {
        window.testdude = new Entity('testInstance', x, y, 'character')
        this.layout[x][y].entity = testdude;
        this.player.setEntityControl(testdude);
    }
}
