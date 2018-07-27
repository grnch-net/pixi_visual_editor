/// <reference path="./Abstract.ts" />

module GameObject {
	import AbstractObject = GameObject.Abstract;

	export class Container extends AbstractObject {
		public sceneElement: PIXI.Container;

		constructor(name: string) {
			super({
				name: name || 'Group'
			});
		}

		protected createSceneElement() {
			this.sceneElement = new PIXI.Container();
		}

		public add(game_object: AbstractObject) {
			this.sceneElement.addChild(game_object.sceneElement);
		}
	}
}
