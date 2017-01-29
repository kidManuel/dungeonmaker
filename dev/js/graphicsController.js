// figure out what do we do with this 

spriteSheet = new Image();
spriteSheet.src = 'imgs/spr.png';

class GraphicsController {
    constructor() {
        this.widthPixels = globalparams.dunWidth * globalparams.cellSize; //size in pixels of the floor.
        this.heightPixels = globalparams.dunHeight * globalparams.cellSize;
        this.allCanvas = document.querySelectorAll('canvas');
        this.layout = document.getElementById('layout').getContext('2d');
        this.cursorElems = document.getElementById('cursor');
        this.mainContainer = document.getElementById('mainContainer');
        this.options = {
            //review when xhr solution rolls around -__-
            'crosshair': {
                source: spriteSheet,
                sourceX: 0,
                sourceY: 0,
                width: 15,
                height: 15,
                context: this.cursorElems.getContext('2d')
            }
        }
        this.initializeCanvases();
    }

    initializeCanvases() {
        this.mainContainer.style.width = this.widthPixels + 'px';
        this.mainContainer.style.height = this.heightPixels + 'px';

        for (var i = 0; i < this.allCanvas.length; i++) {
            this.allCanvas[i].width = this.widthPixels;
            this.allCanvas[i].height = this.heightPixels;
        }
    }

    drawTile(x, y, floorType) {
        //review once sprites roll around
        var pallette = {
            'rock':'#542437',
            'wall':'#A43F68',
            'floor':'#ECD078',
            'PING':'#C3E90D'
        }
        var color = pallette[floorType];
        this.layout.fillStyle = color;
        this.layout.fillRect(x, y, globalparams.cellSize, globalparams.cellSize);
    }

    render(imageToDraw, x, y) {
        let target = this.options[imageToDraw];
        target.context.drawImage(
            target.source,
            target.sourceX,
            target.sourceY,
            target.width,
            target.height,
            x * globalparams.cellSize,
            y * globalparams.cellSize,
            globalparams.cellSize,
            globalparams.cellSize
        );
    }
}
