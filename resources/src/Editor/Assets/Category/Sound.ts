/// <reference path="Abs.ts" />

module Editor.AssetCategory {

	export class Sound extends Abs {
		public uploadType: string = '.mp3, .wav';

		constructor(ctrl: Assets.Ctrl) {
			super(ctrl, 'Sound');
		}

	}
}
