class dungeon {
	constructor(width, height) {    
		this.width = width;
    	this.height = height;
    	this.cells = [];
    	this.init();
	}

	init(){
		for (var i = 0; i < this.width; i++) {
        	this.cells[i] = [];
        	for (var j = 0; j < this.height; j++) {
            	this.cells[i][j] = new cell(i, j, 'rock');
        	}
        }
	}

	findTiles(filter, array) {
    	var selection = [];
    	var cells = array || this.cells;

    	
		//Review after array.prototype.flatten
    	if(!filter && !array) {
    		selection = cells.reduce(function(a, b) {
  				return a.concat(b);
			})
			return selection;
    	}

    	cells.iterate(
    		function() {
    			if(dungeon.cellIsType(this, filter)) {
    				selection.push(this)
    			}
    		}
    	)

	    return selection;
	}

	//Move to cell ?
	static cellIsType(testCell, filter) {
		return (testCell instanceof cell && testCell.type === filter);
	}

	massExpress(tilesArray) {
	    for (var i = 0; i < tilesArray.length; i++) {
	        this.cellAt(tilesArray[i].X, tilesArray[i].Y).express();
	}
	
}
