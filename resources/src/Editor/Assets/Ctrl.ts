/// <reference path="../../lib.d.ts/pixi.d.ts" />
/// <reference path="../../Utils/easy-html.ts" />
/// <reference path="../../GameObject/Sprite.ts" />
/// <reference path="../EventCtrl.ts" />
/// <reference path="../Hierarchy.ts" />
/// <reference path="Object/Image.ts" />
/// <reference path="Object/Font.ts" />
/// <reference path="Object/Script.ts" />

module Editor.Assets {

	interface IAssetCtrlInitParameters {
		eventCtrl: EventCtrl;
		hierarchy: Hierarchy;
	}
	interface IJSONList {
		[propName: string]: any;
	}
	interface IImageList {
		[propName: string]: AssetObject.Image;
	}
	interface IFontList {
		[propName: string]: AssetObject.Font;
	}
	interface IScriptList {
		[propName: string]: AssetObject.Script;
	}

	export class Ctrl {
		protected view_element: HTMLElement;
		protected view_list: HTMLElement;

		protected json_list: IJSONList = {};
		protected image_list: IImageList = {};
		protected font_list: IFontList = {};
		protected script_list: IScriptList = {};

		protected selected_list: AssetObject.Abs[] = [];

		protected eventCtrl: EventCtrl;
		protected hierarchy: Hierarchy;

		constructor({
			eventCtrl,
			hierarchy
		}: IAssetCtrlInitParameters) {
			this.eventCtrl = eventCtrl;
			this.hierarchy = hierarchy;

			this.view_element = document.querySelector('#assets');;
			this.view_list = this.view_element.querySelector('.content');

			this.view_element.querySelector('#assets_upload').addEventListener('change', this.upload_new_assets.bind(this));
		}

		protected upload_new_assets(event: Event): void {
			let input: any = event.target;
			if (input && input.files) {
				let sort = this.sort_files(input.files);

				this.only_font(sort.font);
				this.only_script(sort.script);

				if (sort.json_total == 0) {
					this.only_img(sort.img);
				} else {
					this.only_json(sort);
				}
			}
		}

		protected sort_files(files: any): any {
			let sort: any = {
				script: {},
				font: {},
				img: {},
				json: {},
				json_total: 0
			};

			for(let key in files) {
				let file = files[key];

				if (file instanceof File) {
					let file_name_arr: string[] = file.name.split('.');
					if (file_name_arr.length == 1) {
						console.warn(`Invalid file name (${file.name}). Skipped.`);
						continue;
					}

					let file_type: string = file_name_arr[file_name_arr.length-1];

					switch(file_type) {
						case 'ttf':
						case 'woff':
						case 'woff2':
							sort.font[file.name] = file;
							break;
						case 'json':
							sort.json[file.name] = file;
							sort.json_total++;
							break;
						case 'js':
							sort.script[file.name] = file;
							break;
						default:
							sort.img[file.name] = file;
					}
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
						let atlasAsset = new AssetObject.Image({name, imageLink});
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
				this.create_image_asset(name, img_link);
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
					this.create_image_asset(key, img_link, textures[key] as PIXI.Texture);
			   }
			});
		}

		protected only_font(files: any) {
			for(let name in files) {
				let file = files[name];
				let img_link = URL.createObjectURL(file);
				this.create_font_asset(name, img_link);
			}
		}

		protected create_font_asset(name: string, link: string): void {
			let asset = new AssetObject.Font({name, link});
			asset.onLoad(() => {
				this.hierarchy.inspector.addNewFontFamily(name)
			});

			this.font_list[asset.name] = asset;
			this.view_list.appendChild(asset.view_element);
		}

		protected create_image_asset(name: string, imageLink: string, texture?: PIXI.Texture): void {
			if (this.image_list[name]) {
				console.warn(`Add asset: the image "${name}" already exists. Skipped image.`);
				return;
			}

			let asset = new AssetObject.Image({name, imageLink, texture});
			asset.addEvent('dblclick', (event: Event) => this.new_sprite(asset.texture, asset.name));

			asset.takeEvent((event: MouseEvent) => {
				this.eventCtrl.drag(event, {
					type: EventTargetType.ASSETS,
					take: () => {
						if (!asset.selected) this.select(asset);
					},
					drop: (type: EventTargetType) => {
						switch(type) {
							case EventTargetType.SCENE:
								this.new_sprite(asset.texture, asset.name);
								break;
						};
					}
				});
			});
			asset.selectEvent(() => {
				if (this.eventCtrl.dragType !== null) return;
				this.select(asset);
			});

			this.image_list[asset.name] = asset;
			this.view_list.appendChild(asset.view_element);
		}

		protected new_sprite(texture: PIXI.Texture, name: string): void {
			let sprite = new GameObject.Sprite(texture, name);
			this.hierarchy.add(sprite);
		}

		protected only_script(files: any) {
			for(let name in files) {
				let file = files[name];
				let img_link = URL.createObjectURL(file);
				this.create_script_asset(name, img_link);
			}
		}

		protected create_script_asset(name: string, link: string): void {
			let asset = new AssetObject.Script({name, link});
			asset.onLoad(() => {});

			this.script_list[asset.name] = asset;
			this.view_list.appendChild(asset.view_element);
		}

		public remove(asset: AssetObject.Image): void {
			asset.destroy();
			delete this.image_list[asset.name];
			this.view_list.removeChild(asset.view_element);
		}

		public select(asset_object: AssetObject.Abs): void {
			if (asset_object.selected) {
				if (this.selected_list.length == 1) { return; }
				else { this.clearSelected(asset_object); }
			} else {
				this.clearSelected();
				this.add(asset_object);
			}

		}

		public clearSelected(exception: AssetObject.Abs = null): void {
			if (exception) {
				while(this.selected_list.length > 0) {
					let currentObject = this.selected_list.pop();
					if (currentObject != exception) currentObject.unselect();
				}
				this.selected_list.push(exception);
			} else {
				while(this.selected_list.length > 0) {
					let currentObject = this.selected_list.pop();
					currentObject.unselect();
				}
			}
		}

		public add(asset_object: AssetObject.Abs): void {
			this.selected_list.push(asset_object);
			asset_object.select();
		}

		public getSelected(): AssetObject.Abs[] {
			return this.selected_list;
		}

		public unselect(asset_object: AssetObject.Abs, update: boolean = true): void {
			let index = this.selected_list.indexOf(asset_object);
			if (index > -1) this.selected_list.splice(index, 1);
			if (!asset_object.destroyed) asset_object.unselect();
		}
	}
}
