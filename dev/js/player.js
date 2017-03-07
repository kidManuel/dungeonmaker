class Player  {
    constructor(communications, controllingEntity) {
        this.coms = communications;
        if (typeof controllingEntity !== 'undefined') {
            this.setControllingEntiy(controllingEntity);
        }
        this.coms.listenTo('keyMoveUp', this);
        this.coms.listenTo('keyMoveDown', this);
        this.coms.listenTo('keyMoveLeft', this);
        this.coms.listenTo('keyMoveRight', this);
        this.coms.registerMethod('getPlayerLocation', this);
    }

    setEntityControl(entity) {
        if (entity instanceof Entity) {
            this.entity = entity;
        }
    }

    onKeyMoveUp(){
        this.coms.dispatch('requestEntityMove', {entity: this.entity, x:0 , y:-1 })
        this.coms.dispatch('requestCameraOn', this.getPlayerLocation());
    }
    onKeyMoveDown(){
        this.coms.dispatch('requestEntityMove', {entity: this.entity, x:0 , y:1 })
        this.coms.dispatch('requestCameraOn', this.getPlayerLocation());
    }
    onKeyMoveLeft(){
        this.coms.dispatch('requestEntityMove', {entity: this.entity, x:-1 , y:0 })
        this.coms.dispatch('requestCameraOn', this.getPlayerLocation());
    }
    onKeyMoveRight(){
        this.coms.dispatch('requestEntityMove', {entity: this.entity, x:1 , y:0 })
        this.coms.dispatch('requestCameraOn', this.getPlayerLocation());
    }

    getPlayerLocation() {
        return [this.entity.x, this.entity.y];
    }



}
