/// <reference path="text.ts" />
module Utils.EasyInputModule {

	export class TextureEasyInput extends TextEasyInput {
		protected asset: any;
		protected view_overlay: HTMLElement;

		protected init_view_element(
			parameters: ITextInitParameters
		): void {
			super.init_view_element(parameters, {
				inputType: 'text'
			});

			this.view_overlay = Utils.easyHTML.createElement({
				attr: { class: 'attr-overlay' }
			});

			this.view_element.appendChild(this.view_overlay);
		}

		public get value(): any {
			return this.asset;
		}

		public set value(
			value: any
		) {
			let asset_name: string;

			if (!value) {
				this.asset = null;
				asset_name = '';
			} else {
				this.asset = value;
				asset_name = value.name;
				this.update();
			}

			this.view_inputs.forEach((input: HTMLInputElement) => {
				input.value = asset_name;
			});
		}

		protected add_change_event(
			event: string = 'input'
		): void {
			// this.view_inputs[0].addEventListener(event, this.update.bind(this));
		}

		public update(): void {
			if (this.change_callback) this.change_callback(this.asset);
		}

		public clear(): void {
			this.value = null;
		}

		public select(): void {
			this.view_overlay.classList.add('select');
		}

		public unselect(): void {
			this.view_overlay.classList.remove('select');
		}
	}
}
