class EntitiesController {
    constructor(layout) {
        this.layout = layout;
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
            graphs.massExpress(needsUpdate);
        } else {
            console.log('collision brah');
        }
    }

    impulseEntity(ent, x, y) {
        let targetCellX = ent.x + x;
        let targetCellY = ent.y + y;
        this.moveEntity(ent, targetCellX, targetCellY);
    }
}



