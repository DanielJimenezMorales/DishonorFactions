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
		
		this.healthText;

		this.isMovingRight = false;
		this.isMovingLeft = false;
		this.isMovingUp = false;
		this.isMovingDown = false;

		this.isHorizontallyMoving = false;
		this.isVerticallyMoving = false;
		this.facingDirection; //TRUE = LEFT, FALSE = RIGHT
		this.shootingRateTimer = 0;
		this.canShoot = true;
		this.projectilesGroup;
		this.isShooting = false;
		this.socketIsShooting = false;

		this.isDead = false;
		this.deadTimer;

		this.attackSounds;
	}

	getPlayerGraphics()
	{
		return this.playerGraphics;
	}

	getSocketIsShooting()
	{
		return this.socketIsShooting;
	}

	setPosition(x,  y) //for websocket
	{ 
		this.playerGraphics.x = x;
		this.playerGraphics.y = y;
	}

	getFacingDirection()
	{
		return this.facingDirection;
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
		
		this.healthText = this.scene.add.text(this.healthBarPositionX-20, this.healthBarPositionY, this.currentHealth, {fontSize: 20, strokeThickness: 2}).setOrigin(0,0);
		
		

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
			if(this.scene.registry.get("gameMode") == "Offline" || this.playerSide == "left")
			{				
				this.handleInputs();				
				this.updateMovementAndShootingOnly();
			}

			this.updateAnimations();
			this.updateHealthBarPosition();
		}
	}

	handleInputs()
	{
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isMovingDown = false;
		this.isMovingUp = false;
		this.isShooting = false;

		if(this.isUsingKeys)
		{
			if(this.shootingKey.F.isDown)
			{
				this.isShooting = true;
			}

			if (this.keyLeft.A.isDown)
	        {
	            this.isMovingLeft = true;
	        }

	        else if (this.keyRight.D.isDown)
	        {
	            this.isMovingRight = true;
	        }

	        if (this.keyUp.W.isDown)
	        {
	            this.isMovingUp = true;
	        }

	        else if (this.keyDown.S.isDown)
	        {
	            this.isMovingDown = true;
	        }
	    }
	    else
	    {
	    	if(this.shootingKey.L.isDown)
			{
				this.isShooting = true;
			}

	    	if (this.cursors.left.isDown)
	        {
	            this.isMovingLeft = true;
	        }

	        else if (this.cursors.right.isDown)
	        {
	            this.isMovingRight = true;
	        }

	        if (this.cursors.up.isDown)
	        {
	            this.isMovingUp = true;
	        }

	        else if (this.cursors.down.isDown)
	        {
	            this.isMovingDown = true;
	        }
	    }
	}

	handleOnlineInputs(data)
	{
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isMovingDown = false;
		this.isMovingUp = false;
		this.isShooting = false;

		if((this.scene.cameras.main.width - data.x) < this.playerGraphics.x)
		{
			this.isMovingLeft = true;
		}
		else if((this.scene.cameras.main.width - data.x) > this.playerGraphics.x)
		{
			this.isMovingRight = true;
		}

		if(data.y < this.playerGraphics.y)
		{
			this.isMovingUp = true;
		}
		else if(data.y > this.playerGraphics.y)
		{
			this.isMovingDown = true;
		}

		this.setPosition(this.scene.cameras.main.width - data.x, data.y);
		this.setFacingDirection(!data.facingDirection);

		if(data.isAttacking)
		{
			this.isShooting = true;
			this.shootProjectile();
		}
	}

	updateMovementAndShootingOnly()
	{
		this.isHorizontallyMoving = false;
		this.isVerticallyMoving = false;
		this.socketIsShooting = false;

		if(this.isShooting)
		{

			console.log("disparo");
			if(this.canShoot)
			{
				this.canShoot = false;
				this.shootProjectile();
				this.resetShootingTimer();
				this.socketIsShooting = true;
			}
		}

		if (this.isMovingLeft)
        {
            this.playerGraphics.setVelocityX(-this.playerData.movementSpeed.x);
            this.isHorizontallyMoving = true;
            this.facingDirection = true;
        }

        else if (this.isMovingRight)
        {
            this.playerGraphics.setVelocityX(this.playerData.movementSpeed.x);
            this.isHorizontallyMoving = true;
            this.facingDirection = false;
        }

        else
        {	        	
            this.playerGraphics.setVelocityX(0);
        }

        if (this.isMovingUp)
        {
            this.playerGraphics.setVelocityY(-this.playerData.movementSpeed.y);

            this.isVerticallyMoving = true;
        }

        else if (this.isMovingDown)
        {
            this.playerGraphics.setVelocityY(this.playerData.movementSpeed.y);

            this.isVerticallyMoving = true;
        }
        else
        {
        	this.playerGraphics.setVelocityY(0);
        }
        /*
	    if(this.playerSide == "left" && this.scene.registry.get("gameMode") == "Online")
	    {
	    	var playerData = {"type" : "position",
			"x" : this.playerGraphics.x,
			"y" : this.playerGraphics.y,
			"isAttacking" : socketIsShooting,
			"facingDirection": this.facingDirection,
			};

			this.gameWebSocket.send(JSON.stringify(playerData));	
	    }*/
		
	}

	updateAnimations()
	{
		this.isHorizontallyMoving = false;
		this.isVerticallyMoving = false;

		if (this.isMovingLeft)
        {
            this.playerGraphics.anims.play(this.playerData.spriteID + 'left', true);
            this.isHorizontallyMoving = true;
            this.facingDirection = true;
        }

        else if (this.isMovingRight)
        {
            this.playerGraphics.anims.play(this.playerData.spriteID + 'right', true);
            this.isHorizontallyMoving = true;
            this.facingDirection = false;
        }

        if (this.isMovingUp || this.isMovingDown)
        {
            if(!this.isHorizontallyMoving)
            {
            	if(this.playerSide == "left")
            	{
            		this.playerGraphics.anims.play(this.playerData.spriteID + 'right', true);
            	}
            	else if(this.playerSide == "right")
            	{
            		this.playerGraphics.anims.play(this.playerData.spriteID + 'left', true);
            	}
            }
            this.isVerticallyMoving = true;
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

	updateHealthBarPosition()
	{
		this.calculateHealthBarPosition();
	    this.healthBar.setPosition(this.healthBarPositionX, this.healthBarPositionY);
	    this.healthText.setPosition(this.healthBarPositionX-20,this.healthBarPositionY);
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
		this.currentHealth -= damage+1;
	this.healthText.setText(this.currentHealth);
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
		this.healthText.visible = false;
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
		this.healthText.setText(this.currentHealth);
		this.playerGraphics.visible = true;
		this.playerGraphics.body.enable = true;
		this.isDead = false;
		this.healthText.visible = true;
	}
}
