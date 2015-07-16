var uiElems = document.getElementById("ui"),
    ui = uiElems.getContext("2d");


//main sprite definition. parent for all graphical classess
function sprite(options) {
    this.context = options.context; //this gets the canvas layer in wich the sprite should be rendered.
    this.sX = options.sourceX;
    this.sY = options.sourceY;
    this.width = options.width;
    this.height = options.height;
    this.image = options.image;
}

sprite.prototype.render = function(x, y) {
    this.context.drawImage(
        this.image,
        this.sX,
        this.sY,
        this.width,
        this.height,
        x * cellSize,
        y * cellSize,
        cellSize,
        cellSize
    );
};

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
        drawStart: []
    };
}

mouse = new mouseController();

//gets the current cell of the mouse, and determines if it has changed.
function getMouse(e) {
    var tempX = Math.floor(e.pageX / cellSize) - 1,
        tempY = Math.floor(e.pageY / cellSize) - 1;

    if (tempX < 0) {
        tempX = 0
    }
    if (tempY < 0) {
        tempY = 0
    }

    if (tempX !== mouse.cellX || tempY !== mouse.cellY) {
        //UPDATE FOR OPTIMIZATION
        ///////////
        mouse.preCellX = mouse.cellX;
        mouse.preCellY = mouse.cellY;
        mouse.cellX = tempX;
        mouse.cellY = tempY;
        mouse.mouseMoved();
    }

}

//Handles functions triggered when mouse has moved.
mouseController.prototype.mouseMoved = function() {
    if (mouse.drawing) {
        ui.clearCells(dun.drawRectCorners(mouse.draw.drawStart, [mouse.preCellX, mouse.preCellY]));
        massHightlight(dun.brasLine(mouse.draw.drawStart, [mouse.cellX, mouse.cellY]));
    }
    this.drawCursor();
}


//draws the crosshairs
mouseController.prototype.drawCursor = function(x, y) {
    this.eraseCursor();
    cursor.render(this.cellX, this.cellY);
}

//erases the crosshairs
mouseController.prototype.eraseCursor = function() {
    ui.clearRect(this.preCellX * cellSize, this.preCellY * cellSize, cellSize, cellSize);
}



function massHightlight(myArray) {
    ui.strokeStyle = "#9DE0AD";
    ui.fillStyle = "rgba(229,252,194,0.5)"

    for (var i = 0; i < myArray.length; i++) {
        dun.cellAt(myArray[i][0], myArray[i][1]).highlight();
    }

}



document.onmousemove = getMouse;

uiElems.addEventListener('click', function(e) {
    if (!mouse.draw.is) {
        ui.clearRect(0,0, fullSizeW, fullSizeH);
        mouse.draw.drawStart[0] = mouse.cellX;
        mouse.draw.drawStart[1] = mouse.cellY;
    }
    mouse.drawing = !mouse.drawing;
})


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
