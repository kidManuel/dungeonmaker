// figure out what do we do with this 



class GraphicsController {
    constructor() {
        this.widthPixels = globalparams.dunWidth * globalparams.cellSize; //size in pixels of the floor.
        this.heightPixels = globalparams.dunHeight * globalparams.cellSize;
        this.allCanvas = document.querySelectorAll('canvas');
        this.layout = document.getElementById('layout').getContext('2d');
        this.cursor = document.getElementById('cursor').getContext('2d');
        this.mainContainer = document.getElementById('mainContainer');
        this.options = {
            //review when xhr solution rolls around -__-
            'crosshair': {
                source: spriteSheet,
                sourceX: 0,
                sourceY: 0,
                width: 15,
                height: 15,
            },
            'character': {
                source: characters,
                sourceX: 0,
                sourceY: 0,
                width: 23,
                height: 23,
            },
            'rock':'#542437',
            'wall':'#A43F68',
            'floor':'#ECD078',
            'PING':'#C3E90D'
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

    expressCellFull(cell) {
        this.expressCellTerrain(cell);
        if (cell.entity) {
            this.expressCellEntity(cell);
        }
    }

    expressCellTerrain(cell) {
        //review once sprites roll around
        let color = this.options[cell.floor];
        this.layout.fillStyle = color;
        this.layout.fillRect(cell.getPosX(), cell.getPosY(), globalparams.cellSize, globalparams.cellSize);
    }

    expressCellEntity(cell) {
        if (cell.entity){
                this.render(cell.entity.sprite, cell.x, cell.y)}
    }

    render(imageToDraw, x, y, specialContext) {
        let target = this.options[imageToDraw];
        let context = specialContext ? this[specialContext] : this.layout;
        context.drawImage(
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

    massExpress(tilesArray) {
        let controller = this;
        tilesArray.iterate(
            function(tile) {
                controller.expressCellFull(tile);
            }
        )
    }
}
