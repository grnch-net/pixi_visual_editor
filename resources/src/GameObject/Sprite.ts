/// <reference path="./AbstractSprite.ts" />

module GameObject {
	let SPRITE_TYPE_IMAGE = 'assets/imageTypeIco.png';

	export class Sprite extends AbstractSprite {
		protected texture: PIXI.Texture;

		constructor(texture: PIXI.Texture, name?: string) {
			super({
				name: name || 'Sprite',
				sceneElementAttr: [texture],
				hierarchyElementAttr: []
			});

		}

		protected createSceneElement(texture: PIXI.Texture) {
			this.scene_view_element = new PIXI.Sprite(texture);
		}

		protected createHierarchyElement(attr?: any) {
			super.createHierarchyElement(attr);
			(this.typeElement as HTMLImageElement).src = SPRITE_TYPE_IMAGE;
		}

	}
}
