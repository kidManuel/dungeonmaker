var uiElems = document.getElementById("ui"),
    ui = uiElems.getContext("2d"),
    spriteSheet = new Image(),
    currentX = 0,
    currentY = 0;

spriteSheet.src = "imgs/spr.png";
document.onmousemove = drawCursor;

function sprite(options) {
    this.context = options.context;
    this.sX = options.sourceX;
    this.sY = options.sourceY;
    this.width = options.width;
    this.height = options.height;
    this.image = options.image;
}


var cursor = new sprite({
    context: uiElems.getContext("2d"),
    sourceX: 0,
    sourceY: 0,
    width: 15,
    height: 15,
    image: spriteSheet
});

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

function eraseCursor(){
    ui.clearRect(cellSize, cellSize, currentX*cellSize, currentY*cellSize);
}




function drawCursor(e) {
var tempX = Math.floor(e.pageX/cellSize)-1;
    tempY = Math.floor(e.pageY/cellSize)-1;



    if (tempX < 0) {
        tempX = 0
    }
    if (tempY < 0) {
        tempY = 0
    }

    if(tempX !== currentX || tempY !== currentY){
        eraseCursor();
        currentX = tempX;
        currentY = tempY;
        cursor.render(currentX, currentY);
    }

    document.getElementById("MouseX").value = tempX;
    document.getElementById("MouseY").value = tempY;


}
