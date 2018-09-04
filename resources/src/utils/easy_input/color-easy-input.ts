/// <reference path="text-easy-input.ts" />
module Utils.EasyInputModule {

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		parent?: HTMLElement;
		class?: string[];
	}

	export class ColorEasyInput extends TextEasyInput {
		protected type: string = 'color';

		protected init_view_element(parameters: IInitParameters): void {
			super.init_view_element(parameters, {
				inputType: '',
				class: 'jscolor'
			});
		}

		public get value(): any {
			return '#' + (this.view_inputs[0] as HTMLInputElement).value;
		}

		public set value(value: any) {
			(this.view_inputs[0] as any).jscolor.fromString(value.substr(1));
		}

		protected add_change_event(): void {
			super.add_change_event();
			this.view_inputs[0].addEventListener('change', this.update.bind(this));
		}

		public clear(): void {
			requestAnimationFrame(() => {
				(this.view_inputs[0] as HTMLInputElement).value = '';
				this.view_inputs[0].style.backgroundColor = '';
			});
		}
	}
}