class EntitiesController {
    constructor() {
        this.decorators = loadData('decorator');
        this.template = loadData('template');
        this.idCounter = 0;
        var me = this;
        this.actionsData = {
            attack: {
                execute: function (b) {
                    let damage = getRandomInt(this.attack - 3, this.attack + 3);
                    console.log(this.id + ' hits ' + b.id + ' for ' + damage + ' points of damage');
                    let pos = b.getScreenPosition();
                    $.graphics.screenshake();
                    new damageNotification(pos.x, pos.y, damage);
                    b.updateHp(-damage);
                }
            },
            die: {
                execute: function() {
                    let holdingCell = $.layout.cellAt(this.x, this.y);
                    holdingCell.entity = null;
                    delete holdingCell.entity;
                    $.graphics.expressCellFull(holdingCell);
                    console.log(this.id + ' is ded, bruh');
                }
            }
        }
    }

    moveEntity(ent, x, y) {
        //review on subpub
        //review move/impulse. 
        let targetCell = $.layout.cellAt(x, y);
        let initialCell = $.layout.cellAt(ent.x, ent.y);
        if (targetCell.entity) {
            this.action('attack', ent, targetCell.entity)
        } else if (targetCell.floor === 'floor') {
            let needsUpdate = [initialCell, targetCell];
            ent.x = x; //review to setget
            ent.y = y;
            targetCell.entity = ent;
            delete initialCell.entity;
            $.graphics.cellsUpdate(needsUpdate);
        } else {
            devLog('collision brah');
        }
    }

    impulseEntity(ent, x, y) {
        let targetCellX = ent.x + x;
        let targetCellY = ent.y + y;
        this.moveEntity(ent, targetCellX, targetCellY);
    }

    requestEntityMove(data) {
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
                let citizen = this.createEntity(collection.randomElement(), null, 'enemy_' + population, candidateTile.x, candidateTile.y)
                candidateTile.entity = citizen;
            }
            population--;
        }
    }

    createEntity(templates, decorators, id, x, y) {
        let candidate = new Entity(id ? id : 'enemy_' + this.idCounter++, x, y);
        let me = this;
        this.decorateEntity(candidate, 'base');
        if(templates) {
            [].concat(templates).forEach(function(singleTemplate){
                me.decorateEntity(candidate, singleTemplate);
            })
        }
        if(decorators) {
            [].concat(decorators).forEach(function(singleDecorator){
                me.decorateEntity(candidate, singleDecorator);
            })
        }
        return candidate;
    }

    action(actionName, a) {
        this.actionsData[actionName].execute.apply(a, Array.prototype.slice.call(arguments, 2));
    }
}

