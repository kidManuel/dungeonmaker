var c = document.getElementById("main");
var ctx = c.getContext("2d");

var dunWidth = 40;
var dunHeight = 40;
var mainArr = [];
var cellSize = 20;
var floor = "floor";
var rock = "rock";
var wall = "wall"
var expressAll = massExpress(getTiles());

$(document).ready(function() {
    housekeeping();
    massExpress(getTiles());
});

function housekeeping() {
    for (i = 0; i < dunWidth; i++) {
        mainArr[i] = new Array(dunHeight);
        for (j = 0, len2 = mainArr[i].length; j < len2; j++) {
            mainArr[i][j] = new cell(i, j, "rock")
        }
    }
}

//returns a cell reference given an array of coordinates
function cellAt(arrOrX, Y) {
    if (typeof arrOrX == "object") {
        return mainArr[arrOrX[0]][arrOrX[1]]
    } else if (typeof arrOrX == "number" && typeof Y == "number") {
        return mainArr[arrOrX][Y]
    }
}

//helper function to get a certain type of tile. returns all cells in the floor if no argument is passed.
function getTiles(type) {
    var allTiles = []
    for (i = 0; i < mainArr.length; i++) {
        for (j = 0, len2 = mainArr[i].length; j < len2; j++) {
            if (mainArr[i][j] instanceof cell) {
                if (typeof type != "undefined") {
                    if (mainArr[i][j].Type == type) {
                        allTiles.push([mainArr[i][j].X, mainArr[i][j].Y]);
                    }
                } else {
                    allTiles.push([mainArr[i][j].X, mainArr[i][j].Y]);
                }
            }
        }
    }
    return allTiles;
}

//express an array of cells
function massExpress(tilesArray) {
    for (i = 0; i < tilesArray.length; i++) {
        cellAt(tilesArray[i]).express();
    }
}

// modify en-masse a collection of cells expressed in an array of coordinates.
function massModify(tilesArray, property, value) {
    for (i = 0; i < tilesArray.length; i++) {
        cellAt(tilesArray[i])[property] = value;
    }

}

//get a square defined in an array of coordinates.
function getRectCor(x, y, width, height) {
    var rect = [];
    for (i = x; i < x + width; i++) {
        for (j = y; j < y + height; j++) {
            rect.push([i, j]);
        }
    }
    return rect;
}

////////////////GAME FUNCTIONS

//dig a square in the rock
function digSquare(x, y, width, height){
    var rect = getRectCor(x, y, width, height);
    massModify(rect,  "Type", "floor");
    massExpress(rect);
}



////////////////MAIN CELL OBJECT DECLARATION

var cell = function(x, y, type) {
    this.X = x; //numero de x
    this.Y = y; //numero de x
    this.posX = cellSize * this.X; //numero de x
    this.posY = cellSize * this.Y;
    this.Type = type;
};

//funcion para dibujar esta celda.
cell.prototype.express = function() {
    var co;
    switch (this.Type) { //elegir color segun estado
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

var testArr = [
    [3, 1],
    [0, 2],
    [5, 3]
];



////////////////HELPER FUNCTIONS

//Briefly highlights a cell.
function ping(arrayOrX, y) {
    var loc = arguments;
    var save = cellAt(loc).Type;
    cellAt(loc).Type = "PING";
    cellAt(loc).express();
    setTimeout(function() {
        cellAt(loc).Type = save;
        cellAt(loc).express();
    }, 1000)
}


//Returns one of the possible cell types chosen randomly
function getRandomTileType() {
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
