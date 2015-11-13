var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();
function getDeltaTime()		//Only call this function once per frame
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	if (deltaTime >1)		//validate the delta is within range
	{
		deltaTime = 1;
	}
	return deltaTime;
}

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var gameState = STATE_SPLASH;


	//functions for Gamestates
var splashTimer = 3;

//'arrays'
var bullets = [];
var enemies = [];

var player = new Player();
var keyboard = new Keyboard();

//var KEY_SPACE = 32;
//var KEY_LEFT = 37;
//var KEY_UP = 38;
//var KEY_RIGHT = 39;
//var KEY_DOWN = 40;

var LAYER_BACKGOUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_OBJECT_ENEMIES = 2;
var LAYER_COUNT = 3;

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

//tile variables
var TILE = 64;
var MAP = {tw:64, th:64};
var TILESET_TILE = 64;
var TILESET_PADDING = 0;
var TILESET_COUNT_X = 21;
var TILESET_COUNT_Y = 36;
var LAYER_COUNT = 3;
var TILESET_SPACING = 0;

//Collision constants
var METER = TILE;
var MAXDX = METER * 10;
var MAXDY = METER * 10;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 2;
var cells = [];
var tileset = document.createElement("img");
tileset.src = "tileset.png";

//intersects function
function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
    if (y2 + h2 < y1 ||
        x2 + w2 < x1 ||
        x2 > x1 + w1 ||
        y2 > y1 + h1) {
        return false;
    }
    return true;
}

function cellAtPixelCoord(layer, x, y) {
	if (x < 0 || x > SCREEN_WIDTH || y < 0) return 1;
	// let the player drop of the bottom of the screen (this means death)
	if (y > SCREEN_HEIGHT) return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty) {
	if (tx < 0 || tx >= MAP.tw || ty < 0) return 1;
	// let the player drop of the bottom of the screen (this means death)
	if (ty >= MAP.th) return 0;
	return cells[layer][ty][tx];
};

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
	if(value < min)
		return min;
	if(value > max)
		return max;
		return value;
}

var worldOffsetX = 0;
var worldOffsetY = 0;
function drawMap()
{
	for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++)
	{
		var idx = 0;
		for( var y = 0; y < level1.layers[layerIdx].height; y++ )
		{
			for( var x = 0; x < level1.layers[layerIdx].width; x++ )
			{
				if( level1.layers[layerIdx].data[idx] != 0 )
				{	
					// the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile), so subtract one from the tileset id to get the
					// correct tile
					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_X)) * (TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}



function runSplash (deltaTime)
{
	context.fillStyle = "#ccc"
	context.fillRect(0, 0, canvas.width, canvas.height);

	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true) 
	{
		gameState = STATE_GAME;
	}
}

function runGame()
{
	context.fillStyle = "#ccc"
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
		
	drawMap();
	player.update(deltaTime);
	player.draw();
	var hit = false;
		for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		bullets[i].draw();
	}
	
		for(var i=0; i < bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		if(bullets[i].position.x - worldOffsetX > SCREEN_WIDTH)
		{
			hit = true;
		}
		if(hit == true)
		{
			bullets.splice(i, 1);
			break;
		}
	}
	
}

function runGameOver(deltaTime)
{
	
	player.update(deltaTime);
    player.draw();
	splashTimer -= deltaTime;
	if(splashTimer <= 0)
	{
		player.isDead = false;
		splashTimer = 3;
		gameState = STATE_SPLASH;
		return;
	}
}

function spawnEnemy() {
    idx = 0;
    for (var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++) {
        for (var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++) {
            if (level1.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) {
                var px = tileToPixel(x);
                var py = tileToPixel(y);
                //var e = new Enemy(px, py);
                //enemies.push(e);
            }
            idx++;
        }
    }
}

var cells = []; //the array that holds our simplified collison data
function initialize() {
	for (var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) { // initialize the collision map
		cells[layerIdx] = [];
		var idx = 0;
		for (var y = 0; y < level1.layers[layerIdx].height; y++) {
			cells[layerIdx][y] = [];
			for (var x = 0; x < level1.layers[layerIdx].width; x++) {
				if (level1.layers[layerIdx].data[idx] != 0) {
					// for each tile we find in the layer data, we need to create 4 collisions
					// (because our collision squares are 64x64 but the tile in the
					// level are 64x64)
					cells[layerIdx][y][x] = 1;
				//	cells[layerIdx][y - 1][x] = 1;
				//	cells[layerIdx][y - 1][x + 1] = 1;
				//	cells[layerIdx][y][x + 1] = 1;
				} else if (cells[layerIdx][y][x] != 1) {
					// if we haven't set this cell's value, then set it to 0 now
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
    spawnEnemy();
 
    };

function run(deltaTime) 
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
	}
}


 
initialize();


//-------------------- Don't modify anything below here
//-------------------- if you do, stuff will break and the game will not run
// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() 
{
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();
window.onEachFrame(runGame);