/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../Utils/easy-html.ts" />
/// <reference path="../GameObject/Text.ts" />
/// <reference path="../GameObject/Sprite.ts" />
/// <reference path="../GameObject/Container.ts" />
/// <reference path="../GameObject/Abs.ts" />
/// <reference path="./Assets/Ctrl.ts" />
/// <reference path="./Hierarchy.ts" />
/// <reference path="./Scene.ts" />
/// <reference path="./Inspector.ts" />
/// <reference path="./EventCtrl.ts" />
/// <reference path="./Window.ts" />

module Editor {
	export class Ctrl {
		public customGameObject: any;

		public eventCtrl: EventCtrl;
		public scene: Scene;
		public inspector: Inspector;
		public hierarchy: Hierarchy;
		public assets: Assets.Ctrl;

		constructor() {
			this.init_class_options();
			this.init_user_interface();
		}

		protected init_class_options(): void {
			this.customGameObject = {};
			this.eventCtrl = new EventCtrl();
			this.scene = new Scene(this);
			this.inspector = new Inspector(this);
			this.hierarchy = new Hierarchy(this);
			this.assets = new Assets.Ctrl(this);
		}

		protected init_user_interface(): void {
			this.init_options();
			this.init_right_block();
			this.init_bottom_block();
			this.init_left_block();
		}

		protected init_options(): void {
			this.init_newScene_window();
		}

		protected init_newScene_window(): void {
			let newSceneWindow: EditorWindow;

			let callback: Function = () => {
				let view_element: HTMLElement = newSceneWindow.view_element;

				let width: number = Number(this.getInputValue(view_element, '#new-scene-width'));
				let height: number = Number(this.getInputValue(view_element, '#new-scene-height'));

				let _color: string = this.getInputValue(view_element, '#new-scene-color');
				let color: number = Number('0x' + _color);

				this.scene.newScene({ width, height, color });
			};

			newSceneWindow = new EditorWindow(document.querySelector('#window-new-scene'), callback);
			document.querySelector('#option_new_scene').addEventListener('click', () => newSceneWindow.show());
		}

		protected getInputValue(
			searchIn: HTMLElement,
			path: string
		): any {
			let input: HTMLInputElement = searchIn.querySelector(path);
			return input.value;
		}

		protected init_right_block(): void {
			// Inspector
			// Hierarchy
		}

		protected init_bottom_block(): void {
			let block_visible: boolean = true;
			let block_element: HTMLElement = document.querySelector('.editor-block.bottom-block');

			block_element.querySelector('.labels-area .visible-button').addEventListener('click', () => {
				if (!block_visible) return;
				block_element.querySelector('.labels-area .button.show').classList.remove('show');
				block_element.classList.add('hide');
				block_visible = false;
			});


			let labels: NodeList = block_element.querySelectorAll('.labels-area .label');
			let label_event: Function = (label: HTMLElement) => {
				let current_show: HTMLElement = block_element.querySelector('.labels-area .button.show');
				if (current_show) current_show.classList.remove('show');
				label.classList.add('show');

				block_element.classList.remove('hide');
				block_visible = true;

				let window: string = label.getAttribute('data-window');
				block_element.querySelector('.main-area .container.show').classList.remove('show');
				block_element.querySelector('#'+window).classList.add('show');
			}

			for (let i=0; i<labels.length; ++i) {
				labels[i].addEventListener('click', label_event.bind(null, labels[i]));
			}

			// Assets
			// Spritesheet
			// Animator
		}

		protected init_left_block(): void {
			let block_element: HTMLElement = document.querySelector('.editor-block.left-block');
			let text_tool_element: HTMLElement = block_element.querySelector('#text-tool');
			text_tool_element.addEventListener('click', (event: Event) => {
				let scene_text = new GameObject.Text();
				this.hierarchy.add(scene_text);
			})
		}

		public createCustomObject(
			sceneObject: PIXI.DisplayObject,
			parameters: object
		): any {
			let parent: any = GameObject.Abs;
			if (sceneObject instanceof PIXI.Text) {
				parent = GameObject.Text;
			} else
			if (sceneObject instanceof PIXI.Sprite) {
				parent = GameObject.AbsSprite;
			} else
			if (sceneObject instanceof PIXI.Container) {
				parent = GameObject.Container;
			} else
			if (sceneObject instanceof PIXI.DisplayObject) {
				parent = GameObject.Display;
			} else {
				parent = GameObject.Abs;
			}


			let custom_object_class: any = class extends parent {
				public customName: string = sceneObject.name;

				protected create_scene_elememnt(attr?: any) {
					this.scene_view_element = new (sceneObject as any)();
				}
			}

			this.inspector.addCustomObject(sceneObject.name, parameters);

			this.customGameObject[sceneObject.name] = custom_object_class;
			return custom_object_class;
		}

	}
}
