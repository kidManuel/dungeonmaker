class KeyboardController  {
    constructor(communications) {
        this.coms = communications;;
        var me = this;
        window.addEventListener('keydown', function(event) {me.keydown(event)}, false);
    }
    keydown(event) {
        switch (event.code) {
            case 'KeyW': // Left
                this.coms.dispatch('keyMoveUp');
                break;
            case 'KeyA': // Up
                this.coms.dispatch('keyMoveLeft');
                break;
            case 'KeyS': // Right
                this.coms.dispatch('keyMoveDown');
                break;
            case 'KeyD': // Down
                this.coms.dispatch('keyMoveRight');
                break;
        }
    }
}
