/// <reference path="./AbstractObject.ts" />

module GameObject {
	let SPRITE_TYPE_IMAGE = 'assets/imageTypeIco.png';

	export class AbstractSprite extends AbstractObject {
		public scene_view_element: PIXI.Sprite;
		public anchor: GameObject.Point = new GameObject.Point(0, 0, this.updateAnchor.bind(this));

		protected _blend: number;

		constructor(parameters: IAbstractInitParameters) {
			super(parameters);

			this.blend = PIXI.BLEND_MODES.NORMAL;
		}

		get blend(): number { return this._blend; }
		set blend(value: number) {
			if (this._blend == value) return;

			this._blend = value;
			(this.scene_view_element as PIXI.Sprite).blendMode = value;
		}

		protected updateAnchor(x: number, y: number): void {
			(this.scene_view_element as PIXI.Sprite).anchor.set(x, y)
		}
	}
}
