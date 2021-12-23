export class Preload extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'preload' });
	}

	loadResources()
	{
		//HTML Resources
		this.load.html('usernameInputField', './HTML/usernameInputField.html');

		//Background		
		this.load.image('background', './Art/fondo3.png');
		this.load.image('menu', './Art/menu.png');
		this.load.image('creditsBackground', './Art/creditsScreen.png');
		this.load.image('pauseBackground','./Art/menuPausa.png');
		this.load.image('controlsBackground','./Art/controls.png');
		this.load.image('loginBackground', './Art/loginBackground.png');

		//Particle effects
		this.load.atlas('explosion', './Art/Particles/explosion.png', './Art/Particles/explosion.json');

		//Towers
		this.load.spritesheet('leftTower', './Art/leftTower.png', { frameWidth: 150, frameHeight: 550 });
		this.load.spritesheet('rightTower', './Art/rightTower.png', { frameWidth: 150, frameHeight: 550 });
		this.load.image('healthBar', './Art/healthBar.png');

		//Players
		this.load.spritesheet('humanChampion', './Art/Champions/humanChampion.png', { frameWidth: 70, frameHeight: 100 });
		this.load.spritesheet('orcChampion', './Art/Champions/orcChampion.png', { frameWidth: 70, frameHeight: 100 });
		this.load.spritesheet('elfChampion', './Art/Champions/elfChampion.png', { frameWidth: 70, frameHeight: 100 });
		
		//JSON
		this.load.json('humanChampionData', './JavaScript/JSON/humanChampionData.json');
		this.load.json('orcChampionData', './JavaScript/JSON/orcChampionData.json');
		this.load.json('elfChampionData', './JavaScript/JSON/elfChampionData.json');
		this.load.json('gameConfiguration', './JavaScript/JSON/gameConfiguration.json');
		this.load.json('endOfTheGameConfiguration', './JavaScript/JSON/endOfTheGameConfigurations.json');

		//Queen
		this.load.spritesheet('queen', './Art/queenElizabeth.png', {frameWidth: 140, frameHeight: 200});
		this.load.spritesheet('queensPet', './Art/queensPet.png', {frameWidth: 70, frameHeight: 100});

		//NPC
		this.load.spritesheet('orcNPC', './Art/Minions/minionOrco.png', { frameWidth: 60, frameHeight: 80 });
		this.load.spritesheet('elfNPC', './Art/Minions/minionElfo.png', { frameWidth: 60, frameHeight: 80 });
		this.load.spritesheet('humanNPC', './Art/Minions/minionHumano.png', { frameWidth: 60, frameHeight: 80 });
		
		//Projectile
		this.load.image('orcProjectile', './Art/orcProjectile.png');
		this.load.image('elfProjectile', './Art/elfProjectile.png');
		this.load.image('humanProjectile', './Art/humanProjectile.png');

		this.load.image('pantalla', './Art/pantallaPersonajes.png');
        this.load.image('boton', './Art/botonSeleccionarPersonaje.png');
		this.load.image('boton2', './Art/botonSeleccionarPersonaje.png');
		this.load.image('boton3', './Art/botonSeleccionarPersonaje.png');
	
		//UI
		this.load.image('defeatText', './Art/derrota.png');
		this.load.image('victoryText', './Art/victoria.png');
		this.load.image('goBackButton', './Art/goBackButton.png');
		this.load.image('botonJugar', './Art/botonJugar.png');
		this.load.image('botonPersonajes', './Art/botonPersonajes.png');
		this.load.image('botonCreditos', './Art/botonCreditos.png');
		this.load.image('botonSalir', './Art/botonSalir.png');
		this.load.image('humanVictoryScreen', './Art/humanVictoryScreen.png');
		this.load.image('elfVictoryScreen', './Art/elfVictoryScreen.png');
		this.load.image('orcVictoryScreen', './Art/orcVictoryScreen.png');
		this.load.image('botonControles','./Art/botonControles.png');
		this.load.image('button', './Art/button.png');
	}

	loadAudios()
	{
		//Music in game
		this.load.audio('gameBackgroundMusic', './Sounds/play.mp3');
		this.load.audio('menuBackgroundMusic', './Sounds/MainMenu.wav');
		this.load.audio('towerDamageMusic', './Sounds/actions/destroy.mp3');
		this.load.audio('selectionBackgroundMusic', './Sounds/characterSelection.wav');
		this.load.audio('tictacMusic' , './Sounds/actions/tic_tac_1.mp3');
		this.load.audio('attackSound' , './Sounds/actions/throw_sword.mp3');
	}

	preload()
	{
		var width = this.cameras.main.width;
		var height = this.cameras.main.height;

		var progressBar = this.add.graphics();
		var progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(400, 320, 470, 50);
		this.load.on('progress', function (value) {
		    progressBar.clear();
		    progressBar.fillStyle(0xffffff, 1);
		    progressBar.fillRect(410, 330, 450 * value, 30);
		});
        
        var loadingText = this.make.text({
		    x: width / 2,
		    y: height / 2 - 100,
		    text: 'LOADING...',
		    style: {
		        font: '60px monospace',
		        fill: '#ffffff'
		    }
		});
		loadingText.setOrigin(0.5, 0.5);

		var complete = function()
		{
			progressBar.destroy();
			progressBox.destroy();
			loadingText.destroy();

			this.scene.start('username');
		}

		this.load.on('complete', complete, {scene: this.scene});

		this.loadResources();
		this.loadAudios();
	}
}