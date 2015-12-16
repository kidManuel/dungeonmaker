spriteSheet = new Image();
spriteSheet.src = "imgs/spr.png";

//main sprite definition. parent for all graphical classess
function sprite(options) {
    this.image = options.image;
    this.sX = options.sourceX;
    this.sY = options.sourceY;
    this.width = options.width;
    this.height = options.height;
    this.context = options.context; //this gets the canvas layer in wich the sprite should be rendered.
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
    )
;};


// particular sprite declarations
var crosshair = new sprite({
    image: spriteSheet,
    sourceX: 0,
    sourceY: 0,
    width: 15,
    height: 15,
    context: cursorElems.getContext("2d")
});