import { NPC } from './nPC.js';

export class EnemySpawner
{
	constructor(rate, x, y, champion, gameScene, rowDisp, spawnDir, group, speed, side)
	{
		this.scene = gameScene;
		this.side = side;
		this.nPCSpeed = speed;
		this.spawningRate = rate * 2000;
		this.spawningPositionX = x;
		this.championType = this.scene.cache.json.get(champion);
		this.enemySpriteName;
		this.timer;
		this.posibleSpawnPositionY = [y - rowDisp, y, y + rowDisp];
		this.spawningDirection = spawnDir;
		this.nPCGroup = group;
		this.movementAnimationKey;
		this.randomIndex;
		this.isSpawning = true;
	}

	getRandomIndex()
	{
		return this.randomIndex;
	}

	getIsSpawning()
	{
		return this.isSpawning;
	}

	createAnimations()
	{
		var start;
		var end;
		if(this.spawningDirection > 0)
		{
			this.movementAnimationKey = 'leftMovement';
			start = 0;
			end = 5;
		}
		else if(this.spawningDirection < 0)
		{
			this.movementAnimationKey = 'rightMovement';
			start = 10;
			end = 13;
		}

		this.scene.anims.create(
			{
				key: this.movementAnimationKey,
				frames: this.scene.anims.generateFrameNumbers(this.enemySpriteName, { start, end }),
				frameRate: 10,
				repeat: -1
			});
	}

	create()
	{
		this.configureSprites();
		this.createAnimations();
	}

	configureSprites()
	{
		if(this.championType.spriteID == 'humanChampion')
		{
			this.enemySpriteName = 'humanNPC';
		}
		else if(this.championType.spriteID == 'orcChampion')
		{
			this.enemySpriteName = 'orcNPC';
		}
		else if(this.championType.spriteID == 'elfChampion')
		{
			this.enemySpriteName = 'elfNPC';
		}
		else
		{
			console.log("Not valid enemy");
		}
	}

	update()
	{
		this.isSpawning = false;
	}

	startSpawning()
	{
		this.timer = this.scene.time.addEvent(
			{
				delay: this.spawningRate,
				callback: ()=> this.spawnAnEnemy(this.scene, this.enemySpriteName, this.spawningPositionX, this.posibleSpawnPositionY, this.spawningDirection, this.nPCGroup, this.nPCSpeed, this.movementAnimationKey),
				loop: true,
				startAt: 0,
				timeScale: 1
			});
	}

	spawnAnEnemy(gameScene, enemyName, spawnPositionX, spawnPositionY, dir, group, speed, movementAnimationName)
	{
		this.isSpawning = true;
		this.randomIndex = Phaser.Math.Between(0, 2);

		var nPC = gameScene.physics.add.sprite(spawnPositionX, spawnPositionY[this.randomIndex], enemyName);

		nPC.anims.play(movementAnimationName, true);
		group.add(nPC);
		nPC.setVelocityX(dir * speed);
	}

	checkIfOnlineIsSpawning(isSpawning, randomRow)
	{
		if(!isSpawning) return;

		this.spawnEnemy(this.scene, this.enemySpriteName, this.spawningPositionX, this.posibleSpawnPositionY, this.spawningDirection, this.nPCGroup, this.nPCSpeed, this.movementAnimationKey, randomRow)
	}

	spawnEnemy(gameScene, enemyName, spawnPositionX, spawnPositionY, dir, group, speed, movementAnimationName, randomRow)
	{
		var nPC = gameScene.physics.add.sprite(spawnPositionX, spawnPositionY[randomRow], enemyName);

		nPC.anims.play(movementAnimationName, true);
		group.add(nPC);
		nPC.setVelocityX(dir * speed);
	}

	stopSpawning()
	{
		this.timer.remove();
	}
}