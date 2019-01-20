/// <reference path="./Inspector.ts" />
/// <reference path="./Scene.ts" />
/// <reference path="../Editor/Assets/Object/Image.ts" />

module Editor {
	import AssetImage = Editor.AssetObject.Image;

	export class Hierarchy {
		protected list: GameObject.Abs[];

		protected view_element: HTMLElement;
		public view_list: HTMLElement;

		constructor(
			public editor: Editor.Ctrl
		) {
			this.init_class_options();
			this.initButtons();
			this.addTouchEvent();
		}

		protected init_class_options(): void {
			this.list = [];
			this.view_element = document.querySelector('#hierarchy');;
			this.view_list = this.view_element.querySelector('.content');
		}


		protected initButtons(): void {
			let panel: HTMLElement = this.view_element.querySelector('.bottom-bar');

			panel.querySelector('#new-container').addEventListener('click', this.createContainer.bind(this));
			panel.querySelector('#delete-hierarchy-element').addEventListener('click', this.deleteSelected.bind(this));
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

		protected dropTouchEvent(
			type: EventTargetType,
			args: any
		): void {
			if (type == EventTargetType.ASSETS) {
				if (args instanceof AssetObject.Image) this.createSprite(args);
			}
		}

		public createContainer(): void {
			let container = new GameObject.Container();
			this.add(container);
		}

		public createSprite(
			asset: AssetImage,
			name: string = null
		): void {
			let sprite = new GameObject.Sprite(asset, name);
			this.add(sprite);
		}

		public add(
			gameObject: GameObject.Abs
		): void {
			if (!this.editor.scene.content) {
				console.warn('Hierarchy.Add: First need to initialize the scene.');
				return;
			}

			this.appendChild(gameObject);

			this.add_game_object_events(gameObject);

			if (gameObject instanceof GameObject.Container) {
				this.editor.inspector.getSelected().forEach((selected_object: GameObject.Abs) => {
					gameObject.add(selected_object);
				});
			}
			this.editor.inspector.select(gameObject);
		}

		public appendChild(
			gameObject: GameObject.Abs,
			parent: GameObject.Container = this.editor.scene.content
		): void {
			parent.add(gameObject);
		}

		public insertBeforeChild(
			insertObject: GameObject.Abs,
			beforeObject: GameObject.Abs
		): void {
			let heirarchy_parent: HTMLElement = beforeObject.hierarchy_view_element.parentElement;
			let next_element: Element = beforeObject.hierarchy_view_element.nextElementSibling;
			heirarchy_parent.insertBefore(insertObject.hierarchy_view_element, next_element);

			let scene_parent: PIXI.Container = beforeObject.scene_view_element.parent;
			let scene_index: number = scene_parent.getChildIndex(beforeObject.scene_view_element)
			scene_parent.addChildAt(insertObject.scene_view_element, scene_index);
		}

		public insertAfterChild(
			insertObject: GameObject.Abs,
			afterObject: GameObject.Abs
		): void {
			let heirarchy_parent: HTMLElement = afterObject.hierarchy_view_element.parentElement;
			heirarchy_parent.insertBefore(insertObject.hierarchy_view_element, afterObject.hierarchy_view_element);

			let scene_parent: PIXI.Container = afterObject.scene_view_element.parent;
			let scene_index: number = scene_parent.getChildIndex(afterObject.scene_view_element)
			scene_parent.addChildAt(insertObject.scene_view_element, scene_index);
		}

		public deleteSelected(): void {
			let inspector = this.editor.inspector;

			inspector.getSelected().forEach((selected_object: GameObject.Container) => {
				inspector.unselect(selected_object, false);
				if (selected_object.destroyed) return;
				selected_object.destroy();
			});

			inspector.updateAttributes();
		}

		protected add_game_object_events(
			game_object: GameObject.Abs
		): void {
			let inspector = this.editor.inspector;
			let args: GameObject.Abs[];

			if (game_object.selected) {
				args = inspector.getSelected();
			} else {
				args = [game_object]
			}

			game_object.takeEvent((event: MouseEvent) => {
				this.editor.eventCtrl.drag(event, {
					type: EventTargetType.HIERARCHY,
					take: () => this.game_object_take_event(args),
					drop: this.game_object_drop_event.bind(this),
					args: args
				});
			});

			game_object.selectEvent(() => {
				let dragType: EventTargetType = this.editor.eventCtrl.dragType;
				if (dragType !== null) return;
				inspector.select(game_object);
			});

			game_object.visibleEvent(() => {
				if (!game_object.selected) return;
				inspector.update(game_object, 'visible');
			});
		}

		protected game_object_drop_event(
			type: EventTargetType,
			args: GameObject.Abs[]
		): void {}

		protected game_object_take_event(
			args: GameObject.Abs[]
		): void {}
	}
}
