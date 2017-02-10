class Player extends Speaker{
    constructor(controllingEntity) {
        if (typeof controllingEntity !== 'undefined') {
            this.setControllingEntiy(controllingEntity);
        }
    }

    setEntityControl(entity) {
        if(entity instanceof Entity) {
            this.entity = entity;
        }
    }


}
