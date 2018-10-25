/// <reference path="./Abs.ts" />
/// <reference path="./Display.ts" />

module GameObject {
	let SPRITE_TYPE_IMAGE = 'assets/imageTypeIco.png';

	export let spriteOptions = [
		{ key: 'anchor', type: 'point', step: 0.1 },
		{ key: 'blendMode', type: 'select', label: 'Blend', values: PIXI.BLEND_MODES},
	];

	export abstract class AbsSprite extends Display {
		public scene_view_element: PIXI.Sprite;

		constructor(parameters: IAbsInitParameters) {
			super(parameters);
		}

	}
}
