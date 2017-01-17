class dungeon {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];
        this.init();
    }

    init() {
        for (var i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (var j = 0; j < this.height; j++) {
                this.cells[i][j] = new cell(i, j, 'rock');
            }
        }
    }

    findTiles(filter, array) {
        var selection = [];
        var cells = array || this.cells;


        //Review after array.prototype.flatten
        if (!filter && !array) {
            selection = cells.reduce(function(a, b) {
                return a.concat(b);
            });
            return selection;
        }

        cells.iterate(function() {
                if (dungeon.cellIsType(this, filter)) {
                    selection.push(this);
                } //a
            } //b
        ); // c
        return selection;
    } //d

    massExpress(tilesArray) {
        for (var i = 0; i < tilesArray.length; i++) {
            this.cellAt(tilesArray[i].X, tilesArray[i].Y).express();
        }
    }

    static findNeighbours(cell) {
        var neighbours = [];
        var x = cell.X;
        var y = cell.Y;
        if (this.cellAt(x, y - 1)) {
            neighbours.push(this.cells[x, y - 1]);
        }
        if (this.cellAt(x + 1, y)) {
            neighbours.push(this.cells[x + 1, y]);
        }
        if (this.cellAt(x, y + 1)) {
            neighbours.push(this.cells[x, y + 1]);
        }
        if (this.cellAt(x - 1, y)) {
            neighbours.push(this.cells[x - 1, y]);
        }
        return neighbours;
    }

    static cellIsType(testCell, filter) {
        return (testCell instanceof cell && testCell.type === filter);
    }
}
