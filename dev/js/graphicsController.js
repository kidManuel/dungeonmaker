class GraphicsController extends Speaker {
    constructor(comunications) {
        super(comunications);
        this.widthPixels = globalparams.dunWidth * globalparams.cellSize; //size in pixels of the floor.
        this.heightPixels = globalparams.dunHeight * globalparams.cellSize;
        this.allCanvas = document.querySelectorAll('canvas');
        this.layout = document.getElementById('layout').getContext('2d');
        this.cursor = document.getElementById('cursor').getContext('2d');
        this.mainContainer = document.getElementById('mainContainer');
        this.sources = {
            'general': document.getElementById('general'),
            'characters': document.getElementById('characters')
        }
        this.options = {
            //review when xhr solution rolls around -__-
            'crosshair': {
                source: 'general',
                sourceX: 0,
                sourceY: 0,
            },
            'character': {
                source: 'characters',
                sourceX: 0,
                sourceY: 0,
            },
            'rock':'#542437',
            'wall':'#A43F68',
            'floor':'#ECD078',
            'PING':'#C3E90D'
        }
        this.initializeCanvases();
        this.listenTo('cellsUpdate');
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
        let terrainOptions = this.options[cell.floor];
        if (typeof terrainOptions === 'object') {
            this.render(cell.floor, cell.getPosX(), cell.getPosY());
        } else if(typeof terrainOptions === 'string') {
            this.drawCellAsColor(terrainOptions, cell.getPosX(), cell.getPosY());
        }
    }



    expressCellEntity(cell) {
        if (cell.entity){
            this.render(cell.entity.sprite, cell.getPosX(), cell.getPosY())
        }
    }

    render(imageToDraw, x, y, specialContext) {
        let target = this.options[imageToDraw];
        let context = specialContext ? this[specialContext] : this.layout;
        context.drawImage(
            this.sources[target.source],
            target.sourceX,
            target.sourceY,
            target.width || globalparams.cellSize,
            target.height || globalparams.cellSize,
            x,
            y,
            globalparams.cellSize,
            globalparams.cellSize
        );
    }

    drawCellAsColor(color, x, y) {
        this.layout.fillStyle = color;
        this.layout.fillRect(x, y, globalparams.cellSize, globalparams.cellSize);
    }

    massExpress(tilesArray) {
        let controller = this;
        tilesArray.iterate(
            function(tile) {
                controller.expressCellFull(tile);
            }
        )
    }
    onCellsUpdate(data) {
        this.massExpress(data);
    }
}
