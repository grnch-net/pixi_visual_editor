/// <reference path="./Inspector.ts" />
/// <reference path="./Scene.ts" />

module Editor {
	interface IHierarchyInitParameters {
		scene: Scene;
		inspector: Inspector;
	}

	export class Hierarchy {
		protected list: GameObject.AbstractObject[] = [];

		protected view_element: HTMLElement;
		protected view_list: HTMLElement;

		public scene: Scene;
		public inspector: Inspector

		constructor({
			scene,
			inspector
		}: IHierarchyInitParameters) {
			this.scene = scene;
			this.inspector = inspector;

			this.view_element = document.querySelector('#hierarchy');;
			this.view_list = this.view_element.querySelector('.content');

			this.initButtons();
		}

		protected initButtons(): void {
			let panel = this.view_element.querySelector('.bottom-bar');

			panel.querySelector('#new-container').addEventListener('click', this.createContainer.bind(this));
			panel.querySelector('#delete-hierarchy-element').addEventListener('click', this.deleteSelected.bind(this));
		}

		protected createContainer(): void {
			let container = new GameObject.Container();
			this.add(container);
		}

		public add(game_object: GameObject.AbstractObject): void {
			if (!this.scene.content) {
				console.warn('Hierarchy.Add: First need to initialize the scene.');
				return;
			}

			// this.view_list.appendChild(game_object.hierarchy_view_element);
			this.view_list.insertBefore(game_object.hierarchy_view_element, this.view_list.firstChild);
			this.scene.add(game_object);

			game_object.selectEvent(() => {
				this.inspector.select(game_object);
			});

			game_object.visibleEvent(() => {
				if (!game_object.isSelected) return;
				this.inspector.update(game_object, 'visible');
			});

			if (game_object instanceof GameObject.Container) {
				this.inspector.getSelected().forEach((selected_object: GameObject.AbstractObject) => {
					game_object.add(selected_object);
				});
			}
			this.inspector.select(game_object);
		}

		public deleteSelected(): void {
			this.inspector.getSelected().forEach((selected_object: GameObject.Container) => {
				this.inspector.unselect(selected_object, false);
				if (selected_object.destroyed) return;
				selected_object.destroy();
			});

			this.inspector.updateAttributes();
		}
	}
}
