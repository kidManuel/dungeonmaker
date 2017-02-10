class Player extends Speaker {
    constructor(comunications, controllingEntity) {
        super(comunications)
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
    }
    onKeyMoveDown(){
        this.dispatch('requestEntityMove', {entity: this.entity, x:0 , y:1 })
    }
    onKeyMoveLeft(){
        this.dispatch('requestEntityMove', {entity: this.entity, x:-1 , y:0 })
    }
    onKeyMoveRight(){
        this.dispatch('requestEntityMove', {entity: this.entity, x:1 , y:0 })
    }

}
