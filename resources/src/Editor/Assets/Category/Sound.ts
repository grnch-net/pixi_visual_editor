/// <reference path="Abs.ts" />

module Editor.AssetCategory {

	export class Sound extends Abs {
		// protected item_list: { [key: string]: AssetObject.Sound };

		constructor(
			ctrl: Assets.Ctrl
		) {
			super(ctrl, 'Sound');
		}

		protected init_class_options(): void {
			super.init_class_options();
			this.uploadType = '.mp3, .wav';
		}

	}
}
