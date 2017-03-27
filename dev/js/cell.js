class Cell {
    constructor(x, y, floor) {
        this.x = x; //x and y index number of cell
        this.y = y;
        this.floor = floor;
        this.connections = [];
    }

    getPosX() {
    	return globalparams.cellSize * this.x;
    }

    getPosY() {
    	return globalparams.cellSize * this.y
    }

    isAvailable() {
        return this.floor === 'rock';
    }

    setEntity(entity) {
        this.entity = entity; 
        if(entity.x !== this.x) {
            entity.x = this.x; 
        }
        if(entity.y !== this.y) {
            entity.y = this.y; 
        }
    }

}
