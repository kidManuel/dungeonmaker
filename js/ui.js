var uiElems = document.getElementById("ui"),
    ui = uiElems.getContext("2d"),
    cursorElems = document.getElementById("cursor"),
    cursor = cursorElems.getContext("2d");


var mouseController = function() {
    this.posX = 0;
    this.posY = 0;
    this.cellX = 0;
    this.cellY = 0;
    this.preCellX = 0;
    this.preCellY = 0;
    this.draw = {
        is: false,
        drawMode: "line",
        drawStart: [],
        drawPrev: []
    };
}

mouse = new mouseController();

//gets the current cell of the mouse, and determines if it has changed.
function getMouse(e) {
    var tempX = Math.floor(e.pageX / cellSize) - 1,
        tempY = Math.floor(e.pageY / cellSize) - 1;

    if (tempX > dunWid) {
        tempX = dunWid
    }
    if (tempY > dunHei) {
        tempY = dunHei
    }

    if (tempX < 0) {
        tempX = 0
    }
    if (tempY < 0) {
        tempY = 0
    }


    if (tempX !== mouse.cellX || tempY !== mouse.cellY) {
        /**************************
        UPDATE FOR OPTIMIZATION?
        /**************************/
        mouse.preCellX = mouse.cellX;
        mouse.preCellY = mouse.cellY;
        mouse.cellX = tempX;
        mouse.cellY = tempY;
        mouse.mouseMoved();
    }

}

//Handles functions triggered when mouse has moved.
mouseController.prototype.mouseMoved = function() {
    this.eraseCursor();
    document.getElementById("MouseX").value = mouse.CellX;
    document.getElementById("MouseY").value = mouse.CellY;

    if (mouse.draw.is) { //CURRENT DRAW / HIGHLIGHT FUNCTION, SEPARATE EVENTUALLY
        ui.clearCells(dun.drawRectCorners(mouse.draw.drawStart, [mouse.preCellX, mouse.preCellY]));
        ui.massHightlight(dun.brasLine(mouse.draw.drawStart, [mouse.cellX, mouse.cellY]));
    }
    this.drawCursor();
}

//draws the crosshairs
mouseController.prototype.drawCursor = function(x, y) {
    crosshair.render(this.cellX, this.cellY);
}

//erases the crosshairs
mouseController.prototype.eraseCursor = function() {
    cursor.clearRect(this.preCellX * cellSize, this.preCellY * cellSize, cellSize, cellSize);
}


document.onmousemove = getMouse;

cursorElems.addEventListener('click', function(e) {

    if(!ui.pristine){
        ui.massClear();
        return;
    }

    if (!mouse.draw.is) {
        mouse.draw.drawStart[0] = mouse.cellX;
        mouse.draw.drawStart[1] = mouse.cellY;
        mouse.draw.is = true;
    }else{
        ui.pristine = false;
        mouse.draw.is = false;
    }

})


CanvasRenderingContext2D.prototype.pristine = true;

CanvasRenderingContext2D.prototype.clearCells = function(myArray) {
    var a = myArray[0],
        b = myArray[myArray.length - 1],
        top = Math.min(a[1], b[1]),
        bot = Math.max(a[1], b[1]),
        left = Math.min(a[0], b[0]),
        right = Math.max(a[0], b[0]),
        topLeft = dun.cellAt(left, top),
        botRight = dun.cellAt(right, bot)

    this.clearRect(topLeft.posX, topLeft.posY, botRight.posX - topLeft.posX + cellSize, botRight.posY - topLeft.posY + cellSize);
}

CanvasRenderingContext2D.prototype.massClear = function(){
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pristine = true;
}

CanvasRenderingContext2D.prototype.massHightlight = function(myArray) {
    ui.strokeStyle = "#9DE0AD";
    ui.fillStyle = "rgba(229,252,194,0.5)";

    for (var i = 0; i < myArray.length; i++) {
        dun.cellAt(myArray[i][0], myArray[i][1]).highlight();
    }
}