/// <reference path="./AbstractObject.ts" />

module GameObject {
	let SPRITE_TYPE_IMAGE = 'assets/imageTypeIco.png';

	export class AbstractSprite extends AbstractObject {
		public scene_view_element: PIXI.Sprite;

		constructor(parameters: IAbstractInitParameters) {
			super(parameters);
		}

	}
}
