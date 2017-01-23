document.addEventListener('DOMContentLoaded', function(event) {
    document.removeEventListener('DOMContentLoaded', arguments.callee, false);
    Object.freeze(window.params = userParams ? userParams : defaultParams);
    window.game = new GameMain(params);
    game.afterReady();
});

class GameMain {
    constructor() {
        this.graphics = new GraphicsController();
        window.graphics = this.graphics;
        this.dungeon = new DungeonFloor(params.dunWidth, params.dunHeight);
        this.mouse = new MouseController();
        if (params.devMode) {
            window.dun = this.dungeon;
        }
    }

    afterReady() {
        //review sometime
    }
}
