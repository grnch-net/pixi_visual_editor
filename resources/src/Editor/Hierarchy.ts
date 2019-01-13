/// <reference path="./Inspector.ts" />
/// <reference path="./Scene.ts" />
/// <reference path="../Editor/Assets/Object/Image.ts" />

module Editor {
	import AssetImage = Editor.AssetObject.Image;

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
			this.view_element.querySelector('.area')
			.addEventListener('mouseup', (event: MouseEvent) => {
				this.editor.eventCtrl.drop(
					event,
					EventTargetType.HIERARCHY,
					this.dropTouchEvent.bind(this)
				);
			});
		}

		protected dropTouchEvent(type: EventTargetType, args: any): void {
			if (type == EventTargetType.ASSETS) {
				if (args instanceof AssetObject.Image) this.createSprite(args);
			}
		}

		protected initButtons(): void {
			let panel = this.view_element.querySelector('.bottom-bar');

			panel.querySelector('#new-container').addEventListener('click', this.createContainer.bind(this));
			panel.querySelector('#delete-hierarchy-element').addEventListener('click', this.deleteSelected.bind(this));
		}

		public createContainer(): void {
			let container = new GameObject.Container();
			this.add(container);
		}

		public createSprite(asset: AssetImage, name: string = null) {
			let sprite = new GameObject.Sprite(asset, name);
			this.add(sprite);
		}

		public add(game_object: GameObject.Abs): void {
			if (!this.editor.scene.content) {
				console.warn('Hierarchy.Add: First need to initialize the scene.');
				return;
			}

			// this.view_list.appendChild(game_object.hierarchy_view_element);
			this.view_list.insertBefore(game_object.hierarchy_view_element, this.view_list.firstChild);
			this.editor.scene.add(game_object);

			this.add_game_object_events(game_object);

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

		protected add_game_object_events(game_object: GameObject.Abs) {
			game_object.takeEvent((event: MouseEvent) => {
				this.editor.eventCtrl.drag(event, {
					type: EventTargetType.HIERARCHY,
					take: () => this.game_object_take_event(game_object),
					drop: this.game_object_drop_event.bind(this),
					args: game_object
				});
			});

			game_object.selectEvent(() => {
				if (this.editor.eventCtrl.dragType !== null) return;
				this.editor.inspector.select(game_object);
			});

			game_object.visibleEvent(() => {
				if (!game_object.selected) return;
				this.editor.inspector.update(game_object, 'visible');
			});
		}

		protected game_object_drop_event(
			type: EventTargetType,
			game_object: GameObject.Abs
		): void {}

		protected game_object_take_event(game_object: GameObject.Abs): void {
			if (!game_object.selected) this.editor.inspector.select(game_object);
		}


	}
}
