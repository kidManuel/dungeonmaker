class EntitiesController {
    constructor(communications, layout) {
        this.coms = communications;
        this.layout = layout;
        this.decorators = loadData('decorator');
        this.template = loadData('template');
        this.coms.listenTo('requestEntityMove', this);
        this.coms.registerMethod('action', this);
        this.actions = {
            attack: {
                execute: function (a, b) {
                    console.log(this.id + ' hits ' + b.id + ' for ' + this.attack + ' points of damage');
                    b.hitpoints -= this.attack;
                }
            }
        }
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
            this.coms.dispatch('cellsUpdate', needsUpdate);
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
        decorationsList.forEach(function (singleDecor) {
            me.decorateEntity(entity, singleDecor);
        })
    }

    decorateEntity(entity, decoration) {
        let category = 'uncategorized';
        let currentDecoration = decoration;
        if (currentDecoration.includes('.')) {
            let separation = currentDecoration.indexOf('.');
            category = currentDecoration.substring(0, separation);
            currentDecoration = currentDecoration.substring(separation + 1)
        }
        let decorObject = this.decorators[category][currentDecoration];
        if (decorObject) {
            for (let modifier in decorObject) {
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
        } else {
            devError('no souch decoration: ' + decoration)
        }
        return entity
    }

    applyTemplate(entity, template) {
        //move to entity prototoype?
        let me = this;
        let currentTemplate = Array.isArray(template) ? template : this.template[template];
        currentTemplate.forEach(function (decoration) {
            me.decorateEntity(entity, decoration)
        })
        return entity;
    }

    populate(location, population, templateCollection) {
        let collection = this.template[templateCollection];
        while (population) {
            let candidateTile = location.randomElement()
            if (!candidateTile.entity) {
                let citizen = new Entity('enemy_' + population, candidateTile.x, candidateTile.y);
                this.applyTemplate(citizen, collection.randomElement());
                candidateTile.entity = citizen;
            }
            population--;
        }
    }

    action(actionName, a) {
        this.actions[actionName].execute.apply(a, Array.prototype.slice.call(arguments, 2));
    }
}

