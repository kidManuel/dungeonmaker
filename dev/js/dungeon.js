class DungeonGenerator {
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
                this.cells[i][j] = new Terrain(i, j, 'rock');
            }
        }
    }

    cellAt(X, Y) {
        if (typeof X == 'number' && typeof Y == 'number') {
            if (this.cells[X] && this.cells[X][Y]) {
                return this.cells[X][Y]
            }
        } else if (Array.isArray(X)) {
            return this.cells[X[0]][X[1]]
        } else if (X instanceof Terrain) {
            return X
        } else {
            throw new Error('can\'t retrieve cell with arguments: ' + toArray(arguments))
        }
    }

    randomDun() {
        var maxWid = Math.floor(this.width / 2);
        var maxHei = Math.floor(this.height / 2);
        var minWid = globalparams.minRoomWidth;
        var minHei = globalparams.minRoomWidth;
        var attempts = globalparams.density;
        var unconnected = [];
        var connected = [];
        var pathsTiles = []; 

        for (var i = 0; i < attempts; i++) {
            var randWid = Math.floor(Math.random() * (maxWid - minWid + 1) + minWid);
            var randHei = Math.floor(Math.random() * (maxHei - minHei + 1) + minHei);
            var randX = Math.floor(Math.random() * (this.width - randWid - 1)) + 1;
            var randY = Math.floor(Math.random() * (this.height - randHei - 1)) + 1;

            let target = this.getRect(randWid, randHei, randX, randY);

            if (this.checkAvailable(target)) {
                this.massModify(target, 'floor', 'floor');
                this.massModify(this.getWallsSquareRoom(target), 'floor', 'wall');
                unconnected.push(this.centerPoint(target));
            }
        }

        while (unconnected.length > 0) {
            let maxDistance = 1000;
            let closest = 0;
            let seed = Math.floor(Math.random() * unconnected.length);
            let objective = unconnected[seed];

            //Review once 'getClosest' rolls around.
            for (var j = 0; j < unconnected.length; j++) {
                if (seed == j){
                    continue;
                }
                var manhDistance = this.getManhattanDistance(unconnected[j], objective);
                if (manhDistance < maxDistance) {
                    maxDistance = manhDistance;
                    closest = j;
                }
            }

            let tempPath = this.simplePath(objective, unconnected[closest]);
            pathsTiles.attatch(tempPath);
            this.massModify(tempPath, 'floor', 'floor');
            unconnected.splice(seed, 1);
        }
        this.polish(pathsTiles);
        this.massExpress();
    }

    polish(customSelection) {
        //REVIEW WHENEVER
        var tilesToPolish = customSelection || this.cells;
        var dungeon = this;
        var needsUpdate = [];

        tilesToPolish.iterate(
            function(tile){
                let neighbors = dungeon.findNeighbors(tile);
                neighbors.iterate(
                    function(singleNeighbor){
                        if (singleNeighbor.floor === 'rock') {
                            singleNeighbor.floor = 'wall';
                            needsUpdate.push(singleNeighbor);
                        }
                    }
                )
            }
        ) 
        this.massExpress(needsUpdate);
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

    centerPoint(room) {
        //also works with two oposing NW and SE corners.
        var topLeft = room[0];
        var botRight = room.last();
        return this.cellAt(Math.floor((topLeft.x + botRight.x) / 2), Math.floor((topLeft.y + botRight.y) / 2))
    }

    findNeighbors(cell) {
        var neighbors = [];
        var x = cell.x;
        var y = cell.y;
        if (this.cellAt(x, y - 1)) {
            neighbors.push(this.cells[x][y - 1]);
        }
        if (this.cellAt(x, y + 1)) {
            neighbors.push(this.cells[x][y + 1]);
        }
        if (this.cellAt(x + 1, y)) {
            neighbors.push(this.cells[x + 1][y]);
        }
        if (this.cellAt(x - 1, y)) {
            neighbors.push(this.cells[x - 1][y]);
        }
        return neighbors;
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

    getWallsSquareRoom(room) {
        //abstract gettin bounding coordinates?
        //make it so it doesn't cut border rooms

        var walls = [];
        var north = room[0].y ? room[0].y - 1 :  0;
        //if room is on y = 0 return 0;
        var south = room.last().y + 1 < globalparams.dunHeight ? room.last().y + 1 : globalparams.dunHeight; 
        var west = room[0].x ? room[0].x - 1 :  0;
        var east = room.last().x + 1 < globalparams.dunHeight ? room.last().x + 1 : globalparams.dunHeight; 

        for (let i = north; i <= south; i++) {
            if(this.checkAvailable(this.cellAt(west, i))){
                walls.push(this.cellAt(west, i));
            }
            if(this.checkAvailable(this.cellAt(east, i))){
                walls.push(this.cellAt(east, i));
            }
        }
        for (let e = west; e <= east; e++) {
            if(this.checkAvailable(this.cellAt(e, north))){
                walls.push(this.cellAt(e, north));
            }
            if(this.checkAvailable(this.cellAt(e, south))){
                walls.push(this.cellAt(e, south));
            }
        }
        return walls;
    }

    checkAvailable(room) {
        if (Array.isArray(room)){         
            return room.every(
                function(tile){
                    return (tile instanceof Terrain && tile.floor !== 'floor' && tile.floor !== 'wall')
                }
            )
        } else if (room instanceof Terrain) {
            return (room.floor !== 'floor' && room.floor !== 'wall')
        } else {
            throw new Error ('can\'t check that, brosky: ' + toArray(arguments))
        }
    }

    static cellIsType(testCell, filter) {
        return (testCell instanceof Terrain && testCell.floor === filter);
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

    getManhattanDistance(a, b) {
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
    }
}
