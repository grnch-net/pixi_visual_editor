/// <reference path="../lib.d.ts/pixi.d.ts" />

export function loadTexture(link: string) {
	return PIXI.utils.TextureCache[link];
}

export function createSprite(link: string) {
	let sprite = new PIXI.Sprite(loadTexture(link));
	sprite.name = link;
	return sprite;
}

export function createAnimatedSprite(link: string, startIndex: number = 1): PIXI.extras.AnimatedSprite {
	let frames: PIXI.Texture[] = [];
	let frame: PIXI.Texture;
	let frameIndex: number = startIndex;
	do {
		frame = loadTexture(link+frameIndex+'.png');
		if (frame) frames.push(frame);

		frameIndex++;
	} while(frame !== undefined)

	if (frames.length == 0) {
		console.warn(`createAnimatedSprite: "${link}" is undefined.`);
		return;
	}

	let animatedSprite: PIXI.extras.AnimatedSprite = new PIXI.extras.AnimatedSprite(frames);
	animatedSprite.name = link;
	animatedSprite.animationSpeed = 15/60;
	return animatedSprite;
}

export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
