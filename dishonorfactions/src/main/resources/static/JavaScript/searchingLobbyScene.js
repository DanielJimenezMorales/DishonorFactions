import {LoadingAnimation} from './loadingAnimation.js';

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
	}

	init(data)
	{
		this.dataBetweenScenes = data;
	}

	createWebSocket()
	{
		this.gameSocket = new WebSocket('ws://127.0.0.1:8080/gameWebSocket');

		this.gameSocket.onopen = () =>
		{
	  		this.gameSocket.send('Estableciendo conexion');
	  		console.log("Intentando establecer conexión");
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
		}
		this.registry.set("webSocket", this.gameSocket);
	}

	create()
	{
		this.createWebSocket();
		this.background = this.add.image(0, 0, 'searchingLobbyBackground').setOrigin(0, 0);
		this.titleText = this.add.text(this.cameras.main.width / 2, 100, "Searching for a match...", {fontSize: 50, strokeThickness: 1.5}).setOrigin(0.5, 0.5);
		this.loadingEffect = new LoadingAnimation(this.cameras.main.width / 2, (this.cameras.main.height / 2) - 50, 70, this, 50);
	}

	switchToSelectionScene(currentScene)
	{
		currentScene.scene.start('seleccion', this.dataBetweenScenes);
	}
}