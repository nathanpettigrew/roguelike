
var up = false;
var down = false;
var left = false;
var right = false;

var Player = function() 
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.set(320, 240);
	
	this.width = 64;
	this.height = 64;
	
	this.direction = down;
	
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
		up = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_A) == true)
	{
		this.position.x -= 4;
		left = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_S) == true)
	{
		this.position.y += 4;
		down = true;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D) == true)
	{
		this.position.x += 4;
		right = true;
	}
	
		if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true && this.cooldownTimer <= 0)
	{
		this.cooldownTimer = 0.3;
		
		if(this.direction == right)
		{
			var bullet = new Bullet(this.position.x, this.position.y, true);
			bullets.push(bullet);
		}
		else if (this.direction == left)
		{
			var bullet = new Bullet(this.position.x, this.position.y, false);
			bullets.push(bullet);
		}
		
	}
}

Player.prototype.draw = function(deltaTime)
{
	context.drawImage(this.image, this.position.x, this.position.y);
}