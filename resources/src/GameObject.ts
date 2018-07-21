/// <reference path="./lib.d.ts/pixi.d.ts" />
import { createAnimatedSprite, createSprite } from './utils/easy-pixi';

export class GameObject {
	public container: PIXI.Container;
	public sprite: PIXI.Sprite | PIXI.extras.AnimatedSprite;
	public states: Object = {};

	protected _curruntState: string = '';

	constructor() {
		this.container = new PIXI.Container();
	}

	get state(): string {
		return this._curruntState;
	}

	set state(value: string) {
		let state = this.states[value];
		if (!state) {
			console.warn(`Char (set state): state "${value}" is undefined.`);
			return;
		}

		this.sprite.visible = false;

		state.visible = true;
		this.sprite = state;
		this._curruntState = value;
	}

	public addState(name: string, texture: string, isAnimated: boolean = false): void {
		let sprite: PIXI.Sprite | PIXI.extras.AnimatedSprite;

		if (isAnimated) {
			sprite = createAnimatedSprite(texture);
		} else {
			sprite = createSprite(texture);
		}

		this.container.addChild(sprite);

		if (!sprite) {
			this.sprite = sprite;
			this._curruntState = name;
			sprite.visible = true;
		} else {
			sprite.visible = false;
		}

		this.states[name] = sprite;
	}

	public removeState(name: string): void {
		let sprite = this.states[name];
		if (!sprite) {
			console.warn(`Char (set state): state "${name}" is undefined.`);
			return;
		}

		if (this._curruntState == name) {
			this._curruntState = null
			this.sprite = null;
		}

		this.container.removeChild(sprite);

		delete this.states[name];
	}
}
