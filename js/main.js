 var c = document.getElementById("main"),
     ctx = c.getContext("2d"),
     cellSize = 10,
     testArr = [
         [0, 39],
         [0, 38],
         [0, 37],
         [1, 39],
         [1, 38],
         [1, 37],
         [2, 39],
         [2, 38],
         [2, 37],
         [3, 39],
         [3, 38],
         [3, 37],
         [4, 39],
         [4, 38],
         [4, 37],

     ],

     foo = 40,
     bar = 20;

 $(document).ready(function() {
     dun = new dungeon(100, 100);
     dun.init();
     dun.randomDun();
     //dun.massModify(dun.simplePath([0, 39], [39, 0]), "type", "floor");
     dun.polish(dun.findTiles(null))
     dun.expressAll();
 });


 var dungeon = function(width, height) {
     this.width = width;
     this.height = height;
     this.cells = [];
     this.unconnected = [];
     this.connected = [];
 }

 dungeon.prototype.init = function() {
     for (var i = 0; i < this.width; i++) {
         this.cells[i] = [];
         for (var j = 0; j < this.height; j++) {
             this.cells[i][j] = new cell(i, j, "rock");
         }
     }

 }

 dungeon.prototype.expressAll = function() {
     this.massExpress(this.findTiles(null));
     //this.polish(this.findTiles(null));
 };


 //returns a cell reference given an array of coordinates
 dungeon.prototype.cellAt = function(X, Y) {
     if (typeof X == "object") {
         return this.cells[X[0]][X[1]]
     } else if (typeof X == "number" && typeof Y == "number") {
         if (this.cells[X] && this.cells[X][Y]) {
             return this.cells[X][Y]
         }
     }
 }


 //helper function to get a certain type of tile. returns all cells in the floor if no argument is passed.
 //////////////////////TODO: MAKE IT SEARCH INSIDE A SUBARRAY


 dungeon.prototype.findTiles = function(search, array) {
     var allTiles = [],
         cells = this.cells;

     if (!array) {
         for (var i = 0; i < cells.length; i++) {
             for (var j = 0, len2 = cells[i].length; j < len2; j++) {
                 var myPush = cells[i][j];
                 pushing(myPush);
             }
         }
     } else if (array) {
         for (var k = 0; k < array.length; k++) {
             var myPush = cells[array[k][0]][array[k][1]];
             pushing(myPush);
         }
     }

     function pushing(thisTile) {
         if (thisTile instanceof cell) {
             if (search !== null) {
                 if (thisTile.type === search) {
                     allTiles.push([thisTile.X, thisTile.Y]);
                 }
             } else {
                 allTiles.push([thisTile.X, thisTile.Y]);
             }
         }
     }

     return allTiles;

 }

 //express an array of cells
 dungeon.prototype.massExpress = function(tilesArray) {
     for (var i = 0; i < tilesArray.length; i++) {
         this.cellAt(tilesArray[i]).express();
     }
 }

 // modify en-masse a collection of cells expressed in an array of coordinates.
 dungeon.prototype.massModify = function(tilesArray, property, value) {
     for (var i = 0; i < tilesArray.length; i++) {
         this.cellAt(tilesArray[i])[property] = value;
     }

 }

 //get a square defined in an array of coordinates.
 dungeon.prototype.drawRect = function(width, height, x, y) {
     var rect = [];
     for (var i = x; i < x + width; i++) {
         for (var j = y; j < y + height; j++) {
             if (this.cellAt(i, j)) {
                 rect.push([i, j]);
             }
         }
     }
     return rect;
 }

 //get neighbouring cells

 dungeon.prototype.getNeighs = function(x, y) {
     var neighs = [];
     if (this.cellAt(x, y - 1)) {
         neighs.push([x, y - 1]);
     }
     if (this.cellAt(x + 1, y)) {
         neighs.push([x + 1, y]);
     }
     if (this.cellAt(x, y + 1)) {
         neighs.push([x, y + 1]);
     }
     if (this.cellAt(x - 1, y)) {
         neighs.push([x - 1, y]);
     }
     return neighs;
 }

 ////////////////GAME FUNCTIONS

 //dig a square in the rock
 dungeon.prototype.digSquare = function(width, height, x, y) {
     var top = y - 1,
         left = x - 1,
         bot = y + height,
         right = x + width;

     if (typeof width == "object") {
         rect = width;
     } else if (width && height && x && y) {
         var rect = this.drawRect(width, height, x, y);
     }

     this.massModify(rect, "type", "floor");
     for (var i = top + 1; i <= bot - 1; i++) {
         this.cells[left][i].type = "wall";
         this.cells[right][i].type = "wall";
     }

     for (var i = left + 1; i <= right - 1; i++) {
         this.cells[i][top].type = "wall";
         this.cells[i][bot].type = "wall";
     }
 }

 // polish up dungeon

 dungeon.prototype.polish = function(tilesToPolish) {
     var areaPolish = tilesToPolish || this.findTiles(null);

     for (var i = 0; i < areaPolish.length; i++) {
         var singleCell = this.cellAt(areaPolish[i]);
         //lighten up wall tiles
         if (singleCell) {
             var neighbours = this.getNeighs(areaPolish[i][0], areaPolish[i][1]);
             for (var j = 0; j < neighbours.length; j++) {
                 var singleNeighbour = this.cellAt(neighbours[j]);
                 if (singleNeighbour && singleNeighbour.type === "floor" && singleCell.type === "rock") {
                     singleCell.type = "wall";
                 }
             }
         }
     }
     this.massExpress(this.findTiles(null))
 }

 ////////////////MAIN CELL OBJECT DECLARATION

 var cell = function(x, y, type) {
     this.X = x; //numero de x
     this.Y = y; //numero de x
     this.posX = cellSize * this.X; //numero de x
     this.posY = cellSize * this.Y;
     this.type = type;
 };




 /////////ESTO NO FUNCIONA!!!!!!!
 /////////ESTO NO FUNCIONA!!!!!!!
 //(convertir a objetos)
 /////////ESTO NO FUNCIONA!!!!!!!
 /////////ESTO NO FUNCIONA!!!!!!!
 // |
 // |
 // |
 // |
 // |
 // v

 //funcion para dibujar esta celda.
 cell.prototype.express = function() {
     var co;
     switch (this.type) { //elegir color segun estado
         case "rock":
             co = '#542437';
             break;
         case "wall":
             co = '#A43F68';
             break;
         case "floor":
             co = '#ECD078';
             break;
         case "PING":
             co = '#C3E90D';
             break;
     }
     ctx.fillStyle = co;
     ctx.fillRect(this.posX, this.posY, cellSize, cellSize); //dibujar la celda
 }

 ////////////////HELPER FUNCTIONS
 //Briefly highlights a cell.
 dungeon.prototype.ping = function(arrayOrX, y) {
     var loc = arguments,
         spot = this,
         save = spot.cellAt(loc).type;
     spot.cellAt(loc).type = "PING";
     spot.cellAt(loc).express();
     setTimeout(function() {
         spot.cellAt(loc).type = save;
         spot.cellAt(loc).express();
     }, 1000)
 }

 // PATHING FUNCTIONS
 //random path of manhattan-distance length

 dungeon.prototype.simplePath = function(start, end) {
     var path = [];
     path.push([start[0], start[1]]);

     while (start[0] !== end[0] || start[1] !== end[1]) {
         var ran = Math.round(Math.random()),
             sign = _getSign(ran);

         if (sign === 0) {
             ran = Math.abs(ran - 1);
             sign = _getSign(ran);
         }

         start[ran] += sign;
         path.push([start[0], start[1]]);
     }

     function _getSign(ran) {
         return (Math.sign(start[ran] - end[ran])) * -1;
     }

     return path;
 }

 // brasenham's algorithm for lines
 dungeon.prototype.brasLine = function(x0, y0, x1, y1) {
     var dx = Math.abs(x1 - x0),
         dy = Math.abs(y1 - y0),
         sx = (x0 < x1) ? 1 : -1,
         sy = (y0 < y1) ? 1 : -1,
         err = dx - dy,
         path = [];
     while (true) {
         path.push([x0, y0]);
         if ((x0 == x1) && (y0 == y1)) break;
         var e2 = 2 * err;
         if (e2 > -dy) {
             err -= dy;
             x0 += sx;
         }
         if (e2 < dx) {
             err += dx;
             y0 += sy;
         }
     }
     return path;
 }


 /*
  *
  *
  *
  *FIX
  *THIS
  *SHIT
  *
  *
  *
  */


 dungeon.prototype.randomDun = function() {
     var maxWid = Math.floor(this.width / 12),
         maxHei = Math.floor(this.height / 12),
         minWid = 3,
         minHei = 3,
         attempts = 100,
         unconnected = [],
         connected = [];


     for (var i = 0; i < attempts; i++) {
         var randWid = Math.floor(Math.random() * (maxWid - minWid + 1) + minWid),
             randHei = Math.floor(Math.random() * (maxHei - minHei + 1) + minHei),
             randX = Math.floor(Math.random() * (this.width - randWid - 1)) + 1,
             randY = Math.floor(Math.random() * (this.height - randHei - 1)) + 1,

             target = this.drawRect(randWid, randHei, randX, randY);

         if (this.checkAvailable(target)) {
             this.digSquare(randWid, randHei, randX, randY);
             unconnected.push(centerPoint(target));
         }
     }


     connected.push(unconnected[0]);
     unconnected.shift();

     while (unconnected.length > 0) {
         var distance = 1000,
             index = 0,
             seed = Math.floor(Math.random() * unconnected.length),
             objective = unconnected[seed];

         for (var j = 0; j < connected.length; j++) {
             var manhDistance = Math.abs(connected[j][0] - objective[0]) + Math.abs(connected[j][1] - objective[1]);

             if (manhDistance < distance) {
                 distance = manhDistance;
                 index = j;
             }
         }

         this.massModify(this.simplePath(objective, connected[index]), "type", "floor");
         connected.push(unconnected[seed]);
         unconnected.splice(seed, 1)
     }

     this.massExpress(this.findTiles(null));
 }

 dungeon.prototype.checkAvailable = function(room) {
     var x = true;
     for (var i = 0; i < room.length; i++) {
         if (this.cells[room[i][0]][room[i][1]].type == "floor" || this.cells[room[i][0]][room[i][1]].type == "wall") {
             return false;
         }
     }
     return true;
 }

 //Returns one of the possible cell types chosen randomly
 function getRandomTiletype() {
     switch (Math.floor(Math.random() * 3)) {
         case 0:
             return "rock";
             break;
         case 1:
             return "wall";
             break;
         case 2:
             return "floor";
             break;
     }
 }

 function centerPoint(room) {
     var topLeft = room[0],
         botRight = room[room.length - 1];
     return [Math.floor((topLeft[0] + botRight[0]) / 2), Math.floor((topLeft[1] + botRight[1]) / 2)]
 }


 ////////////////////////Stuff.

 Array.prototype.randomElement = function() {
     return this[Math.floor(Math.random() * this.length)]
 }

 Array.prototype.last = function() {
     return this[this.length - 1];
 };

 /*
 function supertest(unconnected,connected){
      while (unconnected.length > 0) {
          var distance = 1000,
              index = 0,
              objective = unconnected[0];

          for (var j = 0; j < connected.length; j++) {
              var manhDistance = Math.abs(connected[j][0] - first[0]) + Math.abs(connected[j][1] - first[1]);

              if (manhDistance < distance) {
                  distance = manhDistance;
                  index = j;
              }
          }

          console.log(first + " and " + unconnected[1] + " and " + unconnected[2] + " and " + unconnected[3] + " and " + unconnected[4]);
          connected.push(unconnected[0]);
          unconnected.shift()
      }
  }
 }*/
