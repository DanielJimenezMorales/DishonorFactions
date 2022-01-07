export class LoadingAnimation
{

	constructor(x, y, speed, scene, radius)
	{
		this.scene = scene;
		this.radius = radius;
		this.positionX = x;
		this.positionY = y;
		this.animationSpeed = speed;
		this.createLoadingAnimation();
	}

	createLoadingAnimation()
	{
		// store the bars in a list for later
		const bars = []
		const height = this.radius * 0.5;
		const width = 10;

		// start at top
		let angle = -90;

		// create 12 bars each rotated and offset from the center
		for (let i = 0; i < 12; ++i)
		{
			const { x, y } = Phaser.Math.RotateAround({ x: this.positionX, y: this.positionY - (this.radius - (height * 0.5)) },
			 this.positionX, this.positionY, Phaser.Math.DEG_TO_RAD * angle);

			// create each bar with position, rotation, and alpha
			const bar = this.scene.add.rectangle(x, y, width, height, 0xffffff, 1)
				.setAngle(angle)
				.setAlpha(0.2);

			bars.push(bar);

			// increment by 30 degrees for next bar
			angle += 30;
		}

		let index = 0;

		// save created tweens for reuse
		const tweens = [];

		// create a looping TimerEvent
		this.scene.time.addEvent(
		{
			delay: this.animationSpeed,
			loop: true,
			callback: () => 
			{
				// if we already have a tween then reuse it
				if (index < tweens.length)
				{
					const tween = tweens[index];
					tween.restart();
				}
				else
				{
					// make a new tween for the current bar
					const bar = bars[index];
					const tween = this.scene.tweens.add(
					{
						targets: bar,
						alpha: 0.4,
						duration: 400,
						onStart: () =>
						{
							bar.alpha = 1;
						}
					});

					tweens.push(tween);
				}

				// increment and wrap around
				++index;

				if (index >= bars.length)
				{
					index = 0;
				}
			}
		});
	}
}