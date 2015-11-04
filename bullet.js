var UP = 0;
var LEFT = 1;
var RIGHT = 2;
var DOWN = 3;

var Bullet = function(x, y, direction)
{
	this.sprite = new Sprite("bullet.png");
	this.sprite.buildAnimation(1, 1, 32, 32, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();
	
	this.direction = direction;
	
	if(this.direction == LEFT)
		this.velocity.set(-MAXDX * 0.5, 0);
	else if (this.direction == RIGHT) 
		this.velocity.set(MAXDX * 0.5, 0);
	else if (this.direction == UP)
		this.velocity.set(0, -MAXDY * 0.5);
	else
		this.velocity.set(0, MAXDY * 0.5);
}

Bullet.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
}

Bullet.prototype.draw = function(deltaTime)
{
	var screenX = this.position.x - worldOffsetX;
	var screenY = this.position.y - worldOffsetY;
	this.sprite.draw(context, screenX, screenY, this.position.x this.position.y);
}