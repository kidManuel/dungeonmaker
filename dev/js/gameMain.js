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
        this.graphics.massExpress(this.floor);
        if (globalparams.devMode) {
            window.dun = this.floor;
        }

        //this.afterReady();
    }

    afterReady() {
        //review sometime
    }
}
