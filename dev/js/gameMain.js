document.addEventListener('DOMContentLoaded', function(event) {
    document.removeEventListener('DOMContentLoaded', arguments.callee, false);
    Object.freeze(window.globalparams = userParams ? userParams : defaultParams);
    window.game = new GameMain(globalparams);
    game.afterReady();
});

class GameMain {
    constructor() {
        this.graphics = new GraphicsController();
        window.graphics = this.graphics;
        this.dungeon = new DungeonFloor(params.dunWidth, params.dunHeight);
        this.mouse = new MouseController();
        if (globalparams.devMode) {
            window.dun = this.dungeon;
        }
    }

    afterReady() {
        //review sometime
    }
}
