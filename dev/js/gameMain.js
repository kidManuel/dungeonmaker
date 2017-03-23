window.addEventListener('load', function(event) {
    window.removeEventListener('load', arguments.callee, false);
    Object.freeze(window.globalparams = userParams ? userParams : defaultParams);
    window.devmode = globalparams.devMode;
    window.game = new GameMain(globalparams);
})

class GameMain {
    constructor() {
        let coms = this.communications = new ComunicationController();
        this.graphics = new GraphicsController(coms);
        this.dungeonGen = new DungeonGenerator(coms);
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
        }
        this.camera.setCameraCenterCell(kiwi.x, kiwi.y);
        this.entities.populate(this.communications.request('getReadyCells'), globalparams.population, 'enemies');
        this.graphics.massExpress(this.layout);
    }

    initTestEntity() {
        let initialCell = this.dungeonGen.readyCells.randomElement();
        window.kiwi = new Entity('testInstance', initialCell.x, initialCell.y, 'character')
        this.entities.decorateEntity(kiwi, 'race.human');
        initialCell.entity = kiwi;
        this.player.setEntityControl(kiwi);
    }
}
