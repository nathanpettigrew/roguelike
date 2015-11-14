var Enemy = function(x,y) {
	this.image = document.createElement("img");
	
	this.width = 64;
	this.height = 64;
	
	this.position = new Vector2();
	this.position.set(x, y);

	this.image.src = "enemy.png";
};

Enemy.prototype.update = function(deltaTime)
{
	
}

Enemy.prototype.draw = function()
{
	context.save();
		context.translate(this.position.x - worldOffsetX, this.position.y - worldOffsetY);
		context.drawImage(this.image, this.width - 64, this.height - 64);
	context.restore();
}