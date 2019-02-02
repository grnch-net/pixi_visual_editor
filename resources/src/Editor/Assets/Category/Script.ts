/// <reference path="Abs.ts" />
/// <reference path="../Object/Script.ts" />

module Editor.AssetCategory {

	export class Script extends Abs {
		protected item_list: {
			[key: string]: AssetObject.Script
		};

		constructor(
			ctrl: Assets.Ctrl
		) {
			super(ctrl, 'Script');
		}

		protected init_class_options(): void {
			super.init_class_options();
			this.uploadType = '.js';
		}

		public upload(
			event: Event
		): null {
			let files: any = super.upload(event);

			if (!files) return;

			for(let name in files) {
				let link: string = URL.createObjectURL(files[name]);
				let asset = new AssetObject.Script({name, link});
				// asset.onLoad(() => {});

				this.addItemEvent(asset);
				this.item_list[asset.name] = asset;
				this.view_element.appendChild(asset.view_element);
			}

		}
	}
}
