
//Setting directions
var LEFT = 0;
var RIGHT = 1;
var UP = 2;
var DOWN = 3;

//Walking Animation Variables
var ANIM_IDLE_LEFT = 1;
var ANIM_IDLE_RIGHT = 2;
var ANIM_IDLE_UP = 3;
var ANIM_IDLE_DOWN = 4;
var ANIM_WALK_LEFT = 5;
var ANIM_WALK_RIGHT = 6;
var ANIM_WALK_UP = 7;
var ANIM_WALK_DOWN = 8;
var ANIM_MAX = 9;

var Player = function() 
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.set(6*TILE, 3*TILE);
	
	this.width = 64;
	this.height = 64;
	
	// this.offset = new Vector2();
	// this.offset.set(-55, -87);
	
	this.velocity = new Vector2();
	
	this.image.src = "mage.png";
}

Player.prototype.update = function(deltaTime)
{		
	
	var left = false;
	var right = false;
	var up = false;
	var down = false;
	
	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var wasup = this.velocity.y > 0;
	var wasdown = this.velocity.y < 0;
	var ddx = 0;	
	var ddy = 0;
	
	if (left)
		ddx = ddx - ACCEL;
	else if (wasleft)
		ddx = ddx + FRICTION;
	
	if (right)
		ddx = ddx + ACCEL;
	else if (wasright)
		ddx = ddx - FRICTION;
	
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	
	if(keyboard.isKeyDown(keyboard.W) == true)
	{
		up = true;
		this.direction = UP;
	}
	
	else if(keyboard.isKeyDown(keyboard.A) == true)
	{
		left = true;
		this.direction = LEFT;
	}
	
	else if(keyboard.isKeyDown(keyboard.S) == true)
	{
		down = true;
		this.direction = DOWN;
	}
	
	else if(keyboard.isKeyDown(keyboard.D) == true)
	{
		right = true;
		this.direction = RIGHT;
	}
	
}

Player.prototype.draw = function(deltaTime)
{
	context.save();
	context.translate(this.x, this.y);
	context.rotate(this.rotation);
	context.drawImage(
		this.image, -this.width/2, -this.height/2);
	context.restore()	
}