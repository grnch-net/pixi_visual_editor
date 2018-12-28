/// <reference path="text.ts" />
module Utils.EasyInputModule {

	export class TextureEasyInput extends TextEasyInput {
		protected asset: any;

		protected init_view_element(parameters: ITextInitParameters): void {
			super.init_view_element(parameters, {
				inputType: 'text'
			});
		}

		public get value(): any {
			return this.asset;
		}

		public set value(value: any) {
			let _value: string;

			if (!value) {
				this.asset = null;
				_value = '';
			} else {
				this.asset = value;
				_value = value.name;
			}

			this.view_inputs.forEach((input: HTMLInputElement) => {
				input.value = _value;
			});
		}

		protected add_change_event(event: string = 'input'): void {
			// this.view_inputs[0].addEventListener(event, this.update.bind(this));
		}

		public clear(): void {
			this.value = null;
		}

	}
}
