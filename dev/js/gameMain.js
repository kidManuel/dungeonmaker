document.addEventListener('DOMContentLoaded', function(event) {
    document.removeEventListener('DOMContentLoaded', arguments.callee, false);
    Object.freeze(window.params = userParams ? userParams : defaultParams);
    window.game = new GameMain(params);
});

class GameMain {
    constructor() {
        this.density = params.density; // ammount of attempts at filling the floor.
        this.graphics = new GraphicsController();
        window.graphics = this.graphics;
        this.dungeon = new Dungeon(params.dunWidth, params.dunHeigth);
        if (params.devMode) {
            window.dun = this.dungeon;
        }
    }

    


}
