export class Controls extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'controls' });
		this.goBackButton;
		this.goObjectiveButton;
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
		
		
		this.objetivos=this.add.image(0, 0, 'objetivos').setOrigin(0, 0);
		this.objetivos.visible=false;
		
		this.goBackButton = this.add.image(200,650,'goBackButton');
		this.goBackButton.setInteractive();
		
		this.goObjectiveButton = this.add.image(1000,650,'goObjectiveButton');
		this.goObjectiveButton.setInteractive();
		
		this.goBackButton.on('pointerup', () => this.switchBackToMenuScene(this));
		this.goObjectiveButton.on('pointerup', () => this.switchToObjectives());
	}

	switchBackToMenuScene(currentScene)
	{
		currentScene.scene.start('menu', this.dataBetweenScenes);
	}
	switchToObjectives(){
		this.objetivos.visible = !this.objetivos.visible;
	}
	
}