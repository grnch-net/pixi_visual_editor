/// <reference path="Abs.ts" />
/// <reference path="../Object/Script.ts" />

module Editor.AssetCategory {

	export class Script extends Abs {
		public uploadType: string = '.js';

		constructor(ctrl: Assets.Ctrl) {
			super(ctrl, 'Script');
		}

		public upload(event: Event): null {
			let files = super.upload(event);

			if (!files) return;

			for(let name in files) {
				let link = URL.createObjectURL(files[name]);

				let asset = new AssetObject.Script({name, link});
				// asset.onLoad(() => {});

				this.add_asset_event(asset);
				this.item_list[asset.name] = asset;
				this.view_element.appendChild(asset.view_element);
			}

		}
	}
}
