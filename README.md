# dungeonmaker

random map generator using customizable parameters. 

customizing variables to be found in 

    **js/main.js : lines 7 to 10 

dunWid = Size of the dungeon in cells in the  x axis

dunHei = Size of the dungeon in cells in the  Y axis

cellSize = Size of each cell in pixels

density = Ammount of attempts at populating the dungeon. Higher translates to more denesly populated and more complex maps.

    **js/ui.js: line 65 "ui.massHightlight(dun.brasLine(mouse.draw.drawStart, [mouse.cellX, mouse.cellY]));"
    
    replace the function call "dun.brasLine" for different mouse functionality:
    
    -dun.brasLine: Brasenham's line algorithm.
    
    -dun.simplePath: Random optimal-distance path
    
    -dun.drawRectCorners: Square highlght.
