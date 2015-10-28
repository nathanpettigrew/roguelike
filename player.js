
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
	//need sprite name
	this.sprite = new Sprite("mage.png");
	
	//For when we need to animate the player
		for(var i=0; i < ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}
	
	this.position = new Vector2();
	this.position.set(200, 200);
	
	this.isDead = false;
	this.velocity = new Vector2();
	this.direction = LEFT;
	
	this.image.src = "mage.png";
}

Player.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
	var left = false;
	var right = false;
	var up = false;
	var down = false;
	
	//check keypress events
	if(keyboard.isKeyDown(keyboard.A) == true)
	{
		left = true;
		this.direction = LEFT;
		if(this.sprite.currentAnimation != ANIM_WALK_LEFT == false)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
	}
	else if(keyboard.isKeyDown(keyboard.D) == true)
	{
		right = true;
		this.direction = RIGHT;
		if(this.sprite.currentAnimation != ANIM_WALK_RIGHT == false)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
	}
	else if(keyboard.isKeyDown(keyboard.W) == true)
	{
		up = true;
		this.direction = UP;
		if(this.sprite.currentAnimation != ANIM_WALK_UP == false)
			this.sprite.setAnimation(ANIM_WALK_UP);
	}
	else if(keyboard.isKeyDown(keyboard.S) == true)
	{
		down = true;
		this.direction = DOWN;
		if(this.sprite.currentAnimation != ANIM_WALK_DOWN == false)
			this.sprite.setAnimation(ANIM_WALK_DOWN);
	}
	else
	{
		if(this.direction == LEFT)
		{
			if(this.sprite.currentAnimation != ANIM_IDLE_LEFT)
				this.sprite.setAnimation(ANIM_IDLE_LEFT);
		}
		else if(this.direction == RIGHT)
		{
			if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
				this.sprite.setAnimation(ANIM_IDLE_RIGHT);
		}
		else if(this.direction == UP)
		{
			if(this.sprite.currentAnimation != ANIM_IDLE_UP)
				this.sprite.setAnimation(ANIM_IDLE_UP);
		}
		else
		{
			if(this.currentAnimation != ANIM_IDLE_DOWN)
				this.sprite.setAnimation(ANIM_IDLE_DOWN);
		}
	}
	
	//setting velocity
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
	
	//check these
	//if(up)
		//ddy = ddy + ACCEL;
	//else if
		//ddy = ddy - FRICTION;
		
	//if(down)
		//ddy = ddy - ACCEL;
	//else if
		//ddy = ddy + FRICTION;
	
	//calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	
	//if  ((wasleft && (this.velocity.x > 0)) ||
		// (wasright && (this.velocity.x < 0)))
	 //{
		//clamp at zero to prevent friction from making us ji8ggle to side
		//this.velocity.x = 0;
	 //}
	
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; 	//true if player overlaps right
	var ny = (this.position.y)%TILE; 	//true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	//Check if player has hit a platform
	if (this.velocity.y > 0)
	{
		if((celldown && !cell) || (celldiag && !cellright && nx))
		{
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;
		}
	}
	else if (this.velocity.y < 0)
	{
		if ((cell && !celldown) || (cellright && !celldiag && nx))
		{
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0;
		}
	}
	if (this.velocity.x > 0)
	{
		if ((cellright && !cell) || (celldiag && !celldown && ny))
		{
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;
		}
	}
	else if (this.velocity.x < 0)
	{
		if ((cell && !cellright) || (celldown && celldiag && ny))
		{
			this.position.x = tileToPixel(tx + 1);
			this.velocity.x = 0;
		}
	}
}

Player.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x, this.position.y);
}