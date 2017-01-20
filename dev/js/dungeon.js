class DungeonFloor {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];
        this.init();
        this.randomDun();
    }

    init() {
        for (var i = 0; i < this.width; i++) {
            this.cells[i] = [];
            for (var j = 0; j < this.height; j++) {
                this.cells[i][j] = new Cell(i, j, 'rock');
            }
        }
    }

    randomDun() {
        var maxWid = Math.floor(this.width / 2);
        var maxHei = Math.floor(this.height / 2);
        var minWid = 1;
        var minHei = 1;
        var attempts = params.density;
        var unconnected = [];
        var connected = [];

        for (var i = 0; i < attempts; i++) {
            var randWid = Math.floor(Math.random() * (maxWid - minWid + 1) + minWid);
            var randHei = Math.floor(Math.random() * (maxHei - minHei + 1) + minHei);
            var randX = Math.floor(Math.random() * (this.width - randWid - 1)) + 1;
            var randY = Math.floor(Math.random() * (this.height - randHei - 1)) + 1;

            let target = this.getRect(randWid, randHei, randX, randY);

            if (this.checkAvailable(target)) {
                this.massModify(target, 'floor', 'floor');
                // unconnected.push(centerPoint(target));
            }
        }

        // while (unconnected.length > 0) {
        //     var distance = 1000,
        //         index = 0,
        //         seed = Math.floor(Math.random() * unconnected.length),
        //         objective = unconnected[seed];

        //     for (var j = 0; j < unconnected.length; j++) {
        //         if (seed == j)
        //             continue; // Si el objetivo es igual al unconnected que estoy buscando lo salteo.
        //         var manhDistance = Math.abs(unconnected[j][0] - objective[0]) + Math.abs(unconnected[j][1] - objective[1]);

        //         if (manhDistance < distance) {
        //             distance = manhDistance;
        //             index = j;
        //         }
        //     }

        //     this.massModify(this.simplePath(objective, unconnected[index]), 'floor', 'floor');
        //     connected.push(unconnected[seed]);
        //     unconnected.splice(seed, 1);

        this.massExpress();
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
            }
        });
        return selection;
    }

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
