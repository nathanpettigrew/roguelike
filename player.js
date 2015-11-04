
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
	
		if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true && this.cooldownTimer <= 0)
	{
		this.cooldownTimer = 0.3;
		
		if(this.direction == RIGHT)
		{
			var bullet = new Bullet(this.position.x, this.position.y, this.direction);
			bullets.push(bullet);
		}
		else if (this.direction == LEFT)
		{
			var bullet = new Bullet(this.position.x, this.position.y, this.direction);
			bullets.push(bullet);
		}
		else if (this.direction == UP)
		{
			var bullet = new Bullet(this.position.x, this.position.y, this.direction);
			bullets.push(bullet);
		}
		else 
			var bullet = new Bullet(this.position.x, this.position.y, this.direction);
			bullets.push(bullet);
		}
		
	}


Player.prototype.draw = function(deltaTime)
{
	context.drawImage(this.image, this.position.x, this.position.y);
}