class Entity {
	constructor(coms, id, x, y, sprite) {
		//the coms situation is getting ridiculous
		this.coms = coms;
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
		let offset = this.coms.request('getCurrentCameraOffset');
		return {
			x: (this.x - offset.x) * globalparams.cellSize,
			y: (this.y - offset.y) * globalparams.cellSize
		}
	}


	do(actionName) {
		this.coms.request('action', actionName, this)
	}
}
