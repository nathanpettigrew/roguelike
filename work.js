
var Player = function() 
{
	this.image = document.createElement("img");
	this.position = new Vector2();
	this.position.set(320, 240);
	
	this.width = 64;
	this.height = 64;
	
	// this.offset = new Vector2();
	// this.offset.set(-55, -87);
	
	this.velocity = new Vector2();
	
	this.image.src = "mage.png";
}

Player.prototype.update = function(deltaTime)
{		
	if(keyboard.isKeyDown(keyboard.KEY_W) == true)
	{
		this.position.y -= 1;
	}
	if(keyboard.isKeyDown(keyboard.KEY_A) == true)
	{
		this.position.x -= 1;
	}
	if(keyboard.isKeyDown(keyboard.KEY_S) == true)
	{
		this.position.y += 1;
	}
	if(keyboard.isKeyDown(keyboard.KEY_D) == true)
	{
		this.position.x += 1;
	}
}

Player.prototype.draw = function(deltaTime)
{
	context.drawImage(this.image, this.position.x, this.position.y);
}