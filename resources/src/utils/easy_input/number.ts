/// <reference path="text.ts" />
module Utils.EasyInputModule {

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		parent?: HTMLElement;
		class?: string[];

		step?: number;
		min?: number;
		max?: number;
	}

	export class NumberEasyInput extends TextEasyInput {

		protected init_view_element(
			parameters: IInitParameters,
			viewInputAttr: IViewInputParameters = {}
		): void {
			super.init_view_element(parameters, viewInputAttr);

			if (typeof parameters.step == 'number') {
				this.view_inputs.forEach((input: HTMLInputElement) => {
					input.step = parameters.step.toString();
				});
			}

			if (typeof parameters.min == 'number') {
				this.view_inputs.forEach((input: HTMLInputElement) => {
					input.min = parameters.min.toString();
				});
			}

			if (typeof parameters.max == 'number') {
				this.view_inputs.forEach((input: HTMLInputElement) => {
					input.max = parameters.max.toString();
				});
			}
		}

		public get value(): any {
			return +(this.view_inputs[0] as HTMLInputElement).value;
		}

		public set value(value: any) {
			this.view_inputs.forEach((input: HTMLInputElement) => {
				input.value = value;
			});
		}

	}
}
