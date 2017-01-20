class DungeonFloor {
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
                this.cells[i][j] = new Cell(i, j, 'rock');
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
        var tiles = tiles || this.cells;
        tiles.iterate(
            function() {
                this.express();
            }
        )
    }

    massModify(tilesArray, property, value) {
        tilesArray.iterate(
            function() {
                this[property] = value;
            }
        )
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

    getRect(width, height, x, y) {
        var rect = [];
        for (var i = x; i < x + width; i++) {
            for (var j = y; j < y + height; j++) {
                if (this.cellAt(i, j)) {
                    rect.push(this.cellAt([i, j]));
                }
            }
        }
        return rect;
    }

    checkAvailable(room) {
        return room.every(
            function(tile){
                return (tile.floor !== 'floor' && tile.floor !== 'wall')
            }
        )
    }


    cellAt(X, Y) {
        if (typeof X == 'number' && typeof Y == 'number') {
            if (this.cells[X] && this.cells[X][Y]) {
                return this.cells[X][Y]
            }
        } else if (Array.isArray(X)) {
            return this.cells[X[0]][X[1]]
        } else if (X instanceof cell) {
            return X
        } else {
            throw new Error('can\'t retrieve cell with arguments: ' + toArray(arguments))
        }
    }

    static cellIsType(testCell, filter) {
        return (testCell instanceof cell && testCell.type === filter);
    }

    
}
