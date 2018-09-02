/// <reference path="../../lib.d.ts/pixi.d.ts" />
/// <reference path="../../Utils/easy-html.ts" />

module Editor.Assets {

	interface IConstructorInitParameters {
		name: string;
		imageLink: string;
		texture?: PIXI.Texture;
	}

	export class ImageAssetObject {
		public name: string = 'Image';
		public base: PIXI.BaseTexture;
		public texture: PIXI.Texture;

		public view_element: HTMLElement;
		protected view_name: HTMLElement;
		protected view_image: HTMLImageElement;
		protected view_touch: HTMLElement;

		protected isLoad: boolean = false;
		protected onLoadCallback: Function;

		constructor({
			name,
			imageLink,
			texture = null
		}: IConstructorInitParameters) {
			if (this.name) this.name = name;

			this.create_view_elements(imageLink);
			this.initTexture(texture);

		}

		protected create_view_elements(image_link: string ): void {
			this.view_element = Utils.easyHTML.createElement({
				type: 'div',
				attr: { class: 'item', title: this.name }
			});

			this.view_image = new Image();
			this.view_image.src = image_link;
			this.view_element.appendChild(this.view_image);

			this.view_name = Utils.easyHTML.createElement({
				type: 'div', parent: this.view_element,
				attr: { class: 'name' },
				innerHTML: this.name
			});
		}

		protected initTexture(texture: PIXI.Texture): void {
			if (this.texture) {
				this.texture = texture;
				this.isLoad = true;
				if (this.onLoadCallback) this.onLoadCallback();
			} else {
				this.view_image.onload = () => {
					this.base = new PIXI.BaseTexture(this.view_image);
					this.texture = new PIXI.Texture(this.base);
					this.isLoad = true;
					if (this.onLoadCallback) this.onLoadCallback();
				}
			}
		}

		public addEvent(event: string, callback: any): void {
			if (!this.view_touch) {
				this.view_touch = Utils.easyHTML.createElement({
					type: 'div', parent: this.view_element,
					attr: { class: 'touch' }
				});
			}

			this.view_touch.addEventListener(event, callback);

		}

		public onLoad(callback: Function): void {
			this.onLoadCallback = callback;
			if (this.isLoad) this.onLoadCallback();
		}
	}
}
