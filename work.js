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
	
}

Player.prototype.draw = function(deltaTime)
{
	context.drawImage(this.image, SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
}