/// <reference path="../../lib.d.ts/pixi.d.ts" />
/// <reference path="../../Utils/easy-html.ts" />
/// <reference path="../../GameObject/Sprite.ts" />
/// <reference path="Asset.ts" />

module Editor.Assets {

	interface IList {
		[propName: string]: Asset;
	}

	export class AssetsModule {
		protected view_element: HTMLElement;
		protected view_list: HTMLElement;

		protected list: IList = {};

		constructor(
			protected hierarchy: Hierarchy
		) {
			this.view_element = document.querySelector('#assets');;
			this.view_list = this.view_element.querySelector('.content');

			this.view_element.querySelector('#images_upload').addEventListener('change', this.texture_upload.bind(this));
		}

		protected texture_upload(event: Event): void {
			let input: any = event.target;
			if (input && input.files) {
				let sort = this.sort_files(input.files);

				if (sort.json_total == 0) {
					this.only_img(sort.img);
				} else {
					this.only_json(sort);
				}
			}
		}

		protected sort_files(files: any): any {
			let sort: any = {
				img: {},
				json: {},
				json_total: 0
			};

			for(let key in files) {
				let file = files[key];
				if (file.type == 'application/json') {
					sort.json[file.name] = file;
					sort.json_total++;
				} else
				if (file instanceof File) {
					sort.img[file.name] = file;
				}
			}

			return sort;
		}

		protected only_json(sort: any) {
			for(let json_key in sort.json) {
				let callback = (data: any) => {
					let atlasIMG = sort.img[data.meta.image];
					if (atlasIMG) {
						delete sort.img[data.meta.image];

						let img = new Image();
						img.src = URL.createObjectURL(atlasIMG);
						img.onload = () => {
							let base = new PIXI.BaseTexture(img);
							this.atlas_parse(base, data);
						}
					} else {
						console.warn(`Load atlas: image "${data.meta.image}" is undefined. Skip "${json_key}".`);
					}

					--sort.json_total;
					if (sort.json_total == 0) {
						this.only_img(sort.img);
					}
				}

				this.read_json(sort.json[json_key], callback);
			}
		}

		protected only_img(files: any) {
			for(let name in files) {
				let file = files[name];
				let img_link = URL.createObjectURL(file);
				this.create_asset(name, img_link);
			}
		}

		protected read_json(file: any, callback: Function): void {
			const reader = new FileReader();
			reader.onload = (event) => {
				if (event.target.readyState === 2) {
					let result = JSON.parse(reader.result);
					callback(result);
				}
			};
			reader.readAsText(file);
		}

		protected atlas_parse(img: PIXI.BaseTexture, data: any) {
			const spritesheet = new PIXI.Spritesheet(img, data);
			spritesheet.parse((textures: any) => {
			   for(let key in textures) {
					let sprite = new PIXI.Sprite(textures[key]);
					let img_link = this.hierarchy.scene.application.renderer.extract.canvas(sprite).toDataURL('image/png');
					this.create_asset(key, img_link, textures[key] as PIXI.Texture);
			   }
			});
		}

		protected create_asset(name: string, imageLink: string, texture?: PIXI.Texture): void {
			if (this.list[name]) {
				console.warn(`Add asset: "${name}" already exists`);
				return;
			}

			let asset = new Asset({name, imageLink, texture});
			asset.addEvent('dblclick', (event: Event) => this.new_sprite(asset.texture, asset.name));

			this.list[asset.name] = asset;
			this.view_list.appendChild(asset.view_element);
		}

		protected new_sprite(texture: PIXI.Texture, name: string): void {
			let sprite = new GameObject.Sprite(texture, name);
			this.hierarchy.add(sprite);
		}
	}
}
