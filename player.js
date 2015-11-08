
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
	
	this.cooldownTimer = 0;
	
	this.image.src = "mage.png";
}

Player.prototype.update = function(deltaTime)
{		

	if(this.cooldownTimer > 0)
	{
		this.cooldownTimer -=deltaTime;
	}

	if(keyboard.isKeyDown(keyboard.KEY_W) == true)
	{
		this.position.y -= 4;
		this.direction = UP;
	}
	if(keyboard.isKeyDown(keyboard.KEY_A) == true)
	{
		this.position.x -= 4;
		this.direction = LEFT;
	}
	if(keyboard.isKeyDown(keyboard.KEY_S) == true)
	{
		this.position.y += 4;
		this.direction = DOWN;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D) == true)
	{
		this.position.x += 4;
		this.direction = RIGHT;
	}
	
	if(keyboard.isKeyDown(keyboard.KEY_UP) == true && this.cooldownTimer <= 0)
	{
		this.cooldownTimer = 0.3;

		var bullet = new Bullet(this.position.x, this.position.y, UP);
		bullets.push(bullet);		
	}

	if(keyboard.isKeyDown(keyboard.KEY_DOWN) == true && this.cooldownTimer <= 0)
	{
		this.cooldownTimer = 0.3;

		var bullet = new Bullet(this.position.x, this.position.y, DOWN);
		bullets.push(bullet);		
	}

	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true && this.cooldownTimer <= 0)
	{
		this.cooldownTimer = 0.3;

		var bullet = new Bullet(this.position.x, this.position.y, LEFT);
		bullets.push(bullet);		
	}

	if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true && this.cooldownTimer <= 0)
	{
		this.cooldownTimer = 0.3;

		var bullet = new Bullet(this.position.x, this.position.y, RIGHT);
		bullets.push(bullet);		
	}
	
	// calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX); 
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);

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

}


Player.prototype.draw = function(deltaTime)
{
	context.drawImage(this.image, this.position.x, this.position.y);
}