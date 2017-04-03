class Entity {
	constructor(id, x, y, sprite) {
		this.x = x;
		this.y = y;
		this.sprite = sprite;
		this.id = id;
	}

	placeIn(x,y) {
		//todo: add cell.entity = this
		this.x = x;
		this.y = y;
	}

	updateHp(value) {
		this.hitpoints += value;
		if(this.hitpoints <= 0) {
			this.do('die')
		}
	}

	getScreenPosition() {
		//todo: review on transition to dom
		let offset = $.camera.getCurrentCameraOffset();
		return {
			x: (this.x - offset.x) * globalparams.cellSize,
			y: (this.y - offset.y) * globalparams.cellSize
		}
	}

	//cleanup as well.
	do(actionName) {
		$.entities.action(actionName, this)
	}
}
