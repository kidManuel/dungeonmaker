window.addEventListener('load', function (event) {
    window.removeEventListener('load', arguments.callee, false);
    Object.freeze(window.globalparams = userParams ? userParams : defaultParams);
    window.devmode = globalparams.devMode;
    window.game = new GameMain(globalparams);
})

class GameMain {
    constructor() {
        let coms = this.communications = new ComunicationController();
        this.controllers = {
            graphics : new GraphicsController(coms),
            dungeonGen : new DungeonGenerator(coms),
            camera : new CameraController(coms),
            mouse : new MouseController(coms),
            keyboard : new KeyboardController(coms),
            entities : new EntitiesController(coms),
            player : new Player(coms),
        }
        window.$ = this.controllers;
        $.layout = $.dungeonGen.generateFloor(globalparams.dunWidth, globalparams.dunHeight),
        this.onReady();
    }

    onReady() {
        this.initTestEntity();
        if (devmode) {
            window.dun = this.layout;
            window.graphs = this.graphics;
        }
        this.controllers.camera.setCameraCenterCell(kiwi.x, kiwi.y);
        this.controllers.entities.populate(this.communications.request('getReadyCells'), globalparams.population, 'enemies');
        this.controllers.graphics.massExpress($.layout);
    }

    initTestEntity() {
        let initialCell = this.controllers.dungeonGen.readyCells.randomElement();
        window.kiwi = new Entity(this.communications, 'testInstance', initialCell.x, initialCell.y, 'character')
        this.controllers.entities.decorateEntity(kiwi, 'race.human');
        initialCell.entity = kiwi;
        this.controllers.player.setEntityControl(kiwi);
    }

    getEntity(x, y) {
        return this.controllers.layout.cellAt(x, y).entity
    }
}
