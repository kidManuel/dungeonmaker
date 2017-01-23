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

CanvasRenderingContext2D.prototype.massClear = function() {
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.pristine = true;
}

CanvasRenderingContext2D.prototype.massHightlight = function(myArray) {
    ui.strokeStyle = '#9DE0AD';
    ui.fillStyle = 'rgba(229,252,194,0.5)';

    for (var i = 0; i < myArray.length; i++) {
        dun.cellAt(myArray[i][0], myArray[i][1]).highlight();
    }
}
