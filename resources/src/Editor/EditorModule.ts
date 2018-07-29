/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../Utils/easy-html.ts" />
/// <reference path="../GameObject/Sprite.ts" />
/// <reference path="../GameObject/Container.ts" />
/// <reference path="./Hierarchy.ts" />
/// <reference path="./Inspector.ts" />
/// <reference path="./Scene.ts" />
/// <reference path="./Window.ts" />

module Editor {
	export class EditorModule {
		protected scene: Scene;
		protected inspector: Inspector;
		protected hierarchy: Hierarchy;

		protected assets_list: any = {};
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










		protected texture_upload(event: Event): void {
			let input: any = event.target;
			if (input && input.files) {
				let sortIMG: any = {};
				let sortJSON: any = {};
				let totalJSON: number = 0;
				for(let i=0; i<input.files.length; i++) {
					let file = input.files[i];
					if (file.type == 'application/json') {
						sortJSON[file.name] = file;
						totalJSON++;
					} else {
						sortIMG[file.name] = file;
					}
				}


				let jsonList = Object.keys(sortJSON);
				if (jsonList.length == 0) {
					for(let imgKey in sortIMG) { this.load_texture(sortIMG[imgKey]); }
				} else {
					jsonList.forEach((jsonKey) => {
						this.readJSON(sortJSON[jsonKey], (data: any) => {
							let atlasIMG = sortIMG[data.meta.image];
							if (atlasIMG) {
								delete sortIMG[data.meta.image];

								let img = new Image();
								img.src = URL.createObjectURL(atlasIMG);
								img.onload = () => {
									let base = new PIXI.BaseTexture(img);
									this.atlasParse(base, data);
								}
							} else {
								console.warn(`Load atlas: image "${data.meta.image}" is undefined. Skip "${jsonKey}" json.`);
							}

							--totalJSON;
							if (totalJSON == 0) {
								for(let imgKey in sortIMG) { this.load_texture(sortIMG[imgKey]); }
							}
						});
					});
				}
			}
		}

		protected load_texture(file: any) {
			let imgSRC = URL.createObjectURL(file);
			let asset: any = this.createHTMLAsset(imgSRC, file.name);
			asset.name = file.name;

			asset.img.onload = () => {
				let base = new PIXI.BaseTexture(asset.img);
				asset.texture = new PIXI.Texture(base);

				if (this.assets_list[asset.name]) {
					console.warn(`Add asset: "${asset.name}" already exists`);
					return;
				} else {
					this.assets_list[asset.name] = asset;
					this.assets_element.querySelector('.content').appendChild(asset.element);
				}

				asset.touch.addEventListener('dblclick', (event: Event) => {
					this.newSprite(asset.texture, asset.name);
				});
			}
		}

		protected readJSON(file: any, callback: Function): void {
			const reader = new FileReader();
			reader.onload = (event) => {
				if (event.target.readyState === 2) {
					let result = JSON.parse(reader.result);
					callback(result);
				}
			};
			reader.readAsText(file);
		}

		protected atlasParse(img: PIXI.BaseTexture, data: any) {
			const spritesheet = new PIXI.Spritesheet(img, data);
			spritesheet.parse((textures: any) => {
			   for(let key in textures) {
				   this.addAsset(textures[key] as PIXI.Texture, key);
			   }
			});
		}

		protected addAsset(texture: PIXI.Texture, name: string): void {
			var sprite = new PIXI.Sprite(texture);
			let imgLink = this.scene.application.renderer.extract.canvas(sprite).toDataURL('image/png');
			let asset: any = this.createHTMLAsset(imgLink, name);

			asset.name = name;
			asset.texture = texture;

			if (this.assets_list[asset.name]) {
				console.warn(`Add asset: "${asset.name}" already exists`);
				return;
			} else {
				this.assets_list[asset.name] = asset;
				this.assets_element.querySelector('.content').appendChild(asset.element);
			}

			asset.touch.addEventListener('dblclick', (event: Event) => {
				this.newSprite(asset.texture, asset.name);
			});
		}

		protected createHTMLAsset(imgLink: string, name: string): any {
			let asset: any = {};
			asset.name = name;

			asset.element = Utils.easyHTML.createElement({
				type: 'div',
				attr: { class: 'item', title: name }
			});

			asset.img = new Image();
			asset.img.src = imgLink;
			asset.element.appendChild(asset.img);

			let nameElement = Utils.easyHTML.createElement({
				type: 'div', parent: asset.element,
				attr: { class: 'name' },
				innerHTML: name
			});

			asset.touch = Utils.easyHTML.createElement({
				type: 'div', parent: asset.element,
				attr: { class: 'touch' }
			});

			return asset
		}

		protected newSprite(texture: PIXI.Texture, name: string): void {
			let sprite = new GameObject.Sprite(texture, name);
			this.hierarchy.add(sprite);
			// this.inspector.select(sprite);
		}
	}
}
