 var layoutElems = document.getElementById("layout"),
     layout = layoutElems.getContext("2d"),
     allCanvas = document.querySelectorAll("canvas"),

     /** MAKE PARAMS OBJECT **/

     dunWid = 60, //size in cells of the floor.
     dunHei = 60,
     cellSize = 15,
     density = 25, // ammount of attempts at filling the floor.

     fullSizeW = dunWid * cellSize, //size in pixels of the floor.
     fullSizeH = dunHei * cellSize;

 /** MAKE PARAMS OBJECT **/


 $(document).ready(function() {

     //draws the rulers.
     var listHor = document.querySelector("#hor"),
         listVer = document.querySelector("#ver"),
         x = document.createElement("STYLE"),
         t = document.createTextNode(".counter li {width: " + cellSize + "px; height: " + cellSize + "px;}"),
         container = document.getElementById("mainContainer");

     container.style.width = fullSizeW + "px";
     container.style.height = fullSizeH + "px";

     for (var i = 0; i < allCanvas.length; i++) {
         allCanvas[i].width = fullSizeW;
         allCanvas[i].height = fullSizeH;
     }

     for (var i = 0; i < dunWid; i++) {
         var count = document.createElement("li"),
             text = document.createTextNode(i);
         count.appendChild(text);
         listHor.appendChild(count);
     }

     for (var i = 0; i < dunHei; i++) {
         var count = document.createElement("li"),
             text = document.createTextNode(i);
         count.appendChild(text);
         listVer.appendChild(count);
     }

     x.appendChild(t);
     document.head.appendChild(x);
     dun = new dungeon(dunWid, dunHei);
     dun.init();
     dun.randomDun();
     dun.polish(dun.findTiles(null));
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


 /*

 MERGE THIS TWO????

 */

 //gets a square given two opposing corner cells. might be used to check for bounding boxes in some cases.
 dungeon.prototype.drawRectCorners = function(a, b) {
     var rect = [],
         top = Math.min(a[1], b[1]),
         bot = Math.max(a[1], b[1]),
         left = Math.min(a[0], b[0]),
         right = Math.max(a[0], b[0]);


     for (var i = left; i <= right; i++) {
         for (var j = top; j <= bot; j++) {
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
     this.X = x; //x and y index number of cell
     this.Y = y;
     this.posX = cellSize * this.X; //x and y position in pix
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
     layout.fillStyle = co;
     layout.fillRect(this.posX, this.posY, cellSize, cellSize); //dibujar la celda
 }


 //highlighting for ui functions
 cell.prototype.highlight = function() {
     ui.fillRect(this.posX, this.posY, cellSize, cellSize);
     ui.strokeRect(this.posX + 1, this.posY + 1, cellSize - 2, cellSize - 2);
 }



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

 //first go at dungeon generation. to be perfected.

 dungeon.prototype.randomDun = function() {
     var maxWid = Math.floor(this.width / 2),
         maxHei = Math.floor(this.height / 2),
         minWid = 1,
         minHei = 1,
         attempts = density,
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

     // Ya no sirve.
     //connected.push(unconnected[0]);
     //unconnected.shift();

     while (unconnected.length > 0) {
         var distance = 1000,
             index = 0,
             seed = Math.floor(Math.random() * unconnected.length),
             objective = unconnected[seed];

         /*
            1. Tomo un unconnected al azar (objective).
            2. Busco el unconnected más cercano.
            3. Creo un path entre ambos unconnected.
            4. Mando el objective a los connected.

            Nota: Técnicamente también debería mandar el unconnected más cercano a la lista de connected
            porque ahora está connectado, pero si hacemos esto se crean varios grupitos de habitaciones
            que no se conectan entre si.
         */

         for (var j = 0; j < unconnected.length; j++) {
             if (seed == j)
                 continue; // Si el objetivo es igual al unconnected que estoy buscando lo salteo.
             var manhDistance = Math.abs(unconnected[j][0] - objective[0]) + Math.abs(unconnected[j][1] - objective[1]);

             if (manhDistance < distance) {
                 distance = manhDistance;
                 index = j;
             }
         }

         this.massModify(this.simplePath(objective, unconnected[index]), "type", "floor");
         connected.push(unconnected[seed]);
         unconnected.splice(seed, 1);
     }

     this.massExpress(this.findTiles(null));
 }

 // given an array of coordinate-arrays ([x,y]) checks if there is space to dig the room. ; 
 dungeon.prototype.checkAvailable = function(room) {
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


 /* given an array of coordinate-arrays ([x,y]) gets the center of that room; 
  ** assuming first and last arrays represent opposing borders */

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

 // brasenham's algorithm for lines
 dungeon.prototype.brasLine = function(a, b) {
     var x0 = a[0],
         x1 = b[0],
         y0 = a[1],
         y1 = b[1],
         dx = Math.abs(x1 - x0),
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



 var testArr = [ //just a silly old array for general purpose testing.
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
 ];

dungeon.prototype.dunurl = function(){
    var canvas = document.getElementById("mainContainer"); 
    console.log(canvas.toDataURL());
}
