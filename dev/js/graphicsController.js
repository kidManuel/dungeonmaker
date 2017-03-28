class GraphicsController  {
    constructor(communications) {
        this.coms = communications;;
        this.widthPixels = globalparams.dunWidth * globalparams.cellSize; //size in pixels of the floor.
        this.heightPixels = globalparams.dunHeight * globalparams.cellSize;
        this.allCanvas = document.querySelectorAll('canvas');
        this.layout = document.getElementById('layout').getContext('2d');
        this.cursor = document.getElementById('cursor').getContext('2d');
        this.mainContainer = document.getElementById('mainContainer');
        this.sources = {
            'general': document.getElementById('general'),
            'characters': document.getElementById('characters'),
            'ground': document.getElementById('ground')
        }
        this.options = loadData('sprites');
        this.initializeCanvases();
        this.coms.listenTo('cellsUpdate', this);
        this.coms.listenTo('drawCursor', this);
        this.coms.listenTo('screenshake', this);
        this.coms.registerMethod('expressCellFull', this);
    }

    onScreenshake() {
        let me = this;
        let mainCont = this.mainContainer;
        mainCont.className += ' screenshaking';
        setTimeout(function(){mainCont.className = mainCont.className.replace(' screenshaking', '')}, 60)
    }


    onDrawCursor(event) {
        this.render('crosshair', event.x * globalparams.cellSize, event.y * globalparams.cellSize, 'cursor');
    }

    initializeCanvases() {
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
