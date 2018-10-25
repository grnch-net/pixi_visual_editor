/// <reference path="text.ts" />
module Utils.EasyInputModule {

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		parent?: HTMLElement;
		class?: string[];

		placeholder?: string;
		rows?: number;
	}

	export class TextareaEasyInput extends TextEasyInput {

		protected init_view_element(parameters: IInitParameters): void {
			super.init_view_element(parameters, {
				elementType: 'textarea'
			});

			let view_input: HTMLTextAreaElement = this.view_inputs[0] as HTMLTextAreaElement;
			view_input.placeholder = parameters.placeholder;
			view_input.rows = parameters.rows;
		}
	}
}
