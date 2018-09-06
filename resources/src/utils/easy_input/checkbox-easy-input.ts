/// <reference path="text-easy-input.ts" />
module Utils.EasyInputModule {

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		parent?: HTMLElement;
		class?: string[];
	}

	export class CheckboxEasyInput extends TextEasyInput {
		protected init_children(view_input: any, parameters: IInitParameters): void {
			this.view_inputs.push(view_input as HTMLInputElement);

			let checkmark = Utils.easyHTML.createElement({
				type: 'span',
				attr: { class: 'checkmark' }
			});

			this.label_element.appendChild(view_input);
			this.label_element.appendChild(checkmark);
		}

		protected create_label(parameters: IInitParameters): HTMLElement {
			return super.create_label(parameters, '');
		}

		protected create_view_element(parameters: IInitParameters): HTMLElement {
			let view_element = super.create_view_element(parameters);
			view_element.classList.add('checkbox');

			return view_element;
		}

		public get value(): any {
			return (this.view_inputs[0] as HTMLInputElement).checked;
		}

		public set value(value: any) {
			(this.view_inputs[0] as HTMLInputElement).checked = value;
		}

		public clear(): void {
			this.value = false;
		}
	}
}
