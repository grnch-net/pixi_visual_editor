/// <reference path="./Inspector.ts" />
/// <reference path="./Scene.ts" />
/// <reference path="./abs-list.ts" />
/// <reference path="./Assets/Object/Image.ts" />

module Editor {
	import AssetImage = Editor.AssetObject.Image;

	export class Hierarchy extends AbsList {
		protected list: GameObject.Abs[];

		protected view_element: HTMLElement;
		public view_list: HTMLElement;

		constructor(
			public editor: Editor.Ctrl
		) {
			super(editor.eventCtrl);
			this.initButtons();

			let target_element = this.view_element.querySelector('.area') as HTMLElement;
			this.addDropEvent(target_element);
		}

		protected init_class_options(): void {
			super.init_class_options();
			this.event_target_type = EventTargetType.HIERARCHY;
			this.list = [];
			this.view_element = document.querySelector('#hierarchy');;
			this.view_list = this.view_element.querySelector('.content');
		}


		protected initButtons(): void {
			let panel: HTMLElement = this.view_element.querySelector('.bottom-bar');

			panel.querySelector('#new-container').addEventListener('click', this.createContainer.bind(this));
			panel.querySelector('#delete-hierarchy-element').addEventListener('click', this.deleteSelected.bind(this));
		}

		protected onDropEvent(
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

			this.addItemEvent(gameObject);

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

		protected addItemEvent(
			game_object: GameObject.Abs
		): void {
			let inspector = this.editor.inspector;
			let args: GameObject.Abs[];

			if (game_object.selected) {
				args = inspector.getSelected();
			} else {
				args = [game_object]
			}

			super.addItemEvent(game_object, args);

			game_object.visibleEvent(() => {
				if (!game_object.selected) return;
				inspector.update(game_object, 'visible');
			});
		}

		protected itemTakeEvent(
			game_object: GameObject.Abs,
			args: GameObject.Abs[]
		): void {}

		protected itemDropEvent(
			type: EventTargetType,
			args: GameObject.Abs[]
		): void {}

		protected itemSelectEvent(
			game_object: GameObject.Abs,
			args: GameObject.Abs[]
		): void {
			let inspector = this.editor.inspector;
			if (!game_object.selected || inspector.getSelected().length > 1) {
				inspector.select(game_object);
			}
		}
	}
}
