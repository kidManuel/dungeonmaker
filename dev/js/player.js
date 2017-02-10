class Player extends Speaker{
    constructor(controllingEntity) {
        super()
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
