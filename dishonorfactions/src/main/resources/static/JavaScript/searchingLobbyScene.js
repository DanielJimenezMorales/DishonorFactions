import {LoadingAnimation} from './loadingAnimation.js';
import {Button} from './button.js';

export class SearchingLobbyScene extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'searchingLobby' });
		this.dataBetweenScenes;
		this.gameSocket;
		this.background;
		this.titleText;
		this.loadingEffect;
		this.goBackToMenuButton;
	}

	init(data)
	{
		this.dataBetweenScenes = data;
	}

	createWebSocket()
	{
		this.gameSocket = new WebSocket('ws://' + this.registry.get("serverIP") + '/gameWebSocket');

		this.gameSocket.onopen = () =>
		{
	  		this.gameSocket.send('Estableciendo conexion');
	  		console.log("Intentando establecer conexión");

			this.registry.set("webSocket", this.gameSocket);
		}

		this.gameSocket.onmessage = (msg) =>
		{
			console.log("WS mensaje recibido: " + msg.data);

			if(msg.data == "PartidaEncontrada")
			{
				this.switchToSelectionScene(this);
			}
		}

		this.gameSocket.onerror = (e) =>
		{
			console.log("WS error: " + e);
		}

		this.gameSocket.onclose = () =>
		{
			console.log("WS Conexión cerrada");
			this.registry.remove("webSocket");
		}
	}

	create()
	{
		this.createWebSocket();
		this.background = this.add.image(0, 0, 'searchingLobbyBackground').setOrigin(0, 0);
		this.titleText = this.add.text(this.cameras.main.width / 2, 100, "Searching for a match...", {fontSize: 50, strokeThickness: 1.5}).setOrigin(0.5, 0.5);
		this.loadingEffect = new LoadingAnimation(this.cameras.main.width / 2, (this.cameras.main.height / 2) - 50, 70, this, 50);
		this.goBackToMenuButton = new Button(this.cameras.main.width / 2, this.cameras.main.height - 70,
			'Back to menu', 'button', 0.8, 0.7, 35, 15, this, () => {this.switchToMainMenuScene(this);});
	}

	switchToMainMenuScene(currentScene)
	{
		this.gameSocket.close();
		currentScene.scene.start('menu', this.dataBetweenScenes);
	}

	switchToSelectionScene(currentScene)
	{
		currentScene.scene.start('seleccion', this.dataBetweenScenes);
	}
}