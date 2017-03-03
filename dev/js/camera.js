class CameraController extends Speaker {
    constructor(communications) {
        super(communications);
        this.mainContainer = document.getElementById('mainContainer');
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.camera = document.getElementById('layout');
        this.cameraWidth = this.getCameraWidth();
        this.cameraHeight = this.getCameraHeight();
        this.listenTo('requestCameraOn');
        this.setMainContainerSize();
    }

    setMainContainerSize() {
        this.mainContainer.style.width = this.cameraWidth * globalparams.cellSize + 'px';
        this.mainContainer.style.height = this.cameraHeight * globalparams.cellSize + 'px';
    }

    getCameraWidth() {
        return Math.floor((this.windowWidth * 0.8) / globalparams.cellSize);
    }

    getCameraHeight() {
        return Math.floor((this.windowHeight * 0.8) / globalparams.cellSize);
    }

    getMaxOffsetX() {
        return globalparams.dunWidth - this.cameraWidth;
    }

    getMaxOffsetY() {
        return globalparams.dunHeight - this.cameraHeight;
    }

    setCameraPositionCell(x, y) {
        console.log(x);
        console.log(y);
        if (y <= this.getMaxOffsetY()) {
            this.camera.style.top = -(y * globalparams.cellSize) + 'px';
        } else {
            this.camera.style.top = -(this.getMaxOffsetY() * globalparams.cellSize) + 'px';
        }

        if (x <= this.getMaxOffsetX()) {
            this.camera.style.left = -(x * globalparams.cellSize) + 'px';
        } else {
            this.camera.style.left = -(this.getMaxOffsetX() * globalparams.cellSize) + 'px';
        }
    }

    setCameraCenterCell(x, y) {
        this.setCameraPositionCell(x - Math.floor(this.cameraWidth / 2), y - Math.floor(this.cameraHeight / 2))
    }

    onRequestCameraOn(data) {
        Array.isArray(data) ? 
        this.setCameraCenterCell(data[0], data[1]) :
        this.setCameraCenterCell(arguments[0], arguments[1])
    }

}
