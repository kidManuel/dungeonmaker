class Player extends Speaker {
    constructor(communications, controllingEntity) {
        super(communications)
        if (typeof controllingEntity !== 'undefined') {
            this.setControllingEntiy(controllingEntity);
        }
        this.listenTo('keyMoveUp');
        this.listenTo('keyMoveDown');
        this.listenTo('keyMoveLeft');
        this.listenTo('keyMoveRight');
    }

    setEntityControl(entity) {
        if (entity instanceof Entity) {
            this.entity = entity;
        }
    }

    onKeyMoveUp(){
        this.dispatch('requestEntityMove', {entity: this.entity, x:0 , y:-1 })
        this.dispatch('requestCameraOn', this.getPlayerLocation());
    }
    onKeyMoveDown(){
        this.dispatch('requestEntityMove', {entity: this.entity, x:0 , y:1 })
        this.dispatch('requestCameraOn', this.getPlayerLocation());
    }
    onKeyMoveLeft(){
        this.dispatch('requestEntityMove', {entity: this.entity, x:-1 , y:0 })
        this.dispatch('requestCameraOn', this.getPlayerLocation());
    }
    onKeyMoveRight(){
        this.dispatch('requestEntityMove', {entity: this.entity, x:1 , y:0 })
        this.dispatch('requestCameraOn', this.getPlayerLocation());
    }

    getPlayerLocation() {
        return [this.entity.x, this.entity.y];
    }

}
