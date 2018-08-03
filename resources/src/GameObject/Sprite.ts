/// <reference path="./AbstractObject.ts" />

module GameObject {

	let BM = PIXI.BLEND_MODES;
	export enum EBlendMode {
		"NORMAL"		= BM.NORMAL,
		"ADD"			= BM.ADD,
		"MULTIPLY"	= BM.MULTIPLY,
		"SCREEN"		= BM.SCREEN,
		"OVERLAY"		= BM.OVERLAY,
		"DARKEN"		= BM.DARKEN,
		"LIGHTEN"		= BM.LIGHTEN,
		"COLOR_DODGE"	= BM.COLOR_DODGE,
		"COLOR_BURN"	= BM.COLOR_BURN,
		"HARD_LIGHT"	= BM.HARD_LIGHT,
		"SOFT_LIGHT"	= BM.SOFT_LIGHT,
		"DIFFERENCE"	= BM.DIFFERENCE,
		"EXCLUSION"	= BM.EXCLUSION,
		"HUE"			= BM.HUE,
		"SATURATION"	= BM.SATURATION,
		"COLOR"		= BM.COLOR,
		"LUMINOSITY"	= BM.LUMINOSITY
	}

	export class Sprite extends AbstractObject {
		public sceneElement: PIXI.Sprite;
		public anchor: GameObject.Point = new GameObject.Point(0, 0, this.updateAnchor.bind(this));

		protected _blend: number;
		protected texture: PIXI.Texture;

		constructor(texture: PIXI.Texture, name?: string) {
			super({
				name: name || 'Sprite',
				sceneElementAttr: [texture],
				hierarchyElementAttr: []
			});

			this.blend = PIXI.BLEND_MODES.NORMAL;
		}

		protected createSceneElement(texture: PIXI.Texture) {
			this.sceneElement = new PIXI.Sprite(texture);
		}

		get blend(): number { return this._blend; }
		set blend(value: number) {
			if (this._blend == value) return;

			this._blend = value;
			this.sceneElement.blendMode = value;
		}

		protected updateAnchor(x: number, y: number): void {
			this.sceneElement.anchor.set(x, y)
		}
	}
}
