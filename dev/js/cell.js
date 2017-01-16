class cell {
    constructor(x, y, type) {
        this.X = x; //x and y index number of cell
        this.Y = y;
        this.posX = cellSize * this.X; //x and y position in pixels
        this.posY = cellSize * this.Y;
        this.type = type;
    }

    express() {
        var co;
        switch (this.type) { //elegir color segun estado
            case 'rock':
                co = '#542437';
                break;
            case 'wall':
                co = '#A43F68';
                break;
            case 'floor':
                co = '#ECD078';
                break;
            case 'PING':
                co = '#C3E90D';
                break;
        }
        layout.fillStyle = co;
        layout.fillRect(this.posX, this.posY, cellSize, cellSize); //dibujar la celda
    }

}
