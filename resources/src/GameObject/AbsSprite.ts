/// <reference path="./Abs.ts" />
/// <reference path="./Display.ts" />
/// <reference path="../Editor/Assets/Object/Image.ts" />

module GameObject {
	import AssetImage = Editor.AssetObject.Image;

	let SPRITE_TYPE_IMAGE = 'assets/imageTypeIco.png';

	export let spriteOptions = [
		{ key: 'anchor', type: 'point', step: 0.1 },
		{ key: 'blendMode', type: 'select', label: 'Blend', values: PIXI.BLEND_MODES },
		{ key: 'texture', type: 'texture', readonly: true },
	];

	export abstract class AbsSprite extends Display {
		public scene_view_element: PIXI.Sprite;
		protected asset_image: AssetImage = null;

		constructor(parameters: IAbsInitParameters) {
			super(parameters);
		}

		get texture() {
			return this.asset_image;
		}

		set texture(value: AssetImage) {
			if (!value.texture.trim) {
				value.texture.trim = value.texture.orig;
			}

			this.asset_image = value;
			this.scene_view_element.texture = value.texture;
		}

	}
}
