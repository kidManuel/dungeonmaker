class KeyboardController  {
    constructor() {
        var me = this;
        window.addEventListener('keydown', function(event) {me.keydown(event)}, false);
    }
    keydown(event) {
        switch (event.code) {
            case 'KeyW': // Left
                $.player.keyMoveUp();
                break;
            case 'KeyA': // Up
                $.player.keyMoveLeft();
                break;
            case 'KeyS': // Right
                $.player.keyMoveDown();
                break;
            case 'KeyD': // Down
                $.player.keyMoveRight();
                break;
        }
    }
}
