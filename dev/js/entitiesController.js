class EntitiesController extends Speaker{
    constructor(comunications, layout) {
        super(comunications);
        this.layout = layout;
        this.decorators = loadData('decorator')
        this.template = loadData('template')
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

    decorateEntityMultiple(entity, decorationsList) {
        let me = this;
        decorationsList.forEach(function(singleDecor){
            me.decorateEntity(entity, singleDecor);
        })
    }

    decorateEntity(entity, decoration) {
        let category = 'uncategorized';
        let myDecor = decoration;
        if(myDecor.includes('.')){
            let separation = myDecor.indexOf('.');
            category = myDecor.substring(0, separation);
            myDecor = myDecor.substring(separation + 1)
        }
        let decorObject = this.decorators[category][myDecor];
        for(let modifier in decorObject) {
            let modifierValue = decorObject[modifier];
            if (typeof modifierValue === 'number') {
                if (modifier in entity) {
                    entity[modifier] += modifierValue;
                } else {
                    entity[modifier] = modifierValue;
                }
            } else {
                entity[modifier] = modifierValue;
            }
        }

    addTemplate(entity, template) {
        let me = this;
        let currentTemplate = this.template[template];
        currentTemplate.forEach(function(decoration) {
            me.decorateEntity(entity, decoration)
        })
        return entity;
    }

}



