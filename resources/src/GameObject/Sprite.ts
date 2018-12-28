/// <reference path="./AbsSprite.ts" />

module GameObject {
	import AssetImage = Editor.AssetObject.Image;

	let SPRITE_TYPE_IMAGE = 'assets/imageTypeIco.png';

	export class Sprite extends AbsSprite {
		// protected texture: PIXI.Texture;

		constructor(asset: AssetImage, name?: string) {
			let parse_name = asset.name.split('.');
			if (parse_name.length > 1) parse_name.pop();
			let asset_name = parse_name.join('.');
			super({
				name: name || asset_name || 'Sprite',
				sceneElementAttr: [asset.texture],
				hierarchyElementAttr: []
			});

			this.asset_image = asset;
		}

		protected create_scene_elememnt(texture: PIXI.Texture) {
			this.scene_view_element = new PIXI.Sprite(texture);
		}

		protected create_hierarchy_element(attr?: any) {
			super.create_hierarchy_element(attr);
			(this.typeElement as HTMLImageElement).src = SPRITE_TYPE_IMAGE;
		}

	}
}
