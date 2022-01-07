export class SearchingLobbyScene extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'searchingLobby' });
		this.gameSocket;
	}

	create()
	{
		this.gameSocket = new WebSocket('ws://127.0.0.1:8080/gameWebSocket');

		this.gameSocket.onopen = () =>
		{
	  		this.gameSocket.send('Estableciendo conexion');
	  		console.log("Intentando establecer conexión");
		}

		this.gameSocket.onmessage = function(msg)
		{
			console.log("WS mensaje recibido: " + msg.data);
		}

		this.gameSocket.onerror = function(e)
		{
			console.log("WS error: " + e);
		}

		this.gameSocket.onclose = function()
		{
			console.log("WS Conexión cerrada");
		}
	}


}