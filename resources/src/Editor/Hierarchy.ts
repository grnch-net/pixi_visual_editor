/// <reference path="./Inspector.ts" />
/// <reference path="./Scene.ts" />
/// <reference path="./abs-list.ts" />
/// <reference path="./Assets/Object/Image.ts" />

module Editor {
	import InsertType = GameObject.InsertType;
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
			this.addTargetEvent(target_element);
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
			if (!Array.isArray(args)) return;

			if (type == EventTargetType.ASSETS) {
				for(let texture of args) {
					if (texture instanceof AssetObject.Image) {
						this.createSprite(texture);
					}
				}
			} else
			if (type == EventTargetType.HIERARCHY) {
				let content = this.editor.scene.content;
				for(let game_object of args) {
					content.addLastChild(game_object);
				}
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
					gameObject.addChild(selected_object);
				});
			}
			this.editor.inspector.select(gameObject);
		}

		public appendChild(
			gameObject: GameObject.Abs,
			parent: GameObject.Container = this.editor.scene.content
		): void {
			parent.addChild(gameObject);
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

			game_object.addEvent('mouseup', (event: MouseEvent) => {
				this.eventCtrl.drop(
					event,
					this.event_target_type,
					(type: EventTargetType, args: any) => {
						this.onItemDropEvent(type, args, game_object);
					}
				);
			})

			game_object.addEvent('mouseout', (event: MouseEvent) => {
				game_object.hideInsertArea();
			});

			game_object.addEvent('mouseover', (event: MouseEvent) => {
				let type = this.editor.eventCtrl.dragType;
				if (type === EventTargetType.HIERARCHY) {
					game_object.showInsertArea();
				}
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

		protected onItemDropEvent(
			type: EventTargetType,
			args: any[],
			target: GameObject.Abs
		): void {
			if (type == EventTargetType.HIERARCHY) {
				let parent = target.parent as GameObject.Container;

				if (target instanceof GameObject.Container) {
					if (target.insertType == InsertType.BEFORE) {
						args.forEach((insert_object: GameObject.Abs) => {
							parent.insertBeforeChild(insert_object, target);
						});
					} else
					if (target.insertType == InsertType.AFTER){
						args.reverse()
						.forEach((insert_object: GameObject.Abs) => {
							if (insert_object == target) return;
							target.addChild(insert_object);
						});
					}
				} else {
					if (target.insertType == InsertType.BEFORE) {
						args.forEach((insert_object: GameObject.Abs) => {
							if (insert_object == target) return;
							parent.insertBeforeChild(insert_object, target);
						});
					} else
					if (target.insertType == InsertType.AFTER){
						args.reverse().forEach((insert_object: GameObject.Abs) => {
							if (insert_object == target) return;
							parent.insertAfterChild(insert_object, target);
						});
					}
				}

				target.hideInsertArea();
			}

		}
	}
}
