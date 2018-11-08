/// <reference path="../../../Utils/easy-html.ts" />

module Editor.AssetObject {

	interface IConstructorInitParameters {
		name?: string;
		viewElementAttr?: any[];
	}

	export abstract class Abs {
		public name: string;

		public view_element: HTMLElement;
		protected view_name: HTMLElement;
		protected view_image: HTMLElement;
		protected view_touch: HTMLElement;

		protected isLoad: boolean = false;
		protected onLoadCallback: Function;

		protected take: boolean = false;

		protected _selected: boolean = false;
		public get selected(): boolean { return this._selected };

		protected _destroyed: boolean = false;
		public get destroyed(): boolean { return this._destroyed };

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

		public select(): void {
			this.view_element.classList.add('selected');
			this._selected = true;
		}

		public unselect(): void {
			this.view_element.classList.remove('selected');
			this._selected = false;
		}

		public takeEvent(callback: Function) {
			this.view_touch.addEventListener('mousedown', (event: Event) => {
				this.take = true;

				let up_event = () => {
					requestAnimationFrame(() => { this.take = false; });
					document.removeEventListener('mouseup', up_event);
				}
				document.addEventListener('mouseup', up_event);

				callback(event);
				// event.stopPropagation();
			});
		}

		public selectEvent(callback: Function): void {
			this.view_touch.addEventListener('mouseup', (event: Event) => {
				if (!this.take) return;
				this.take = false;

				callback(event);
				// event.stopPropagation();
			});
		}

		public destroy(): void {
			// if (this.parent) (this.parent as any).remove(this);
			this._destroyed = true;
		}
	}
}
