export class Seleccion extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'seleccion' });
		this.backgroundMusic;
		this.preGameConfiguration;
		this.clicksCounter = 0;
		this.orcButton;
		this.orcButtonShadow;
		this.humanButton;
		this.humanButtonShadow;
		this.elfButton;
		this.elfButtonShadow;
		this.dataBetweenScenes;
		this.gameWebSocket;
		this.isPlayerReady = false;
		this.isOpponentReady = false;
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
		this.gameWebSocket = this.registry.get("webSocket");
		this.gameWebSocket.onmessage = (msg)=>
		{
			if(msg.data == "elfChampionData" || msg.data == "orcChampionData" || msg.data == "humanChampionData")
			{
				console.log(msg);
				this.preGameConfiguration.rightPlayer = msg;
				this.isOpponentReady = true;
			}
		}

		this.gameWebSocket.onerror = (e)=>
		{
			console.log("Ha dado un error");
		}

		this.gameWebSocket.onclose = ()=>
		{
			console.log("Te has desconectado");
		}

		this.backgroundMusic = this.sound.add('selectionBackgroundMusic');
		this.backgroundMusic.play();
		this.add.image(0, 0, 'pantalla').setOrigin(0, 0);

		this.elfButtonShadow = this.add.image(260, 640, 'boton');
		this.elfButtonShadow.tint = 0x000000;
		this.elfButtonShadow.alpha = 0.5;
		this.elfButtonShadow.visible = false;

		this.orcButtonShadow = this.add.image(660, 640, 'boton');
		this.orcButtonShadow.tint = 0x000000;
		this.orcButtonShadow.alpha = 0.5;
		this.orcButtonShadow.visible = false;

		this.humanButtonShadow = this.add.image(1060, 640, 'boton');
		this.humanButtonShadow.tint = 0x000000;
		this.humanButtonShadow.alpha = 0.5;
		this.humanButtonShadow.visible = false;

		this.elfButton = this.add.image(250,630,'boton');
		this.orcButton = this.add.image(650,630,'boton2');
		this.humanButton = this.add.image(1050,630,'boton3');

		this.preGameConfiguration = this.cache.json.get('gameConfiguration');
		this.preGameConfiguration.username = this.dataBetweenScenes.username;

		this.elfButton.setInteractive();
		this.elfButton.on('pointerup', () => this.clickConfiguration('elfChampionData'));
		this.elfButton.on('pointerover', () => this.enableButtonShadow(this.elfButtonShadow));
		this.elfButton.on('pointerout', () => this.disableButtonShadow(this.elfButtonShadow));
		this.orcButton.setInteractive();
		this.orcButton.on('pointerup', () => this.clickConfiguration('orcChampionData'));
		this.orcButton.on('pointerover', () => this.enableButtonShadow(this.orcButtonShadow));		
		this.orcButton.on('pointerout', () => this.disableButtonShadow(this.orcButtonShadow));
		this.humanButton.setInteractive();
		this.humanButton.on('pointerup', () => this.clickConfiguration('humanChampionData'));
		this.humanButton.on('pointerover', () => this.enableButtonShadow(this.humanButtonShadow));		
		this.humanButton.on('pointerout', () => this.disableButtonShadow(this.humanButtonShadow));
	}

	clickConfiguration(playerSelection)
	{
		//Incrementar contador
		this.clicksCounter++;

		if(this.dataBetweenScenes.gameMode == "Offline")
		{
			//Guardar la seleccion en la variable
			if(this.clicksCounter == 1)
			{
				this.preGameConfiguration.leftPlayer = playerSelection;
			}
			else if(this.clicksCounter == 2)
			{
				this.preGameConfiguration.rightPlayer = playerSelection;
			}

			//Comprobar si ya todos los jugadores han elegido counter = 2
			if(this.clicksCounter == 2)
			{
				this.backgroundMusic.stop();
				this.scene.start('game', this.preGameConfiguration);
			}
		}
		else if(this.dataBetweenScenes.gameMode == "Online")
		{
			//Comprobar si ya el jugador ha elegido counter = 1
			if(this.clicksCounter == 1)
			{
				this.backgroundMusic.stop();
				
				this.gameWebSocket.send(playerSelection);
				this.isPlayerReady = true;
				this.preGameConfiguration.leftPlayer = playerSelection;
			}
		}
		else
		{
			console.log("nada");
		}

	}

	update()
	{
		if(this.isPlayerReady && this.isOpponentReady)
		{
			this.scene.start('game', this.preGameConfiguration);
		}

		if(this.isPlayerReady && !this.isOpponentReady)
		{
			console.log("Esperando al oponente");
		}			
	}

	enableButtonShadow(buttonShadow)
	{
		buttonShadow.visible = true;
	}

	disableButtonShadow(buttonShadow)
	{
		buttonShadow.visible = false;
	}
}