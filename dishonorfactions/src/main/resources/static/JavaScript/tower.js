import { HealthBar } from './healthBar.js';

export class Tower
{
	constructor(initialLife, gameScene, x, y, healthBarDisplacementX, healthBarDisplacementY, textDisplacementX, textDisplacementY, name)
	{
		this.scene = gameScene;
		this.lifePoints = initialLife;
		this.positionX = x;
		this.positionY = y;
		this.healthBarPositionX = this.positionX - healthBarDisplacementX;
		this.healthBarPositionY = this.positionY - healthBarDisplacementY;
		this.healthBar = new HealthBar(this.scene, this.lifePoints, this.healthBarPositionX, this.healthBarPositionY);
		this.textPositionX = this.positionX - textDisplacementX;
		this.textPositionY = this.positionY - textDisplacementY;
		this.lifeTextGraphics;
		this.spriteName = name;
		this.towerGraphics;
		this.damageParticle;
		this.damageSound;
	}

	getTowerGraphics()
	{
		return this.towerGraphics;
	}

	getHealth()
	{
		return this.lifePoints;
	}

	createAnimations()
	{
		this.scene.anims.create({
            key: 'fullHealth' + this.spriteName,
            frames: [ { key: this.spriteName, frame: 0 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'upperHealth' + this.spriteName,
            frames: [ { key: this.spriteName, frame: 1 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'middleHealth' + this.spriteName,
            frames: [ { key: this.spriteName, frame: 2 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'almostDestroyedHealth' + this.spriteName,
            frames: [ { key: this.spriteName, frame: 3 } ],
            frameRate: 20
        });
	}

	createSmokeParticles()
	{
		this.damageParticle = this.scene.add.particles('explosion');
		this.damageParticle.createEmitter(
			{
				frame: [ 'smoke-puff', 'cloud', 'smoke-puff' ],
				angle: { min: 200, max: 300 },
        		speed: { min: 250, max: 350 },
        		quantity: 6,
        		lifespan: 2400,
        		alpha: { start: 1, end: 0 },
        		scale: { start: 1.5, end: 0.5 },
        		on: false
			});
	}

	create()
	{
		this.towerGraphics = this.scene.physics.add.staticGroup();
		this.towerGraphics.create(this.positionX, this.positionY, this.spriteName);

		//Initialize Animations
		this.createAnimations();
		this.handleAnimations();

		//Initialize HealthBar
		this.healthBar.create();

		//Initialize Health text
		this.lifeTextGraphics = this.scene.add.text(this.textPositionX, this.textPositionY, this.lifePoints, {fontSize: 25, strokeThickness: 2});
		
		//Initialize Particle effects
		this.createSmokeParticles();

		this.damageSound = this.scene.sound.add('towerDamageMusic');
		
	}

	flipTowerSprite()
	{
		this.healthBar.flipHealthBarSprite();
	}

	getCurrentLife()
	{
		return this.lifePoints;
	}

	handleAnimations()
	{
		if(this.lifePoints > 80)
		{
			this.towerGraphics.playAnimation('fullHealth' + this.spriteName);
		}
		else if(this.lifePoints > 40)
		{
			this.towerGraphics.playAnimation('upperHealth' + this.spriteName);
		}
		else if(this.lifePoints > 20)
		{
			this.towerGraphics.playAnimation('middleHealth' + this.spriteName);
		}
		else
		{
			this.towerGraphics.playAnimation('almostDestroyedHealth' + this.spriteName);
		}
	}

	damageTower(damagePoints)
	{
		this.lifePoints -= damagePoints;

		if(this.lifePoints < 0)
		{
			this.lifePoints = 0;
		}

		this.updateHealthBar(this.lifePoints);
		this.updateLifeText(this.lifePoints);

		this.handleAnimations();
		this.emitDamageParticles();
		this.applyCameraShake();

		this.damageSound.play();
	}

	applyCameraShake()
	{		
		this.scene.cameras.main.shake(200, 0.005);
	}

	updateHealthBar(newValue)
	{
		this.healthBar.setValue(newValue);
	}

	updateLifeText(newValue)
	{
		this.lifeTextGraphics.setText(newValue);
	}

	emitDamageParticles()
	{
		this.damageParticle.emitParticleAt(this.positionX, this.positionY);
	}
}