class DungeonGenerator {
    constructor() {
        this.readyCells = [];
    }

    init(array, width, height) {
        for (let i = 0; i < width; i++) {
            array[i] = [];
            for (let j = 0; j < height; j++) {
                array[i][j] = new Cell(i, j, 'rock');
            }
        }
    }

    generateFloor(width, height) {
        let floor = new DungeonZone;
        //review here on optimization
        this.init(floor, width, height);
        let maxWid = globalparams.maxRoomWidth;
        let maxHei = globalparams.maxRoomHeight;
        let minWid = globalparams.minRoomWidth;
        let minHei = globalparams.minRoomHeight;
        let attempts = globalparams.density;
        let rooms = [];
        let connected = [];
        let distances = [];
        let pathsTiles = [];
        let me = this;

        while (attempts) {
            var randWid = Math.floor(Math.random() * (maxWid - minWid + 1) + minWid);
            var randHei = Math.floor(Math.random() * (maxHei - minHei + 1) + minHei);
            var randX = Math.floor(Math.random() * (width - randWid - 1)) + 1;
            var randY = Math.floor(Math.random() * (height - randHei - 1)) + 1;
            let target = floor.getPlane(randWid, randHei, randX, randY);
            if (target.isAvailable()) {
                this.readyCells.attatch(target.flatten());
                this.massModify(target, 'floor', 'floor');
                let wallsX = randX ? randX - 1 : 0;
                let wallsY = randY ? randY - 1 : 0;
                this.massModify(floor.getRect(randWid + 1, randHei + 1, wallsX, wallsY), 'floor', 'wall');
                rooms.push(target.centerPoint());
            }
            attempts--;
        }

        //calculate each individual distance between two nodes only once
        rooms.forEach(function(initial, iIndex) {
            for(let i = iIndex + 1; i < rooms.length; i++) {
                let objective = rooms[i];
                distances.push([me.getManhattanDistance(initial, objective), initial, objective]);
            }
        })
        //sort all the possible distances 
        distances.sort(function(a, b) {
            return a[0] - b[0]
        });

        //arbitrarily add one of the rooms to the "main loop" of rooms
        rooms[0].inMainLoop = true;

        //as long as we have rooms unconected to the "main loop"
        //execute the shortest posible conection between two rooms
        while (rooms.some(function(room) {return !room.inMainLoop})) {
            let initial = distances[0][1];
            let objective = distances[0][2];
            if (!objective.connections.includes(initial)) {
                //connect initial and obejctive
                //all connections with initial are now merged with the connections to objective.
                mergeConnections(initial, objective);
                connectRooms(initial, objective);

                //if ANY of all rooms now connected, is in the "main loop", add everything to the main loop
                if(initial.connections.some(function(connection){
                    return connection.inMainLoop;
                })){
                    initial.inMainLoop = true;
                    initial.connections.iterate(function(connection){
                        connection.inMainLoop = true;
                    })
                }
            }
            //either the rooms are already connected and we don't need the connection
            //or the connection is executed and we don't need the data anymore
            distances.removeIndex(0);
        }

        function mergeConnections(a, b) {
            let connectedRooms = a.connections.merge(b.connections);
            connectedRooms.push(a, b);
            connectedRooms.iterate(function(singleRoom) {
                singleRoom.connections.merge(connectedRooms);
            })
        }

        function connectRooms(a, b) {
            let tempPath = floor.simplePath(a, b);
            pathsTiles.attatch(tempPath);
            me.readyCells.merge(tempPath);
            me.massModify(tempPath, 'floor', 'floor');
        }

        this.polish(floor, pathsTiles);
        return floor;
    }
    polish(zone, subsection) {
        // Polishes an entire zone, or a subsection of that zone
        // Returns the now updated cells
        var tilesToPolish = subsection || zone;
        var needsUpdate = [];
        tilesToPolish.iterate(
            function(tile) {
                let neighbors = zone.findNeighbors(tile);
                neighbors.iterate(
                    function(singleNeighbor) {
                        if (singleNeighbor.floor === 'rock') {
                            singleNeighbor.floor = 'wall';
                            needsUpdate.push(singleNeighbor);
                        }
                    }
                )
            }
        )
        return needsUpdate;
    }
    massModify(tilesArray, property, value) {
        tilesArray.iterate(
            function(tile) {
                tile[property] = value;
            }
        )
    }
    checkAvailable(room) {
        if (Array.isArray(room)) {
            return room.every(
                function(tile) {
                    return (tile instanceof Terrain && tile.floor !== 'floor' && tile.floor !== 'wall')
                }
            )
        } else if (room instanceof Terrain) {
            return (room.floor !== 'floor' && room.floor !== 'wall')
        } else {
            throw new Error('can\'t check that, brosky: ' + Array.from(arguments))
        }
    }
    findNearestIn(cell, candidates) {
        let closest = Infinity;
        candidates.iterate(function(candidate) {
            if (DungeonGenerator.getManhattanDistance(cell, candidate) < closest) {
                closest = candidate;
            }
        })
        return closest;
    }
    getManhattanDistance(a, b) {
        //gridutils
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
    }

    getReadyCells() {
        return this.readyCells;
    }
}
