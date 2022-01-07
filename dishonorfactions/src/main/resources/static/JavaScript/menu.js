import { Button } from './button.js';

export class Menu extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'menu' });
		this.playButton;
		this.playOnlineButton;
		this.playButtonShadow;
		this.creditsButton;
		this.creditsButtonShadow;
		this.backgroundMusic;
		this.settingsButton;
		this.controlsButton;
		this.exitButton;
		this.dataBetweenScenes;
	}
	
	//////////////////////////////////////////////////////////////////
	//AQUÍ NO HACER PRELOAD, HACERLO EN EL ARCHIVO PRELOADSCENE.JS!!!!
	//////////////////////////////////////////////////////////////////

	init(data)
	{
		this.dataBetweenScenes = data;
	}

	create()
	{		
		//añadir imagenes a la escena
		this.add.image(0, 0, 'menu').setOrigin(0, 0);

		this.playButton = new Button(this.cameras.main.width / 2, this.cameras.main.height / 2 - 110,
	    	'Play', 'button', 0.8, 1, 60, 15, this, () => {this.switchToSelectionScene(this);});

		this.playOnlineButton = new Button(this.cameras.main.width / 2 + 400, this.cameras.main.height / 2 - 110,
	    	'Play online', 'button', 0.8, 1, 60, 15, this, () => {this.switchToSearchingLobbyScene(this);});

		this.creditsButton = new Button(this.cameras.main.width / 2, this.cameras.main.height / 2,
			'Credits', 'button', 0.8, 1, 60, 15, this, () => {this.switchToCreditsScene(this);});

		this.controlsButton = new Button(this.cameras.main.width / 2, this.cameras.main.height / 2 + 110,
			'Controls', 'button', 0.8, 1, 60, 15, this, () => {this.switchToControlsScene(this);});

		this.exitButton = new Button(this.cameras.main.width / 2, this.cameras.main.height / 2 + 220,
			'Exit', 'button', 0.8, 1, 60, 15, this, () =>
			{
				this.sendDisconnectUserPetition();
				this.switchToLoginScreen();
			});


		this.backgroundMusic = this.sound.add('menuBackgroundMusic');
		this.backgroundMusic.play();
	}

	switchToCreditsScene(currentScene)
	{
		currentScene.backgroundMusic.stop();
		currentScene.scene.start('credits');
	}

	switchToSelectionScene(currentScene)
	{
		currentScene.backgroundMusic.stop();
		currentScene.scene.start('seleccion', this.dataBetweenScenes);
	}

	switchToControlsScene(currentScene)
	{
		currentScene.backgroundMusic.stop();
		currentScene.scene.start('controls');
	}

	switchToSearchingLobbyScene(currentScene)
	{
		currentScene.backgroundMusic.stop();
		currentScene.scene.start('searchingLobby', this.dataBetweenScenes);
	}

	switchToLoginScreen()
	{
		this.scene.start('username');
	}

	sendDisconnectUserPetition()
	{
		$.ajax(
        {
            type: "DELETE",
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            url: "/username/disconnect/" + this.dataBetweenScenes.username,
            dataType: "json"
        }).done((data)=>
        {

        }).fail((data) =>
        {

        });
	}
}