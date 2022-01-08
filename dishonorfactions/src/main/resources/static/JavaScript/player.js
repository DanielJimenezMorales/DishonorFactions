import { HealthBar } from './HealthBar.js';

export class Player
{
	constructor(gameScene, x, y, usingKeys, healthBarHorizontalDisp, healthBarVerticalDisp, data, side)
	{

		this.scene = gameScene;

		this.gameWebSocket = this.scene.registry.get("webSocket");

		this.playerSide = side;
		this.playerData = this.scene.cache.json.get(data);
		this.initialPositionX = x;
		this.initialPositionY = y;
		this.playerGraphics;

		this.isUsingKeys = usingKeys;
		this.cursors;
		this.keyLeft;
		this.keyRight;
		this.keyUp;
		this.keyDown;
		this.shootingKey;

		this.healthBarHorizontalDisplacement = healthBarHorizontalDisp;
		this.healthBarVerticalDisplacement = healthBarVerticalDisp;
		this.healthBarPositionX = this.initialPositionX - this.healthBarHorizontalDisplacement;
		this.healthBarPositionY = this.initialPositionY - this.healthBarVerticalDisplacement;
		this.healthBar;
		this.currentHealth = this.playerData.health;

		this.isHorizontallyMoving = false;
		this.isVerticallyMoving = false;
		this.facingDirection; //TRUE = LEFT, FALSE = RIGHT
		this.shootingRateTimer = 0;
		this.canShoot = true;
		this.projectilesGroup;
		this.isShooting = false;

		this.isDead = false;
		this.deadTimer;

		this.attackSounds;
	}

	getPlayerGraphics()
	{
		return this.playerGraphics;
	}

	setPosition(x,  y) //for websocket
	{ 
		this.playerGraphics.x = x;
		this.playerGraphics.y = y;
	}

	setFacingDirection(facing){
		this.facingDirection = facing;
	}

	setHealth(health)
	{
		this.health = health;
	}

	getPlayerProjectileGroup()
	{
		return this.projectilesGroup;
	}

	getIsDead()
	{
		return this.isDead;
	}

	getProjectileDamageToPlayer()
	{
		return this.playerData.projectileDamageToPlayer;
	}

	getProjectileDamageToTower()
	{
		return this.playerData.projectileDamageToTower;
	}

	create()
	{
		this.healthBar = new HealthBar(this.scene, this.currentHealth, this.healthBarPositionX, this.healthBarPositionY);
		this.healthBar.create();
		this.healthBar.scaleBar(0.4, 0.7);

		this.playerGraphics = this.scene.physics.add.sprite(this.initialPositionX, this.initialPositionY, this.playerData.spriteID);
		this.createAnimations();
		this.createInputs();
		this.playerGraphics.setCollideWorldBounds(true);

		this.createShootingRateTimer();
		this.projectilesGroup = this.scene.physics.add.group();

		this.attackSounds = this.scene.sound.add('attackSound');
	}

	createShootingRateTimer()
	{
		this.shootingRateTimer = this.scene.time.addEvent({
    		delay: 500,
    		callback: () => this.canShoot = true,
    		repeat: 0
		});
	}

	resetShootingTimer()
	{
		this.shootingRateTimer.reset(
		{
			delay: 500,
    		callback: () => this.canShoot = true,
    		repeat: 0
		});

		this.scene.time.addEvent(this.shootingRateTimer);
	}

	enableCanShoot(canShoot)
	{
		canShoot = true;
	}

	createInputs()
	{
		if(this.isUsingKeys)
		{
			this.keyLeft = this.scene.input.keyboard.addKeys("A");
        	this.keyRight = this.scene.input.keyboard.addKeys("D");
        	this.keyDown = this.scene.input.keyboard.addKeys("S");
        	this.keyUp = this.scene.input.keyboard.addKeys("W");
        	this.shootingKey = this.scene.input.keyboard.addKeys("F");
    	}
    	else
    	{
    		this.cursors = this.scene.input.keyboard.createCursorKeys();
    		this.shootingKey = this.scene.input.keyboard.addKeys("L");
    	}
	}

	createAnimations()
	{
		this.scene.anims.create({
            key: this.playerData.spriteID + 'right',
            frames: this.scene.anims.generateFrameNumbers(this.playerData.spriteID, { start: this.playerData.animations.right.start, end: this.playerData.animations.right.end }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: this.playerData.spriteID + 'turnLeft',
            frames: [ { key: this.playerData.spriteID, frame: this.playerData.animations.leftIdle.start } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: this.playerData.spriteID + 'turnRight',
            frames: [ { key: this.playerData.spriteID, frame: this.playerData.animations.rightIdle.start } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: this.playerData.spriteID + 'left',
            frames: this.scene.anims.generateFrameNumbers(this.playerData.spriteID, { start: this.playerData.animations.left.start, end: this.playerData.animations.left.end }),
            frameRate: 10,
            repeat: -1
        });
	}

	update()
	{
		if(!this.isDead)
		{
			this.updateMovementAndShooting();
			this.updateHealthBarPosition();
		}
	}

	updateMovementAndShooting()
	{
		this.isHorizontallyMoving = false;
		this.isVerticallyMoving = false;
		this.isShooting = false;

		if(this.isUsingKeys)
		{
			if(this.shootingKey.F.isDown)
			{
				if(this.canShoot)
				{
					this.canShoot = false;
					this.shootProjectile();
					this.resetShootingTimer();
				}
			}

			if (this.keyLeft.A.isDown)
	        {
	            this.playerGraphics.setVelocityX(-this.playerData.movementSpeed.x);

	            this.playerGraphics.anims.play(this.playerData.spriteID + 'left', true);
	            this.isHorizontallyMoving = true;
	            this.facingDirection = true;
	        }

	        else if (this.keyRight.D.isDown)
	        {
	            this.playerGraphics.setVelocityX(this.playerData.movementSpeed.x);
	            this.playerGraphics.anims.play(this.playerData.spriteID + 'right', true);
	            this.isHorizontallyMoving = true;
	            this.facingDirection = false;
	        }

	        else
	        {	        	
	            this.playerGraphics.setVelocityX(0);
	        }

	        if (this.keyUp.W.isDown)
	        {
	            this.playerGraphics.setVelocityY(-this.playerData.movementSpeed.y);

	            if(!this.isHorizontallyMoving)
	            {
	            	this.playerGraphics.anims.play(this.playerData.spriteID + 'right', true); //hay que cambiar el right ese por el sprite que sea
	            }
	            this.isVerticallyMoving = true;
	        }

	        else if (this.keyDown.S.isDown)
	        {
	            this.playerGraphics.setVelocityY(this.playerData.movementSpeed.y);

	            if(!this.isHorizontallyMoving)
	            {
	            	this.playerGraphics.anims.play(this.playerData.spriteID + 'right', true); //hay que cambiar el right ese por el sprite que sea
	        	}
	            this.isVerticallyMoving = true;
	        }
	        else
	        {
	        	this.playerGraphics.setVelocityY(0);
	        }

	        if(!this.isHorizontallyMoving && !this.isVerticallyMoving)
	        {
	            if(this.facingDirection)
	        	{
	        		this.playerGraphics.anims.play(this.playerData.spriteID + 'turnLeft');
	        	}
	        	else
	        	{
	        		this.playerGraphics.anims.play(this.playerData.spriteID + 'turnRight');
	        	}
	        }
	    }
	    else
	    {
	    	if(this.shootingKey.L.isDown && this.canShoot)
			{
				this.canShoot = false;
				this.shootProjectile();
				this.resetShootingTimer();
			}

	    	if (this.cursors.left.isDown)
	        {
	            this.playerGraphics.setVelocityX(-this.playerData.movementSpeed.x);

	            this.playerGraphics.anims.play(this.playerData.spriteID + 'left', true);
	            this.isHorizontallyMoving = true;
	            this.facingDirection = true;
	        }

	        else if (this.cursors.right.isDown)
	        {
	            this.playerGraphics.setVelocityX(this.playerData.movementSpeed.x);

	            this.playerGraphics.anims.play(this.playerData.spriteID + 'right', true);
	            this.isHorizontallyMoving = true;
	            this.facingDirection = false;
	        }
	        else
	        {	        	
	            this.playerGraphics.setVelocityX(0);
	        }

	        if (this.cursors.up.isDown)
	        {
	            this.playerGraphics.setVelocityY(-this.playerData.movementSpeed.y);

	            if(!this.isHorizontallyMoving)
	            {
	            	this.playerGraphics.anims.play(this.playerData.spriteID + 'right', true); //hay que cambiar el right ese por el sprite que sea
	            }
	            this.isVerticallyMoving = true;
	        }

	        else if (this.cursors.down.isDown)
	        {
	            this.playerGraphics.setVelocityY(this.playerData.movementSpeed.y);

	            if(!this.isHorizontallyMoving)
	            {
	            	this.playerGraphics.anims.play(this.playerData.spriteID + 'right', true); //hay que cambiar el right ese por el sprite que sea
	            }
	            this.isVerticallyMoving = true;
	        }
	        else
	        {
	            this.playerGraphics.setVelocityY(0);
	        }

	        if(!this.isHorizontallyMoving && !this.isVerticallyMoving)
	        {
	        	if(this.facingDirection)
	        	{
	        		this.playerGraphics.anims.play(this.playerData.spriteID + 'turnLeft');
	        	}
	        	else
	        	{
	        		this.playerGraphics.anims.play(this.playerData.spriteID + 'turnRight');
	        	}
	        }
	    }

	    if(this.playerSide == "left")
	    {
	    	var playerData = {"type" : "position",
			"x" : this.playerGraphics.x,
			"y" : this.playerGraphics.y, 
			"isAttacking" : this.isShooting,
			"facingDirection": this.facingDirection,
			"health" : this.health};

			this.gameWebSocket.send(JSON.stringify(playerData));	
	    }
		
	}

	updateHealthBarPosition()
	{
		this.calculateHealthBarPosition();
	    this.healthBar.setPosition(this.healthBarPositionX, this.healthBarPositionY);
	}

	calculateHealthBarPosition()
	{
		this.healthBarPositionX = this.playerGraphics.x - this.healthBarHorizontalDisplacement;
		this.healthBarPositionY = this.playerGraphics.y - this.healthBarVerticalDisplacement;
	}

	shootProjectile()
	{
		this.attackSounds.play();
		var velocityMultiplier = 1;

		if(this.facingDirection)
		{
			velocityMultiplier = -1;
		}
		else
		{
			velocityMultiplier = 1;
		}

		var projectile = this.scene.physics.add.sprite(this.playerGraphics.x, this.playerGraphics.y, this.playerData.projectileSpriteID);
		this.projectilesGroup.add(projectile);
		projectile.setVelocityX(velocityMultiplier * 900);
		this.isShooting = true;
	}

	stopPlayerMovement()
	{
		this.playerGraphics.setVelocityX(0);
		this.playerGraphics.setVelocityY(0);
		
		if(this.facingDirection)
    	{
    		this.playerGraphics.anims.play(this.playerData.spriteID + 'turnLeft');
    	}
    	else
    	{
    		this.playerGraphics.anims.play(this.playerData.spriteID + 'turnRight');
    	}
	}

	damagePlayer(damage)
	{
		this.currentHealth -= damage;

		if(this.currentHealth < 0)
		{
			this.currentHealth = 0;
			this.killPlayer();
		}

		this.healthBar.setValue(this.currentHealth);
	}

	killPlayer()
	{
		this.isDead = true;
		this.playerGraphics.visible = false;
		this.playerGraphics.body.enable = false;
		this.deadTimer = this.scene.time.addEvent(
			{
				delay: this.playerData.timeUntilReviving,
				callback: ()=>
				{
					this.revivePlayer();
				},
				loop: false
			});
	}

	revivePlayer()
	{
		this.currentHealth = this.playerData.health;
		this.healthBar.setValue(this.currentHealth);
		this.playerGraphics.visible = true;
		this.playerGraphics.body.enable = true;
		this.isDead = false;
	}
}