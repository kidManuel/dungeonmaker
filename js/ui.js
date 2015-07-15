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
    this.posX = 0,
        posY = 0,
        cellX = 0,
        cellY = 0,
        preCellX = 0,
        preCellY = 0;
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

document.onmousemove = getMouse;




