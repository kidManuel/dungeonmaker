class MouseController {
    constructor(communications) {
        this.coms = communications;
        this.ui = document.getElementById('ui').getContext('2d');
        this.cursorElems = document.getElementById('cursor');
        this.cursor = this.cursorElems.getContext('2d');
        this.posX = 0;
        this.posY = 0;
        this.cellX = 0;
        this.cellY = 0;
        this.preCellX = 0;
        this.preCellY = 0;
        this.draw = {
            is: false,
            drawMode: 'line',
            drawStart: [],
            drawPrev: []
        };
        this.addListeners();
    }   

    addListeners() {
        let myMouse = this;
        document.onmousemove = function(e){myMouse.getMouse(e)};
        this.cursorElems.addEventListener('click', function(e){myMouse.onClick(e)});
    }

    onClick() {
        console.log(dun.cellAt(this.cellX, this.cellY))

        // if (!ui.pristine) {
        //     ui.massClear();
        //     return;
        // }

        // if (!this.draw.is) {
        //     this.draw.drawStart[0] = this.cellX;
        //     this.draw.drawStart[1] = this.cellY;
        //     this.draw.is = true;
        // } else {
        //     ui.pristine = false;
        //     this.draw.is = false;
        // }
    }

//gets the current cell of the mouse, and determines if it has changed.
    getMouse(e) {
        var tempX = Math.floor(e.pageX / globalparams.cellSize);
        var tempY = Math.floor(e.pageY / globalparams.cellSize);

        if (tempX > globalparams.dunWid) {
            tempX = globalparams.dunWid
        }
        if (tempY > globalparams.dunHei) {
            tempY = globalparams.dunHei
        }

        if (tempX < 0) {
            tempX = 0
        }
        if (tempY < 0) {
            tempY = 0
        }


        if (tempX !== this.cellX || tempY !== this.cellY) {
            /**************************
            UPDATE FOR OPTIMIZATION?
            /**************************/
            this.preCellX = this.cellX;
            this.preCellY = this.cellY;
            this.cellX = tempX;
            this.cellY = tempY;
            this.mouseMoved();
        }

    }

//Handles functions triggered when mouse has moved.
    mouseMoved() {
        this.eraseCursor();
        document.getElementById('MouseX').value = this.cellX;
        document.getElementById('MouseY').value = this.cellY;

        if (this.draw.is) { //CURRENT DRAW / HIGHLIGHT FUNCTION, SEPARATE EVENTUALLY
            ui.clearCells(dun.drawRectCorners(this.draw.drawStart, [this.preCellX, this.preCellY]));
            ui.massHightlight(dun.brasLine(this.draw.drawStart, [this.cellX, this.cellY]));
        }
        this.coms.dispatch('drawCursor', {x: this.cellX, y: this.cellY})
    }

//erases the crosshairs
    eraseCursor() {
        this.cursor.clearRect(this.preCellX * globalparams.cellSize, this.preCellY * globalparams.cellSize, globalparams.cellSize, globalparams.cellSize);
    }

}


