/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../Utils/easy-html.ts" />
/// <reference path="../GameObject/Sprite.ts" />
/// <reference path="../GameObject/Container.ts" />
/// <reference path="./Assets/AssetsModule.ts" />
/// <reference path="./Hierarchy.ts" />
/// <reference path="./Inspector.ts" />
/// <reference path="./Scene.ts" />
/// <reference path="./Window.ts" />

module Editor {
	export class EditorModule {
		protected scene: Scene;
		protected inspector: Inspector;
		protected hierarchy: Hierarchy;
		protected assets: Assets.AssetsModule;

		constructor() {
			this.scene = new Scene();

			this.init_user_interface();
		}

		protected init_user_interface(): void {
			this.init_options();
			this.init_right_block();
			this.init_bottom_block();
		}

		protected init_options(): void {
			this.init_newScene_window();
		}

		protected init_newScene_window(): void {
			let newSceneWindow = new EditorWindow(document.querySelector('#window-new-scene'), () => {
				let view_element = newSceneWindow.view_element;
				let width = +(view_element.querySelector('#new-scene-width') as HTMLInputElement).value;
				let height = +(view_element.querySelector('#new-scene-height') as HTMLInputElement).value;
				// let color = +(view_element.querySelector('#new-scene-color') as HTMLInputElement).value;
				this.scene.newScene({ width, height, color: 0xffffff });
			});
			document.querySelector('#option_new_scene').addEventListener('click', () => newSceneWindow.show());
		}

		protected init_right_block(): void {
			this.inspector = new Inspector();
			this.hierarchy = new Hierarchy({
				scene: this.scene,
				inspector: this.inspector
			});
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


			let labels = block_element.querySelectorAll('.labels-area .label');
			let label_event = (label: HTMLElement) => {
				let current_show = block_element.querySelector('.labels-area .button.show');
				if (current_show) current_show.classList.remove('show');
				label.classList.add('show');

				block_element.classList.remove('hide');
				block_visible = true;

				let window = label.getAttribute('data-window');
				block_element.querySelector('.main-area .container.show').classList.remove('show');
				block_element.querySelector('#'+window).classList.add('show');
			}

			for (let i=0; i<labels.length; ++i) {
				labels[i].addEventListener('click', label_event.bind(null, labels[i]));
			}

			this.assets = new Assets.AssetsModule(this.hierarchy);
			this.init_sprite_sheets(block_element);
			this.init_animator(block_element);
		}

		protected init_sprite_sheets(block_element: HTMLElement): void {

		}

		protected init_animator(block_element: HTMLElement): void {

		}



	}
}
