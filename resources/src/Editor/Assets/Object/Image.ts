/// <reference path="../../../lib.d.ts/pixi.d.ts" />
/// <reference path="Abs.ts" />

module Editor.AssetObject {

	interface IConstructorInitParameters {
		name: string;
		imageLink: string;
		texture?: PIXI.Texture;
	}

	export class Image extends Abs {
		public base: PIXI.BaseTexture;
		public texture: PIXI.Texture;

		protected view_image: HTMLImageElement;

		constructor({
			name,
			imageLink,
			texture = null
		}: IConstructorInitParameters) {
			super({
				name,
				viewElementAttr: [imageLink]
			});

			this.initTexture(texture);
		}

		protected create_view_image_element(image_link: string): void {
			this.view_image = document.createElement('img');
			this.view_image.src = image_link;
			this.view_element.appendChild(this.view_image);
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

	}
}