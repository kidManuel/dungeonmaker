class Entity {
	constructor(id, x, y, sprite) {
		this.x = x;
		this.y = y;
		this.sprite = sprite;
		this.id = id;
	}

	placeIn(x,y) {
		this.x = x;
		this.y = y;
	}
}
