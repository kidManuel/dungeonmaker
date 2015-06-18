var dunWidth = 40;
var dunHeight = 40;
var mainArr = [];



function housekeeping() {
    $("#main").css({
        "background-color": "#6B6B6B",
        "width": dunWidth * 10 + "px",
        "height": dunHeight * 10 + "px"
    })

    for (i = 0; i < dunWidth; i++) {
        mainArr[i] = new Array(dunHeight);
    }

    justFill();

}

$(document).ready(function() {
    housekeeping();
});


function addTile(type) {
    var tile = document.createElement("div");
    tile.className = "tile " + type;
    $("#main").append(tile);
}

function justFill(type) {
    for (i = 0, len = mainArr.length; i < len; i++) {
        for (j = 0, len2 = mainArr[i].length; j < len2; j++) {
            if (typeof type == 'undefined') {
                addTile(getRandomTile());
            } else {
                addTile(type)
            }
        }
    }
}
















function getRandomTile() {
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            return "rock";
            break;
        case 1:
            return "wall";
            break;
        case 2:
            return "floor";
            break;
    }

}






function tile(type) {
    this.class = type;
}

function getSquare() {}
