module Editor {
	interface IHierarchyInitParameters {
		scene: Scene;
		inspector: Inspector;
	}

	export class Hierarchy {
		protected list: GameObject.AbstractObject[] = [];

		protected view_element: HTMLElement;
		protected view_list: HTMLElement;

		protected scene: Scene;
		protected inspector: Inspector

		constructor({
			scene,
			inspector
		}: IHierarchyInitParameters) {
			this.scene = scene;
			this.inspector = inspector;

			this.view_element = document.querySelector('#hierarchy');;
			this.view_list = this.view_element.querySelector('.content');
		}

		public add(game_object: GameObject.AbstractObject) {
			this.view_list.appendChild(game_object.hierarchyElement);
			this.scene.add(game_object);
			this.inspector.select(game_object);

			game_object.touchEvent(() => {
				this.inspector.select(game_object);
			});
		}
	}
}
