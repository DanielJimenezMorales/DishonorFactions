export class SearchingLobbyScene extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'searchingLobby' });
		this.dataBetweenScenes;
		this.gameSocket;
	}

	init(data)
	{
		this.dataBetweenScenes = data;
	}

	create()
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

	switchToSelectionScene(currentScene)
	{
		currentScene.scene.start('seleccion', this.dataBetweenScenes);
	}


}