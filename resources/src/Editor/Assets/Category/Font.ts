/// <reference path="Abs.ts" />
/// <reference path="../Object/Font.ts" />

module Editor.AssetCategory {

	export class Font extends Abs {
		public uploadType: string = '.ttf, .woff, .woff2';

		constructor(ctrl: Assets.Ctrl) {
			super(ctrl, 'Font');
		}

		public upload(event: Event): null {
			let files = super.upload(event);

			if (!files) return;
			let new_assets: any[] = [];

			let load_count = 0;
			let onLoad = () => {
				load_count++;
				if (load_count == new_assets.length) {
					this.ctrl.editor.inspector.addNewFontFamily(new_assets);
				}
			}

			for(let name in files) {
				let link = URL.createObjectURL(files[name]);

				let asset = new AssetObject.Font({name, link});
				asset.onLoad(onLoad);

				this.add_asset_event(asset);
				this.item_list[asset.name] = asset;
				this.view_element.appendChild(asset.view_element);
				new_assets.push(asset.name);
			}

		}

	}
}
