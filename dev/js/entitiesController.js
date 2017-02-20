class EntitiesController extends Speaker{
    constructor(comunications, layout) {
        super(comunications);
        this.layout = layout;
        this.decorators = loadData('decorators')
        this.listenTo('requestEntityMove');
    }

    moveEntity(ent, x, y) {
        //review on subpub
        let targetCell = this.layout.cellAt(x, y);
        let initialCell = this.layout.cellAt(ent.x, ent.y);
        if (targetCell.floor === 'floor') {
            let needsUpdate = [initialCell, targetCell];
            ent.x = x; //review to setget
            ent.y = y;
            targetCell.entity = ent; 
            delete initialCell.entity;
            this.dispatch('cellsUpdate', needsUpdate);
        } else {
            devLog('collision brah');
        }
    }

    impulseEntity(ent, x, y) {
        let targetCellX = ent.x + x;
        let targetCellY = ent.y + y;
        this.moveEntity(ent, targetCellX, targetCellY);
    }

    onRequestEntityMove(data) {
        this.impulseEntity(data.entity, data.x, data.y)
    }

    decorateEntity(entity, decorationsObject) {

    }

}



