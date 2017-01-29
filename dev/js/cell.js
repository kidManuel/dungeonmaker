class Cell {
    constructor(x, y, floor) {
        this.x = x; //x and y index number of cell
        this.y = y;
        this.floor = floor;
    }

    express() {
    	graphics.drawTile(this.getPosX(), this.getPosY(), this.floor)
    }

    getPosX() {
    	return globalparams.cellSize * this.x;
    }

    getPosY() {
    	return globalparams.cellSize * this.y
    }

}
