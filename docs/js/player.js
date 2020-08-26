class Player  {
    constructor(controllingEntity) {
        if (typeof controllingEntity !== 'undefined') {
            this.setEntityControl(controllingEntity);
        }
    }

    setEntityControl(entity) {
        if (entity instanceof Entity) {
            this.entity = entity;
        }
    }

    //cleanup to single function sometime.
    keyMoveUp(){
        $.entities.requestEntityMove({entity: this.entity, x:0 , y:-1 })
        $.camera.requestCameraOn(this.getPlayerLocation());
    }
    keyMoveDown(){
        $.entities.requestEntityMove({entity: this.entity, x:0 , y:1 })
        $.camera.requestCameraOn(this.getPlayerLocation());
    }
    keyMoveLeft(){
        $.entities.requestEntityMove({entity: this.entity, x:-1 , y:0 })
        $.camera.requestCameraOn(this.getPlayerLocation());
    }
    keyMoveRight(){
        $.entities.requestEntityMove({entity: this.entity, x:1 , y:0 })
        $.camera.requestCameraOn(this.getPlayerLocation());
    }

    getPlayerLocation() {
        return [this.entity.x, this.entity.y];
    }



}
