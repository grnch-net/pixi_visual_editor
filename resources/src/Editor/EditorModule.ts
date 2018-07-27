/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../Utils/easy-html.ts" />
/// <reference path="../GameObject/Sprite.ts" />
/// <reference path="./Hierarchy.ts" />
/// <reference path="./Inspector.ts" />
/// <reference path="./Scene.ts" />

module Editor {
	export class EditorModule {
		protected scene: Scene;
		protected inspector: Inspector;
		protected hierarchy: Hierarchy;

		protected assets_list: Object[] = [];
		protected assets_element: HTMLElement;

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
			document.querySelector('#option_new_scene').addEventListener('click', this.newScene.bind(this));
		}

		protected init_right_block(): void {
			this.inspector = new Inspector();
			this.hierarchy = new Hierarchy(this.inspector);
		}

		protected init_bottom_block(): void {
			let block_visible: boolean = true;
			let block_element: HTMLElement = document.querySelector('.editor-block.bottom-block');

			this.assets_element = document.querySelector('#assets');

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

			this.init_assets(block_element);
			this.init_sprite_sheets(block_element);
			this.init_animator(block_element);
		}

		protected init_assets(block_element: HTMLElement): void {
			block_element.querySelector('#images_upload').addEventListener('change', this.texture_upload.bind(this));
		}

		protected init_sprite_sheets(block_element: HTMLElement): void {

		}

		protected init_animator(block_element: HTMLElement): void {

		}
















		protected newScene(): void {
			this.scene.newScene({
				width: 1536,
				height: 760,
				color: 0xffffff
			});
		}





		protected texture_upload(event: Event): void {
			let input: any = event.target;
			if (input && input.files) {
				for(let i=0; i<input.files.length; i++) {
					this.load_texture(input.files[i]);
				}
			}
		}

		protected load_texture(file: any) {
			let asset: any = {};
			asset.name = file.name;

			asset.element = Utils.easyHTML.createElement({
				type: 'div',
				attr: { class: 'item', title: asset.name }
			});

			let url = URL.createObjectURL(file);
			asset.img = new Image();
			asset.img.src = url;
			asset.element.appendChild(asset.img);

			let nameElement = Utils.easyHTML.createElement({
				type: 'div', parent: asset.element,
				attr: { class: 'name' },
				innerHTML: asset.name
			});

			let touch = Utils.easyHTML.createElement({
				type: 'div', parent: asset.element,
				attr: { class: 'touch' }
			});

			this.assets_element.querySelector('.content').appendChild(asset.element);

			asset.img.onload = () => {
				let base = new PIXI.BaseTexture(asset.img);
				asset.texture = new PIXI.Texture(base);

				this.assets_list.push(asset);

				touch.addEventListener('dblclick', (event: Event) => {
					this.newSprite(asset.texture, asset.name);
				});
			}
		}

		protected newSprite(texture: PIXI.Texture, name: string): void {
			let sprite = new GameObject.Sprite(texture, name);
			this.scene.add(sprite);
			this.hierarchy.add(sprite);
			this.inspector.select(sprite);
		}
	}
}
