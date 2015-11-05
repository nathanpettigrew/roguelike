
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var ANIM_IDLE_LEFT = 0;
var ANIM_WALK_LEFT = 1;
var ANIM_IDLE_RIGHT = 2;
var ANIM_WALK_RIGHT = 3;
var ANIM_IDLE_UP = 4;
var ANIM_WALK_UP = 5;
var ANIM_IDLE_DOWN = 6;
var ANIM_WALK_DOWN = 7;
var ANIM_MAX = 8;

var Player = function() 
{
	this.sprite = new Sprite("magespritesheet.png");
	//down walk animation
	this.sprite.buildAnimation(4, 4, 64, 64, 0, [0, 1, 2, 3]);
	//left walk animation
	this.sprite.buildAnimation(4, 4, 64, 64, 0, [4, 5, 6, 7]);
	//right walk animation
	this.sprite.buildAnimation(4, 4, 64, 64, 0, [8, 9, 10, 11]);
	//up walk animation
	this.sprite.buildAnimation(4, 4, 64, 64, 0, [12, 13, 14, 15]);
	//down idle animation
	this.sprite.buildAnimation(4, 4, 64, 64, 0, [0]);
	//left idle animation
	this.sprite.buildAnimation(4, 4, 64, 64, 0, [4]);
	//right idle animation
	this.sprite.buildAnimation(4, 4, 64, 64, 0, [8]);
	//up idle animation
	this.sprite.buildAnimation(4, 4, 64, 64, 0, [12]);

	for(var i=0; i<ANIM_MAX; i++)
	{
	    this.sprite.setAnimationOffset(i, -55, -87);
	}		


	this.position = new Vector2();
	this.position.set(320, 240);
	
	this.width = 64;
	this.height = 64;
	
	this.direction = DOWN;
	
	this.velocity = new Vector2();
	
	this.cooldownTimer = 0;
}

Player.prototype.update = function(deltaTime)
{		
	this.sprite.update(deltaTime);

	if(this.cooldownTimer > 0)
	{
		this.cooldownTimer -=deltaTime;
	}

	if(keyboard.isKeyDown(keyboard.KEY_W) == true)
	{
		this.position.y -= 4;
		this.direction = UP;
		if(this.sprite.currentAnimation != ANIM_WALK_UP)
			this.sprite.setAnimation(ANIM_WALK_UP);
	}
	if(keyboard.isKeyDown(keyboard.KEY_A) == true)
	{
		this.position.x -= 4;
		this.direction = LEFT;
		if(this.sprite.currentAnimation != ANIM_WALK_LEFT)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
	}
	if(keyboard.isKeyDown(keyboard.KEY_S) == true)
	{
		this.position.y += 4;
		this.direction = DOWN;
		if(this.sprite.currentAnimation != ANIM_WALK_DOWN)
			this.sprite.setAnimation(ANIM_WALK_DOWN);
	}
	if(keyboard.isKeyDown(keyboard.KEY_D) == true)
	{
		this.position.x += 4;
		this.direction = RIGHT;
		if(this.sprite.currentAnimation != ANIM_WALK_RIGHT)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
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
}


Player.prototype.draw = function(deltaTime)
{
	this.sprite.draw(context, this.position.x, this.position.y);
}