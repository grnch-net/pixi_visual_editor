/// <reference path="./AbstractObject.ts" />

module GameObject {

	let GRAPHIC_TYPE_IMAGE = 'assets/figureTypeIco.png';

	export class Graphics extends AbstractObject {
		public scene_view_element: PIXI.Graphics;

		constructor(name?: string) {
			super({
				name: name || 'Graphics'
			});

		}

		protected createSceneElement() {
			this.scene_view_element = new PIXI.Graphics();
		}

		protected createHierarchyElement(attr?: any) {
			super.createHierarchyElement(attr);
			(this.typeElement as HTMLImageElement).src = GRAPHIC_TYPE_IMAGE;
		}

	}
}
