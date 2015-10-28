var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

//var player = new Player();
var keyboard = new Keyboard();

	//event handlers
window.addEventListener('keydown', function(evt) { onKeyDown(evt) ; }, false);
//window.addEventListener('keyup', function(evt) { onKeyUp(evt) ; }, false);

	//constant values for gamestates
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var health = 7;
var score = 0;
var gameState = STATE_SPLASH;

	//functions for Gamestates
var splashTimer = 3;
function runSplash (deltaTime)
{
	splashTimer -= deltaTime;
	if(splashTimer <= 0)
	{
		gameState = STATE_GAME;
		health = 10;
		score = 0;
		return;
	}
}
function runGame()
{
	context.fillStyle = "#ccc"
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
//		case STATE_GAME;
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
	}
}
function runGameOver(deltaTime)
{
	splashTimer -= deltaTime;
	if(splashTimer <= 0)
	{
		player.isDead = false;
		splashTimer = 3;
		gameState = STATE_SPLASH;
		return;
	}
}

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