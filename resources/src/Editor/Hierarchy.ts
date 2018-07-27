module Editor {

	export class Hierarchy {
		protected list: GameObject.Abstract[] = [];

		protected view_element: HTMLElement;
		protected view_list: HTMLElement;

		constructor(
			protected inspector: Inspector
		) {
			this.view_element = document.querySelector('#hierarchy');;
			this.view_list = this.view_element.querySelector('.content');
		}

		public add(scene_object: GameObject.Abstract) {
			this.view_list.appendChild(scene_object.hierarchyElement);
			this.inspector.select(scene_object);

			scene_object.touchEvent(() => {
				this.inspector.select(scene_object);
			});
		}
	}
}
