window.addEventListener('load', function(event) {
    window.removeEventListener('DOMContentLoaded', arguments.callee, false);
    Object.freeze(window.globalparams = userParams ? userParams : defaultParams);
    window.devmode = globalparams.devMode;
    window.game = new GameMain(globalparams);
});

function elel(){
    console.log(this)
}

class GameMain {
    constructor() {
        let coms = this.comunications = new ComunicationController();
        this.graphics = new GraphicsController(coms);
        this.dungeonGen = new DungeonGenerator();
        this.camera = new CameraController(coms);
        this.mouse = new MouseController(coms);
        this.keyboard = new KeyboardController(coms);
        this.layout = this.dungeonGen.generateFloor(globalparams.dunWidth, globalparams.dunHeight);
        this.entities = new EntitiesController(coms, this.layout);
        this.player = new Player(coms);
        this.onReady();
    }

    onReady() {
        this.initTestEntity();
        if (devmode) {
            window.dun = this.layout;
            window.graphs = this.graphics;
            window.playerpos = this.player.getPlayerLocation();
        }
        this.graphics.massExpress(this.layout);
    }

    initTestEntity() {
        let initialCell = this.dungeonGen.readyCells.randomElement();
        window.testdude = new Entity('testInstance', initialCell.x, initialCell.y, 'character')
        initialCell.entity = testdude;
        this.player.setEntityControl(testdude);
    }
}
