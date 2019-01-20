/// <reference path="Abs.ts" />

module Editor.AssetObject {
	interface IConstructorInitParameters {
		name: string;
		link: string;
	}

	export class Font extends Abs {
		protected fontFace: any;
		protected image_text: HTMLElement;

		constructor({
			name,
			link,
		}: IConstructorInitParameters) {
			super({name});
			this.initFontFamily(link);
		}

		protected create_view_image_element(
			attr?: any
		): void {
			this.view_image = Utils.easyHTML.createElement({
				parent: this.view_element,
				attr: { class: 'asset-button font-type' },
			});

			this.image_text = Utils.easyHTML.createElement({
				parent: this.view_image,
				attr: { class: '' },
				innerHTML: 'Aa'
			});
		}

		protected initFontFamily(
			link: string
		): void {
			let FontFace = (window as any).FontFace;
			this.fontFace = new FontFace(this.name, `url(${link})`, {});
			this.fontFace.load().then((loadedFace: any) => {
			    (document as any).fonts.add(loadedFace);

				this.isLoad = true;
				if (this.onLoadCallback) this.onLoadCallback();

				this.image_text.style.fontFamily = `"${this.name}"`;
			});
		}

	}
}
