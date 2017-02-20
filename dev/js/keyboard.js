class KeyboardController extends Speaker {
    constructor(comunications) {
        super(comunications);
        var me = this;
        window.addEventListener('keydown', function(event) {me.keydown(event)}, false);
    }
    keydown(event) {
        switch (event.code) {
            case 'KeyW': // Left
                this.dispatch('keyMoveUp');
                break;
            case 'KeyA': // Up
                this.dispatch('keyMoveLeft');
                break;
            case 'KeyS': // Right
                this.dispatch('keyMoveDown');
                break;
            case 'KeyD': // Down
                this.dispatch('keyMoveRight');
                break;
        }
    }
}
