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
		//Review after array.prototype.iterate

    	var selection = [];
    	var cells = this.cells;

	    if (array) {
	    	for (var k = 0; k < array.length; k++) {
	            var currentCell = cells[array[k][0]][array[k][1]];
	            if(filter){
    	            if(this.cellIsType(currentCell, filter)) {
    	                selection.push(currentCell)
    	            };
	           	} else {
	           		selection.push(currentCell);
	           	}
	        }
	   	} else {
	   		for (var i = 0; i < cells.length; i++) {
	            for (var j = 0; j < cells[i].length; j++) {
	                var currentCell = cells[i][j];
	                if (filter){
    	                if(this.cellIsType(currentCell, filter)) {
    	                	selection.push(currentCell);
    	                };
	               	} else {
	               		selection.push(currentCell);
	               	}
	            }
	        }
	   	}

	    return selection;
	}

	cellIsType(testCell, type) {
	return (testCell instanceof cell && testCell.type === filter);

	/*
	if (testCell instanceof cell && testCell.type === filter) {
                return true;
            } else {
            	return false
            }
    }
   	*/

}