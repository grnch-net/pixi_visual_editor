/// <reference path="../../lib.d.ts/pixi.d.ts" />
/// <reference path="../../Utils/easy-html.ts" />

module Editor.Assets {

	interface IConstructorInitParameters {
		name?: string;
		viewElementAttr?: any[];
	}

	export abstract class AbstractAssetObject {
		public name: string;

		public view_element: HTMLElement;
		protected view_name: HTMLElement;
		protected view_image: HTMLElement;
		protected view_touch: HTMLElement;

		protected isLoad: boolean = false;
		protected onLoadCallback: Function;

		constructor({
			name = 'Asset object',
			viewElementAttr = [],
		}: IConstructorInitParameters) {
			this.name = name;

			this.create_view_elements(...viewElementAttr);
		}

		protected create_view_elements(attr?: any): void {
			this.view_element = Utils.easyHTML.createElement({
				type: 'div',
				attr: { class: 'item', title: this.name }
			});

			this.create_view_image_element(attr);

			this.view_name = Utils.easyHTML.createElement({
				parent: this.view_element,
				attr: { class: 'name' },
				innerHTML: this.name
			});
		}

		protected create_view_image_element(attr?: any): void {
			this.view_image = Utils.easyHTML.createElement({
				parent: this.view_element,
				attr: { class: 'asset-button' },
			});

			let image_text = Utils.easyHTML.createElement({
				parent: this.view_image,
				innerHTML: '?'
			});
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
