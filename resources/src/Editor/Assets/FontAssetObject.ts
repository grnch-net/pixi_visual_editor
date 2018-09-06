/// <reference path="../../lib.d.ts/pixi.d.ts" />
/// <reference path="../../Utils/easy-html.ts" />
/// <reference path="AbstractAssetObject.ts" />

module Editor.Assets {

	interface IConstructorInitParameters {
		name: string;
		link: string;
	}

	export class FontAssetObject extends AbstractAssetObject {
		public name: string;

		protected fontFace: any;
		protected image_text: HTMLElement;

		constructor({
			name,
			link,
		}: IConstructorInitParameters) {
			super({name});
			this.initFontFamily(link);
		}

		protected create_view_image_element(attr?: any): void {
			this.view_image = Utils.easyHTML.createElement({
				parent: this.view_element,
				attr: { class: 'asset-button font-type' },
			});

			this.image_text = Utils.easyHTML.createElement({
				parent: this.view_image,
				attr: { class: '' },
				innerHTML: 'A'
			});
		}

		protected initFontFamily(link: string): void {
			this.fontFace = new (window as any).FontFace(this.name, `url(${link})`, {});
			this.fontFace.load().then((loadedFace: any) => {
			    (document as any).fonts.add(loadedFace);

				this.isLoad = true;
				if (this.onLoadCallback) this.onLoadCallback();

				this.image_text.style.fontFamily = `"${this.name}"`;
			});
		}

	}
}
