/// <reference path="../../../Utils/easy-html.ts" />
/// <reference path="../../abs-list-object.ts" />

module Editor.AssetObject {

	interface IConstructorInitParameters {
		name?: string;
		viewElementAttr?: any[];
	}

	export abstract class Abs extends AbsListObject {
		public name: string;

		public view_element: HTMLElement;
		protected view_name: HTMLElement;
		protected view_image: HTMLElement;
		protected view_touch: HTMLElement;

		protected isLoad: boolean = false;
		protected onLoadCallback: Function;

		protected _destroyed: boolean = false;
		public get destroyed(): boolean { return this._destroyed };

		constructor({
			name = 'Asset object',
			viewElementAttr = [],
		}: IConstructorInitParameters) {
			super();

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

			this.create_view_touch();
			super.create_view_elements();
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

		protected create_view_touch() {
			this.view_touch = Utils.easyHTML.createElement({
				type: 'div', parent: this.view_element,
				attr: { class: 'touch' }
			});
		}

		public onLoad(callback: Function): void {
			this.onLoadCallback = callback;
			if (this.isLoad) this.onLoadCallback();
		}

		public select(): void {
			super.select();
			this.view_element.classList.add('selected');
		}

		public unselect(): void {
			super.unselect();
			this.view_element.classList.remove('selected');
		}

		public addEvent(event: string, callback: any): void {
			// if (!this.view_touch) this.create_view_touch();
			this.view_touch.addEventListener(event, callback);
		}

		public destroy(): void {
			// if (this.parent) (this.parent as any).remove(this);
			this._destroyed = true;
		}
	}
}
