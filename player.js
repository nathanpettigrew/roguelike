
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var Player = function() 
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.set(320, 240);
	
	this.width = 64;
	this.height = 64;
	
	this.direction = DOWN;
	
	this.velocity = new Vector2();
	
	this.cooldownTimer = 0.3;
	
	this.image.src = "mage.png";
}

var temTT = 0;

var staticX = 320;

Player.prototype.update = function(deltaTime)
{	

	var left = false;
	var right = false;
	var up = false;
	var down = false;
	

	if(keyboard.isKeyDown(keyboard.KEY_W) == true)
	{
		up = true;
		this.direction = UP;
	}
	if(keyboard.isKeyDown(keyboard.KEY_A) == true)
	{
		left = true;
		this.direction = LEFT;
	}
	if(keyboard.isKeyDown(keyboard.KEY_S) == true)
	{
		down = true;
		this.direction = DOWN;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D) == true)
	{
		right = true;
		this.direction = RIGHT;
	}
	
	var wasleft = this.velocity.x < 0;
	var wasright = this.velocity.x > 0;
	var wasup = this.velocity.y > 0;
	var wasdown = this.velocity.y < 0;
	var ddx = 0;
	var ddy = 0;
	
	if (left) {
		this.position.x -= MAXDX * deltaTime;
	}
	if (right) {
		this.position.x += MAXDX * deltaTime;
	}
	if (up) {
		this.position.y -= MAXDY * deltaTime;
	}
	if (down) {
		this.position.y += MAXDY * deltaTime;
	}
	
	this.cooldownTimer -= deltaTime;
	if (this.cooldownTimer <= 0)
	{
		if(keyboard.isKeyDown(keyboard.KEY_UP))
		{
			var bullet = new Bullet(this.position.x, this.position.y, UP);
			bullets.push(bullet);	
			sfxFire.play();
			this.cooldownTimer = 1;
		}
		else if(keyboard.isKeyDown(keyboard.KEY_DOWN))
		{
			var bullet = new Bullet(this.position.x, this.position.y, DOWN);
			bullets.push(bullet);	
			sfxFire.play();
			this.cooldownTimer = 1;		
		}
			
		else if(keyboard.isKeyDown(keyboard.KEY_LEFT))
		{	
			var bullet = new Bullet(this.position.x, this.position.y, LEFT);
			bullets.push(bullet);
			sfxFire.play();			
			this.cooldownTimer = 1;
		}
		else if(keyboard.isKeyDown(keyboard.KEY_RIGHT))
		{
			var bullet = new Bullet(this.position.x, this.position.y, RIGHT);
			bullets.push(bullet);	
			sfxFire.play();
			this.cooldownTimer = 1;		
		}
	
	}
	
	this.position.x = Math.round(this.position.x);
	this.position.y = Math.round(this.position.y);
	
	// collision detection
	// Our collision detection logic is greatly simplified by the fact that the player is a rectangle
	// and is exactly the same size as a single tile. So we know that the player can only ever
	// occupy 1, 2 or 4 cells.
	// This means we can short-circuit and avoid building a general purpose collision detection
	// engine by simply looking at the 1 to 4 cells that the player occupies:
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	
	if (right) 
	{
		if ((cellright && !cell) || (celldiag && !celldown && ny))
		{
		 // clamp the x position to avoid moving into the platform we just hit
		 this.position.x = tileToPixel(tx);
		 // this.velocity.x = 0; // stop horizontal velocity
		}
	}
	if (left) 
	{
		 if ((cell && !cellright) || (celldown && !celldiag && ny)) 
		 {
			// clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx + 1);
			// this.velocity.x = 0; // stop horizontal velocity
		 }
	}
	
	if (down) 
	{
		if ((celldown && !cell) || (celldiag && !cellright && nx))
		{
		 // clamp the x position to avoid moving into the platform we just hit
		 this.position.y = tileToPixel(ty);
		 // this.velocity.x = 0; // stop horizontal velocity
		}
	}
	if (up) 
	{
		 if ((cell && !celldown) || (cellright && !celldiag && nx)) 
		 {
			// clamp the x position to avoid moving into the platform we just hit
			this.position.y = tileToPixel(ty + 1);
			// this.velocity.x = 0; // stop horizontal velocity
		 }
	}
}


Player.prototype.draw = function(deltaTime)
{
	context.drawImage(this.image, this.position.x, this.position.y);
}