class DungeonGenerator {
    init(array, width, height) {
        for (let i = 0; i < width; i++) {
            array[i] = [];
            for (let j = 0; j < height; j++) {
                array[i][j] = new Terrain(i, j, 'rock');
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
        let unconnected = [];
        let pathsTiles = []; 

        for (var i = 0; i < attempts; i++) {
            var randWid = Math.floor(Math.random() * (maxWid - minWid + 1) + minWid);
            var randHei = Math.floor(Math.random() * (maxHei - minHei + 1) + minHei);
            var randX = Math.floor(Math.random() * (width - randWid - 1)) + 1;
            var randY = Math.floor(Math.random() * (height - randHei - 1)) + 1;

            let target = floor.getPlane(randWid, randHei, randX, randY);

            if (target.isAvailable()) {
                this.massModify(target, 'floor', 'floor');
                let wallsX = randX ? randX - 1 :  0;
                let wallsY = randY ? randY - 1 :  0;
                this.massModify(floor.getRect(randWid + 1, randHei + 1, wallsX, wallsY), 'floor', 'wall');
                unconnected.push(target.centerPoint());
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

            let tempPath = floor.simplePath(objective, unconnected[closest]);
            pathsTiles.attatch(tempPath);
            this.massModify(tempPath, 'floor', 'floor');
            unconnected.splice(seed, 1);
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
            function(tile){
                let neighbors = zone.findNeighbors(tile);
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
        if (Array.isArray(room)){         
            return room.every(
                function(tile){
                    return (tile instanceof Terrain && tile.floor !== 'floor' && tile.floor !== 'wall')
                }
            )
        } else if (room instanceof Terrain) {
            return (room.floor !== 'floor' && room.floor !== 'wall')
        } else {
            throw new Error ('can\'t check that, brosky: ' + Array.from(arguments))
        }
    }

    getManhattanDistance(a, b) {
        //gridutils
        return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y));
    }
}
