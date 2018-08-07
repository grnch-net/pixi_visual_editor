/// <reference path="./AbstractObject.ts" />

module GameObject {

	let TEXT_TYPE_IMAGE = 'assets/textTypeIco.png';

	export class Text extends AbstractObject {
		public scene_view_element: PIXI.Text;

		constructor(name?: string) {
			super({
				name: name || 'Text'
			});

		}

		protected createSceneElement() {
			this.scene_view_element = new PIXI.Text();
		}

		protected createHierarchyElement(attr?: any) {
			super.createHierarchyElement(attr);
			(this.typeElement as HTMLImageElement).src = TEXT_TYPE_IMAGE;
		}

	}
}
