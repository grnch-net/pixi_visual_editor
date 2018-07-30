/// <reference path="../../lib.d.ts/pixi.d.ts" />
/// <reference path="../../Utils/easy-html.ts" />

module Editor.Assets {

	interface IAssetsInitParameters {
		name: string;
		imageLink: string;
		texture?: PIXI.Texture;
	}

	export class Asset {
		public name: string = 'Image';
		public texture: PIXI.Texture;

		public view_element: HTMLElement;
		protected view_name: HTMLElement;
		protected view_image: HTMLImageElement;
		protected view_touch: HTMLElement;

		constructor({
			name,
			imageLink,
			texture = null
		}: IAssetsInitParameters) {
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
			} else {
				this.view_image.onload = () => {
					let base = new PIXI.BaseTexture(this.view_image);
					this.texture = new PIXI.Texture(base);
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
	}
}
