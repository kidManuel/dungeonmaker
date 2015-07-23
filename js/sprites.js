spriteSheet = new Image();
spriteSheet.src = "imgs/spr.png";

var crosshair = new sprite({
    context: cursorElems.getContext("2d"),
    sourceX: 0,
    sourceY: 0,
    width: 15,
    height: 15,
    image: spriteSheet
});