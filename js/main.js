 var c = document.getElementById("main"),
     ctx = c.getContext("2d"),
     cellSize = 10,
     testArr = [
         [3, 45],
         [0, 2],
         [5, 3]
     ];

 $(document).ready(function() {
     dun = new dungeon(40, 40);
     dun.init();
     dun.massModify(dun.simplePath([0, 39], [39, 0]), "type", "floor");
     dun.expressAll();
 });


 var dungeon = function(width, height) {
     this.width = width;
     this.height = height;
     this.cells = [];
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
     this.massExpress(this.findTiles());
     this.polish(this.findTiles());
 };


 //returns a cell reference given an array of coordinates
 ////////////////////////////////////////////////////////////// FIX FOR OUT OF BOUNDS
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


 dungeon.prototype.findTiles = function(type, array) {
     var allTiles = [];
     if(array){console.log("SISI")}else{console.log("FORGET IT MAN")}

     for (var i = 0; i < this.cells.length; i++) {
         for (var j = 0, len2 = this.cells[i].length; j < len2; j++) {
             if (this.cells[i][j] instanceof cell) {
                 if (type === null) {
                     if (this.cells[i][j].type == type) {
                         allTiles.push([this.cells[i][j].X, this.cells[i][j].Y]);
                     }
                 } else {
                     allTiles.push([this.cells[i][j].X, this.cells[i][j].Y]);
                 }
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
     if (typeof width == "object") {
         rect = width;
     } else if (width && height && x && y) {
         var rect = this.drawRect(width, height, x, y);
     }
     this.massModify(rect, "type", "floor");
     this.massExpress(rect);
 }

 // polish up dungeon

 dungeon.prototype.polish = function(tilesToPolish) {
     for (var i = 0; i < tilesToPolish.length; i++) {

         //lighten up wall tiles
         if (this.cellAt(tilesToPolish[i])) {
             var neighbours = this.getNeighs(tilesToPolish[i][0], tilesToPolish[i][1]);

             for (var j = 0; j < neighbours.length; j++) {
                 if (this.cellAt(neighbours[j]) && this.cellAt(neighbours[j]).type === "floor" && this.cellAt(tilesToPolish[i]).type === "rock") {
                     this.cellAt(tilesToPolish[i]).type = "wall";
                 }
             }
         }

     }
     this.massExpress(this.findTiles())
 }

 ////////////////MAIN CELL OBJECT DECLARATION

 var cell = function(x, y, type) {
     this.X = x; //numero de x
     this.Y = y; //numero de x
     this.posX = cellSize * this.X; //numero de x
     this.posY = cellSize * this.Y;
     this.type = type;
 };

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
     var loc = arguments;
     var save = cellAt(loc).type;
     cellAt(loc).type = "PING";
     cellAt(loc).express();
     setTimeout(function() {
         cellAt(loc).type = save;
         cellAt(loc).express();
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
  dungeon.prototype.randomDun = function(attempts) {
      var maxWidth = this.width / 5,
          maxHeight = this.height / 5;

      for (var i = 0; i < attempts; i++) {
          if (this.findTiles("wall").length === 0;) {
              this.digSquare()
          }



      }

      function newRoom() {
          this.digSquar
          e
      }

  }
 */





 dungeon.prototype.checkAvailable = function(room) {
     for (var i = 0; i < room.length; i++) {
         if (this.cells[room[i][0], room[i][1]].type == "floor") {
             return false
         } else {
             return true
         }
     }

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




 ////////////////////////Stuff.

 Array.prototype.randomElement = function() {
     return this[Math.floor(Math.random() * this.length)]
 }
