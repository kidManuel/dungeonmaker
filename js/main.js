var c = document.getElementById("main");
var ctx = c.getContext("2d");

var dunWidth = 40;
var dunHeight = 40;
var mainArr = [];
var cellSize = 20;


$(document).ready(function() {
    housekeeping();
});

function housekeeping() {
    for (i = 0; i < dunWidth; i++) {
        mainArr[i] = new Array(dunHeight);
        for (j = 0, len2 = mainArr[i].length; j < len2; j++) {
            mainArr[i][j] = new cell(i, j, "floor")
        }
    }
}


///////////TODOOOOOO
function getRectCor(x, y, width, height) {
        var rect = [];
        for (i = 0; i < x; i++) {
            for (j = 0; j < y; j++) {
                rect.push()
            }
        }
    }
///////////TODOOOOOO

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

var cell = function(x, y, type) {
    this.cXn = x; //numero de x
    this.cYn = y; //numero de x
    this.cposX = cellSize * this.cXn; //numero de x
    this.cposY = cellSize * this.cYn;
    this.cWalls = [1, 1, 1, 1];
    this.cType = type;
};

//funcion para dibujar esta celda.
cell.prototype.express = function() {
    var co;
    switch (this.cType) { //elegir color segun estado
        case "rock":
            co = '#542437';
            break;
        case "wall":
            co = '#53777A';
            break;
        case "floor":
            co = '#ECD078';
            break;
    }
    ctx.fillStyle = co;
    ctx.fillRect(this.cposX, this.cposY, cellSize, cellSize); //dibujar la celda
}

var testArr = [[0, 1], [0, 2], [0, 3]];