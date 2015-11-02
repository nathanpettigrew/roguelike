var Player = function() 
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.set(50,50);
	
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
	}
	
	else if(keyboard.isKeyDown(keyboard.A) == true)
	{
		left = true;
	}
	
	else if(keyboard.isKeyDown(keyboard.S) == true)
	{
		down = true;
	}
	
	else if(keyboard.isKeyDown(keyboard.D) == true)
	{
		right = true;
	}
	
}

Player.prototype.draw = function(deltaTime)
{
	context.drawImage(this.image, SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
}