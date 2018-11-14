/// <reference path="./Inspector.ts" />
/// <reference path="./Scene.ts" />

module Editor {

	export class Hierarchy {
		protected list: GameObject.Abs[] = [];

		protected view_element: HTMLElement;
		protected view_list: HTMLElement;

		constructor(
			public editor: Editor.Ctrl
		) {
			this.view_element = document.querySelector('#hierarchy');;
			this.view_list = this.view_element.querySelector('.content');

			this.initButtons();
			this.addTouchEvent();
		}

		protected addTouchEvent(): void {
			this.view_element.querySelector('.area').addEventListener('mouseup',
				(e: MouseEvent) => this.editor.eventCtrl.drop(e, EventTargetType.SCENE)
			);
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

		public add(game_object: GameObject.Abs): void {
			if (!this.editor.scene.content) {
				console.warn('Hierarchy.Add: First need to initialize the scene.');
				return;
			}

			// this.view_list.appendChild(game_object.hierarchy_view_element);
			this.view_list.insertBefore(game_object.hierarchy_view_element, this.view_list.firstChild);
			this.editor.scene.add(game_object);

			game_object.selectEvent(() => {
				this.editor.inspector.select(game_object);
			});

			game_object.visibleEvent(() => {
				if (!game_object.selected) return;
				this.editor.inspector.update(game_object, 'visible');
			});

			if (game_object instanceof GameObject.Container) {
				this.editor.inspector.getSelected().forEach((selected_object: GameObject.Abs) => {
					game_object.add(selected_object);
				});
			}
			this.editor.inspector.select(game_object);
		}

		public deleteSelected(): void {
			this.editor.inspector.getSelected().forEach((selected_object: GameObject.Container) => {
				this.editor.inspector.unselect(selected_object, false);
				if (selected_object.destroyed) return;
				selected_object.destroy();
			});

			this.editor.inspector.updateAttributes();
		}
	}
}
