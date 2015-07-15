spriteSheet = new Image();
spriteSheet.src = "imgs/spr.png";

var cursor = new sprite({
    context: uiElems.getContext("2d"),
    sourceX: 0,
    sourceY: 0,
    width: 15,
    height: 15,
    image: spriteSheet
});