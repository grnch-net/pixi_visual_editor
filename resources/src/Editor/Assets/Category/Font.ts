/// <reference path="Abs.ts" />
/// <reference path="../Object/Font.ts" />

module Editor.AssetCategory {

	export class Font extends Abs {
		protected item_list: {
			[key: string]: AssetObject.Font
		};

		constructor(
			ctrl: Assets.Ctrl
		) {
			super(ctrl, 'Font');
		}

		protected init_class_options(): void {
			super.init_class_options();
			this.uploadType = '.ttf, .woff, .woff2';
		}

		public upload(
			event: Event
		): null {
			let inspector = this.ctrl.editor.inspector;
			let files: any = super.upload(event);

			if (!files) return;
			let new_assets: any[] = [];

			let load_count: number = 0;
			let onLoad: Function = () => {
				load_count++;
				if (load_count == new_assets.length) {
					inspector.addNewFontFamily(new_assets);
				}
			}

			for(let name in files) {
				let link: string = URL.createObjectURL(files[name]);

				let asset = new AssetObject.Font({name, link});
				asset.onLoad(onLoad);

				this.addItemEvent(asset);
				this.item_list[asset.name] = asset;
				this.view_element.appendChild(asset.view_element);
				new_assets.push(asset.name);
			}

		}

	}
}
