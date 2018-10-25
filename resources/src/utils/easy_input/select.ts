/// <reference path="text.ts" />
module Utils.EasyInputModule {

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		parent?: HTMLElement;
		class?: string[];

		values?: any;
	}

	export class SelectEasyInput extends TextEasyInput {

		protected init_view_element(parameters: IInitParameters): void {
			super.init_view_element(parameters, {
				elementType: 'select'
			});
		}

		protected init_children(view_input: any, parameters: IInitParameters): void {
			this.view_inputs.push(view_input);
			this.updateSelect(parameters.values)

			this.view_element.appendChild(view_input);
		}

		protected create_select_option(label: string, value: string): HTMLOptionElement {
			let option = document.createElement("option");
			option.text = label;
			option.value = value;
			return option;
		}

		public set readonly(value: boolean) {
			this._readonly = value;

			(this.view_inputs[0] as HTMLSelectElement).disabled = value;
		}

		protected add_change_event(): void {
			super.add_change_event('change');
		}

		public clear(): void {
			(this.view_inputs[0] as HTMLSelectElement).selectedIndex = -1;
		}

		public updateSelect(values: any): void {
			let view_input = this.view_inputs[0] as HTMLSelectElement;
			while(view_input.lastChild) {
				view_input.removeChild(this.view_inputs[0].lastChild);
			}

			if (Array.isArray(values)) {
				values.forEach((value: string) => {
					let option = this.create_select_option(value, value);
					view_input.add(option);
				})
			} else {
				for(let key in values) {
					let option = this.create_select_option(key, values[key]);
					view_input.add(option);
				}
			}
		}
	}
}
