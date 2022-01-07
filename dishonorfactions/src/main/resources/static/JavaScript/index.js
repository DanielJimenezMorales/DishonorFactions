import { Game } from './game.js';
import { Menu } from './menu.js';
import { UsernameScene } from './usernameScreen.js';
import { Preload } from './preloadScene.js';
import { Seleccion } from './seleccion.js';
import { Credits } from './credits.js';
import { EndOfTheGameScene } from './endOfTheGameScene.js';
import { Controls} from './controlsScene.js';
import {Pause} from './pause.js';
import {SearchingLobbyScene} from './searchingLobbyScene.js';

const config = 
{
	type: Phaser.AUTO,
	scale:
	{
		parent: 'gameScreen',
		mode: Phaser.Scale.RESIZE,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		min:
		{
			width: 850,
			height: 480
		},
		max:
		{
			width: 1280,
			height: 720
		}
	},
	dom:
	{
        createContainer: true
    },
	scene: [Preload, UsernameScene, Controls, Menu, Credits, Seleccion, SearchingLobbyScene, Game, EndOfTheGameScene, Pause],
	physics: 
	{
		default: 'arcade',
		arcade:
		{
			gravity:
			{
				y: 0
			},
			debug: false
		}
	}
	
}

$(document).ready(function()
{
	var game = new Phaser.Game(config);
});