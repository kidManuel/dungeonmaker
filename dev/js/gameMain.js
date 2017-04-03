window.addEventListener('load', function (event) {
    window.removeEventListener('load', arguments.callee, false);
    Object.freeze(window.globalparams = userParams ? userParams : defaultParams);
    window.devmode = globalparams.devMode;
    window.game = new GameMain(globalparams);
})

class GameMain {
    constructor() {
        this.controllers = {
            graphics : new GraphicsController(),
            dungeonGen : new DungeonGenerator(),
            camera : new CameraController(),
            mouse : new MouseController(),
            keyboard : new KeyboardController(),
            entities : new EntitiesController(),
            player : new Player(),
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
        $.camera.setCameraCenterCell(kiwi.x, kiwi.y);
        $.entities.populate($.dungeonGen.getReadyCells(), globalparams.population, 'enemies');
        $.graphics.massExpress($.layout);
    }

    initTestEntity() {
        let initialCell = $.dungeonGen.readyCells.randomElement();
        window.kiwi = new Entity('testInstance', initialCell.x, initialCell.y, 'character')
        $.entities.decorateEntity(kiwi, 'race.human');
        initialCell.entity = kiwi;
        $.player.setEntityControl(kiwi);
    }

    getEntity(x, y) {
        return $.layout.cellAt(x, y).entity
    }
}
c