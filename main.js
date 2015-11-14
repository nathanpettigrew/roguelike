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
var STATE_WIN = 3;
var lives = 3;
var score = 1;
var gameState = STATE_SPLASH;

//functions for Gamestates
var splashTimer = 3;

//'arrays'
var bullets = [];
var enemies = [];

var player = new Player();
var keyboard = new Keyboard();

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
//changed MAXDX and MAXDY to metre * 5, to achieve with desired speed
var METER = TILE;
var MAXDX = METER * 5;
var MAXDY = METER * 5;
var ACCEL = MAXDX;
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
function drawMap(){

	var startX = -1;
	var startY = -1;
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
	var maxTiles = Math.floor(SCREEN_HEIGHT /  TILE) + 2;
	var tileX = pixelToTile(player.position.x);
	var tileY = pixelToTile(player.position.y);
	var offsetX = TILE + Math.floor(player.position.x % TILE);
	var offsetY = TILE + Math.floor(player.position.y % TILE);
	
	startX = tileX - Math.floor(maxTiles / 2);

	if (startX < -1) {
		startX = 0;
		offsetX = 0;
	}
	if (startX > MAP.tw - maxTiles) {
		startX = MAP.tw - maxTiles + 1;
		offsetX = TILE;
	}
	worldOffsetX = startX * TILE + offsetX;
	
	startY = tileY - Math.floor(maxTiles / 2);
	
	if (startY < -1) {
		startY = 0;
		offsetY = 0;
	}
	if (startY > MAP.th - maxTiles) {
		startY = MAP.th - maxTiles + 1;
		offsetY = TILE;
	}
	worldOffsetY = startY * TILE + offsetY;
	
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
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE - worldOffsetX, (y)*TILE - worldOffsetY, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

var splashImage = document.createElement ("img");
splashImage.src = "ft00.jpg";
var heartImage = document.createElement ("img");
heartImage.src = "heartImage.png";

var player = new Player();
function runSplash(deltaTime) {
    splashTimer -= deltaTime;
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true) 
	{
		gameState = STATE_GAME;
	}
    if (splashTimer <= 0) {
        gameState = STATE_GAME;
		enemies.splice(0, enemies.length)
		spawnEnemy();
        return;
    }
	context.drawImage(splashImage, 0,0);
    context.fillStyle = "#FFF";
    context.font = "24px Papyrus EF";
    context.fillText("Rougelike", 210, 250);
	context.fillText("Press space to Enter World", 150, 311);
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
	
	context.fillStyle = "#FFF";
	context.font = "24px Arial";
	context.fillText("Lives:", 20, 30, 100);
	
	context.fillStyle = "#FFF";
	context.font = "24px Arial";
	context.fillText("Enemies Remaining: " + score, 375, 30, 240);
	
	for(var i=0; i < bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		if(bullets[i].position.x - worldOffsetX > SCREEN_WIDTH)
		{
			hit = true;
		}
		
		for(var j=0; j<enemies.length; j++)
		{
			if(intersects( bullets[i].position.x, bullets[i].position.y, TILE, TILE, 
			enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
			{
				//kill the bullet and enemy
				enemies.splice(j, 1);
				hit = true;
				//increment the player score
				score -= 1;
				break;
			}
		}
		if(hit == true)
		{
			bullets.splice(i, 1);
			break;
		}
	}
	
	for(var j=0; j<enemies.length; j++)
	{
		if(intersects(player.position.x, player.position.y, TILE, TILE, 
		enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
		{
			enemies.splice(j, 1);
			score -= 1;
			lives -= 1;
		}
	}
	
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);
		enemies[i].draw();
	}
	
	for(var i = 0; i < lives; i++) {
		context.drawImage(heartImage, 90 + ((heartImage.width + 2) * i), 10);
	}
	
	if (score <= 0)
	{
		gameState = STATE_WIN;
		return;
	}
	
	if (lives <= 0)
	{
		gameState = STATE_GAMEOVER;
		return;
	}
}

function runGameOver(deltaTime)
{
	context.fillStyle = "#ccc"
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	context.fillStyle = "#FFF";
	context.font = "24px Arial";
	context.fillText("GAME OVER", 250, 250);
	
}

function runGameWin(deltaTime)
{
	context.fillStyle = "#ccc"
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	context.fillStyle = "#FFF";
	context.font = "24px Arial";
	context.fillText("YOU WIN", 250, 250);
}

function spawnEnemy() {
    idx = 0;
    for (var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++) {
        for (var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++) {
            if (level1.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) {
                var px = tileToPixel(x);
                var py = tileToPixel(y);
                var e = new Enemy(px, py);
                enemies.push(e);
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
				} else if (cells[layerIdx][y][x] != 1) {
					// if we haven't set this cell's value, then set it to 0 now
					cells[layerIdx][y][x] = 0;
				}
				idx++;
								if (idx == 4094)
				{
					var NormansBreakpoint = idx;
				}
			}
		}
	}
    spawnEnemy();
	
	 musicBackground = new Howl(
	 {
		 urls: ["Forest Song.ogg"],
		 loop: true,
		 buffer: true,
		 volume: 0.5
	 });
	 musicBackground.play();
	 
	 sfxFire = new Howl(
	 {
		 urls: ["fireball.ogg"],
		 buffer: true,
		 volume: 1,
	 }
	 );
	
    };

function run(deltaTime) 
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	gameState == STATE_SPLASH
	
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
		case STATE_WIN:
		runGameWin(deltaTime);
			break;
	}
	   //display score
    context.fillStyle = "#000";
    context.font = "32px Comic Sans MS";
    context.fillText("Score: " + score, 800, 40);

	if(lives ==0 )
	{
		player.isDead = true;
		gameState = STATE_GAMEOVER;		
	}
	
    if (player.isDead == true) {
        enemies.splice(0, enemies.length)
        spawnEnemy();
        gameState = STATE_GAMEOVER;
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
window.onEachFrame(run);