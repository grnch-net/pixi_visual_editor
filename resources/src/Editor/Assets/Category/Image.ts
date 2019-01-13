/// <reference path="Abs.ts" />
/// <reference path="../Object/Image.ts" />

module Editor.AssetCategory {

	export class Image extends Abs {
		public uploadType: string = 'image/*, .json';
		protected item_list: { [key: string]: AssetObject.Image } = {};

		protected json_list: any = {};

		constructor(ctrl: Assets.Ctrl) {
			super(ctrl, 'Image');
		}

		protected sort_files(files: FileList): any {
			let file_list: any = {
				img: {},
				json: {},
				json_total: 0
			};

			for(let key in files) {
				let file = files[key];
				if (file instanceof File) {
					let file_name_arr: string[] = file.name.split('.');
					if (file_name_arr.length == 1) {
						console.warn(`Invalid file name (${file.name}). Skipping.`);
						continue;
					}

					let file_type: string = file_name_arr[file_name_arr.length-1];

					if (file_type == 'json') {
						if (this.json_list[file.name]) {
							console.warn(`Add asset: the json "${file.name}" already exists.`);
							continue;
						}

						file_list.json[file.name] = file;
						file_list.json_total++;
					} else {
						if (this.item_list[file.name]) {
							console.warn(`Add asset: the image "${name}" already exists.`);
							continue;
						}

						file_list.img[file.name] = file;
					}
				}
			}

			return file_list;
		}

		public upload(event: Event): null {
			let files = super.upload(event);

			if (!files) return;

			if (files.json_total == 0) {
				this.only_img(files.img);
			} else {
				this.only_json(files);
			}

		}

		protected only_img(files: any) {
			for(let name in files) {
				let file = files[name];
				let img_link = URL.createObjectURL(file);
				this.create_image_asset(name, img_link);
			}
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
					console.warn(`Load atlas: the json "${json_key}" already exists.`);
					change_json_total();
					continue;
				}

				let read_callback = (data: any) => {
					if (!data || !data.meta || !data.meta.image) {
						console.warn(`Load atlas: the json "${json_key}" is wrong. Skipping.`);
						change_json_total();
						return;
					}

					let image_name = data.meta.image;
					let atlasIMG = sort.img[image_name];

					if (atlasIMG) {
						delete sort.img[image_name];

						let imageLink = URL.createObjectURL(atlasIMG);
						let atlasAsset = new AssetObject.Image({name, imageLink});
						atlasAsset.onLoad(() => {
							this.atlas_parse(atlasAsset.base, json_key, data);
						});

						this.item_list[image_name] = atlasAsset;
					} else
					if (this.item_list[image_name]) {
						let asset = this.item_list[image_name];

						if (!asset.base) {
							console.warn(`Load atlas: the uploaded image "${image_name}" is not atlas. Skipping json "${json_key}".`);
						} else {
							this.view_element.removeChild(asset.view_element);
							this.atlas_parse(asset.base, json_key, data);
						}
					} else {
						console.warn(`Load atlas: the atlas "${image_name}" is undefined. Skipping json "${json_key}".`);
					}

					change_json_total();
				}

				this.read_json(sort.json[json_key], read_callback);
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
					let scene = this.ctrl.editor.scene;
					let img_link = scene.application.renderer.extract.canvas(sprite).toDataURL('image/png');
					this.create_image_asset(key, img_link, textures[key] as PIXI.Texture);
			   }
			});
		}

		protected create_image_asset(name: string, imageLink: string, texture?: PIXI.Texture): void {
			let asset = new AssetObject.Image({name, imageLink, texture});
			this.add_asset_event(asset);

			this.item_list[asset.name] = asset;
			this.view_element.appendChild(asset.view_element);
		}

		protected add_asset_event(asset: AssetObject.Image): void {
			super.add_asset_event(asset);
			asset.addEvent('dblclick', (event: Event) => {
				this.ctrl.editor.hierarchy.createSprite(asset);
			});
		}

		protected asset_drop_event(type: EventTargetType, asset: AssetObject.Image): void {}

	}
}
