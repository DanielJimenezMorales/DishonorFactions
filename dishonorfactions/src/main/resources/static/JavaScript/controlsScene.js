export class Controls extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'controls' });
		this.goBackButton;
		this.dataBetweenScenes;
	}

	init(data)
	{
		this.dataBetweenScenes = data;
	}

	create()
	{
		if(this.registry.get("gameMode") == "Offline")
		{
			this.add.image(0, 0, 'offlineControlsBackground').setOrigin(0, 0);
		}
		else if (this.registry.get("gameMode") == "Online")
		{
			this.add.image(0, 0, 'onlineControlsBackground').setOrigin(0, 0);
		}

		this.goBackButton = this.add.image(200,650,'goBackButton');
		this.goBackButton.setInteractive();
		this.goBackButton.on('pointerup', () => this.switchBackToMenuScene(this));
	}

	switchBackToMenuScene(currentScene)
	{
		currentScene.scene.start('menu', this.dataBetweenScenes);
	}
}