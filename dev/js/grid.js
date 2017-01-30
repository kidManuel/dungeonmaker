class Grid extends Array {
    cellAt(X, Y) {
        if (typeof X == 'number' && typeof Y == 'number') {
            if (this[X] && this[X][Y]) {
                return this[X][Y]
            }
        } else if (Array.isArray(X)) {
            return this[X[0]][X[1]]
        } else if (this.includes(X)) {
            return X
        }
    }

    initialize(width) {
        // Ensures every element in x axis up to a width is an array.
        for (let i = 0; i < width; i++) {
            if (!Array.isArray(this[i])){
                this[i] = [];
            }
        }
    }

    getRect(width, height, x, y) {
        //gets a subgrid
        var rect = new Grid;
        rect.initialize(width);
        for (var i = x; i < x + width; i++) {
            for (var j = y; j < y + height; j++) {
                if (this.cellAt(i, j)) {
                    rect[i - x][j - y] = this.cellAt(i, j);
                }
            }
        }
        return rect;
    }

    centerPoint() {
        // only works with perfectly rectangles
        return this.cellAt(Math.floor(this.length / 2), Math.floor(this[0].length / 2))
    }


    findNeighbors(cell) {
        var neighbors = [];
        var x = cell.x;
        var y = cell.y;
        if (this.cellAt(x, y - 1)) {
            neighbors.push(this[x][y - 1]);
        }
        if (this.cellAt(x, y + 1)) {
            neighbors.push(this[x][y + 1]);
        }
        if (this.cellAt(x + 1, y)) {
            neighbors.push(this[x + 1][y]);
        }
        if (this.cellAt(x - 1, y)) {
            neighbors.push(this[x - 1][y]);
        }
        return neighbors;
    }

    findTiles(filter) {
        //Review after array.prototype.flatten
        //Review once complexity kicks in
        let selection = [];

        if (!filter) {
            selection = this.reduce(function(a, b) {
                return a.concat(b);
            });
            return selection;
        }

        this.iterate(function() {
            if (dungeon.cellIsType(this, filter)) {
                selection.push(this);
            }
        });
        return selection;
    }

    topLeft() {
        return this[0][0];
    }

    topRight() {
        return this.last()[0];
    }
    
    bottomLeft() {
        return this[0].last();
    }

    bottomRight() {
        return this.last().last();
    }
}

class DungeonZone extends Grid {
 /* constructor(id, name, floor, biome) {
        super();
        this.id = id;
        this.name = name;
        this.floor = floor;
        this.biome = biome;
    } */

    getRect(width, height, x, y) {
        //gets a subgrid
        var rect = new DungeonZone;
        rect.initialize(width);
        for (var i = x; i < x + width; i++) {
            for (var j = y; j < y + height; j++) {
                if (this.cellAt(i, j)) {
                    rect[i - x][j - y] = this.cellAt(i, j);
                }
            }
        }
        return rect;
    }

    //random path of manhattan-distance length
    simplePath(start, end) {
        var path = [];
        var currentStep = {
            x: start.x, 
            y: start.y
        }
        path.push(start);

        while (currentStep.x !== end.x || currentStep.y !== end.y) {
            var ran = Math.round(Math.random()) === 0 ? 'x' : 'y';
            var sign = _getSign(ran);

            if (sign === 0) {
                ran = Math.abs(ran - 1);
                sign = _getSign(ran);
            }
            currentStep[ran] += sign;
            path.push(this.cellAt(currentStep.x, currentStep.y));
        }

        function _getSign(ran) {
            //review so that it does not return 0;
            return (Math.sign(currentStep[ran] - end[ran])) * -1;
        }
        return path;
    }

    isAvailable() {
        return this.every(
            function(subarray) {
                return subarray.every(
                    function(tile) {
                        return tile.isAvailable();
                    }
                )
            }
        )
    }

    getSurroundingCells(room) {
        //abstract gettin bounding coordinates?
        //allow passing of measures, getRect style.
        //make it so it doesn't cut border rooms

        let walls = [];
        let north = room[0].y ? room[0].y - 1 :  0;
        //if room is on y = 0 return 0;
        let south = room.last().y + 1 < globalparams.dunHeight ? room.last().y + 1 : globalparams.dunHeight; 
        let west = room[0].x ? room[0].x - 1 :  0;
        let east = room.last().x + 1 < globalparams.dunHeight ? room.last().x + 1 : globalparams.dunHeight; 

        for (let i = north; i <= south; i++) {
            let left = this.cellAt(west, i);
            let right = this.cellAt(east, i);

            if (left && left.isAvailable()) {
                walls.push(left);
            }

            if (right && right.isAvailable()) {
                walls.push(right);
            }
        }

        for (let e = west; e <= east; e++) {
            let up = this.cellAt(e, north);
            let down = this.cellAt(e, south);


            if (up && up.isAvailable()) {
                walls.push(up);
            }

            if (down && down.isAvailable()) {
                walls.push(down);
            }
        }
        return walls;
    }
}

/*
    centerPoint(room) {
        //gridutils
        //also works with two oposing NW and SE corners.
        var topLeft = room[0];
        var botRight = room.last();
        return this.cellAt(Math.floor((topLeft.x + botRight.x) / 2), Math.floor((topLeft.y + botRight.y) / 2))
    }
*/