/// <reference path="../../lib.d.ts/pixi.d.ts" />
/// <reference path="../../Utils/easy-html.ts" />
/// <reference path="../../GameObject/Sprite.ts" />
/// <reference path="../Hierarchy.ts" />
/// <reference path="Asset.ts" />

module Editor.Assets {

	interface IJSONList {
		[propName: string]: Asset;
	}
	interface IImageList {
		[propName: string]: Asset;
	}

	export class AssetsModule {
		protected view_element: HTMLElement;
		protected view_list: HTMLElement;

		protected json_list: IJSONList = {};
		protected image_list: IImageList = {};

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
			let change_json_total = () => {
				--sort.json_total;
				if (sort.json_total == 0) {
					this.only_img(sort.img);
				}
			};

			for(let json_key in sort.json) {
				if (this.json_list[json_key]) {
					console.warn(`Load atlas: the json "${json_key}" already exists. Skipped json.`);
					change_json_total();
					continue;
				}

				let read_callback = (data: any) => {
					let image_name = data.meta.image;
					let atlasIMG = sort.img[image_name];

					if (atlasIMG) {
						delete sort.img[image_name];

						let imageLink = URL.createObjectURL(atlasIMG);
						let atlasAsset = new Asset({name, imageLink});
						atlasAsset.onLoad(() => {
							this.atlas_parse(atlasAsset.base, json_key, data);
						});

						if (this.image_list[image_name]) {
							console.warn(`Load atlas: the atlas "${image_name}" already exists. Atlas replaced.`);
							this.remove(this.image_list[image_name]);
						}
						this.image_list[image_name] = atlasAsset;
					} else
					if (this.image_list[image_name]) {
						let asset = this.image_list[image_name];

						if (!asset.base) {
							console.warn(`Load atlas: the uploaded image "${image_name}" is not atlas. Skipped json "${json_key}".`);
						} else {
							this.view_list.removeChild(asset.view_element);
							this.atlas_parse(asset.base, json_key, data);
						}
					} else {
						console.warn(`Load atlas: the atlas "${image_name}" is undefined. Skipped json "${json_key}".`);
					}

					change_json_total();
				}

				this.read_json(sort.json[json_key], read_callback);
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

		protected atlas_parse(img: PIXI.BaseTexture, json_name: string, data: any) {
			this.json_list[json_name] = data;

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
			if (this.image_list[name]) {
				console.warn(`Add asset: the image "${name}" already exists. Skipped image.`);
				return;
			}

			let asset = new Asset({name, imageLink, texture});
			asset.addEvent('dblclick', (event: Event) => this.new_sprite(asset.texture, asset.name));

			this.image_list[asset.name] = asset;
			this.view_list.appendChild(asset.view_element);
		}

		protected new_sprite(texture: PIXI.Texture, name: string): void {
			let sprite = new GameObject.Sprite(texture, name);
			this.hierarchy.add(sprite);
		}

		public remove(asset: Asset): void {
			delete this.image_list[asset.name];
			this.view_list.removeChild(asset.view_element);
		}
	}
}
