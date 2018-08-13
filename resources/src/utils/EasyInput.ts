/// <reference path="../Utils/easy-html.ts" />
module Utils {

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		step?: number;
		values?: any;
		parent?: HTMLElement;
		class?: string[];
	}

	export class EasyInput {
		protected type: string;
		protected _readonly: boolean;
		protected view_inputs: HTMLInputElement[] = [];

		constructor(
			parameters: IInitParameters,
			protected change_callback: Function,
			public view_element?: HTMLElement,
		) {
			if (view_element) {
				if (this.view_element instanceof HTMLInputElement) {
					this.view_inputs = [this.view_element];
				} else {
					this.view_inputs = [this.view_element.querySelector('input')];
				}

				this.type = this.view_inputs[0].type;
				this._readonly = this.view_inputs[0].readOnly;
			} else {
				this.create_view_element(parameters);
			}

			this.add_change_event();
		}

		protected create_view_element(parameters: IInitParameters): void {
			let type: string = 'input';
			let input_type: string = 'text';

			if (parameters.type == 'select') { type = 'select'; } else
			if (parameters.type == 'point') { input_type = 'number'; }
			else { input_type = parameters.type; }

			let view_input = Utils.easyHTML.createElement({
				type,
				attr: { class: '', type: input_type }
			}) as HTMLInputElement;

			if (parameters.step) {
				view_input.step = parameters.step.toString();
			}

			let children: HTMLElement[] = [];
			if (parameters.type == 'point') {
				let x_label = Utils.easyHTML.createElement({
					innerHTML: 'x:', attr: { class: 'axis' }
				});
				let x_value = view_input;

				let y_label = Utils.easyHTML.createElement({
					innerHTML: 'y:', attr: { class: 'axis' }
				});
				let y_value = view_input.cloneNode() as HTMLInputElement;

				children.push(x_label, x_value, y_label, y_value);

				this.view_inputs.push(x_value, y_value);
			} else {
				this.view_inputs.push(view_input);
				children.push(view_input);
			}


			if (parameters.label == false) {
				view_input.classList.add('no-label');
				this.view_element = view_input;

				if (parameters.parent) {
					parameters.parent.appendChild(view_input);
				}
			} else {
				this.view_element = Utils.easyHTML.createElement({
					parent: parameters.parent,
					attr: {}
				});

				let elementClass: string = 'input-area';
				if (parameters.type == 'point') elementClass = 'point-area';
				this.view_element.classList.add(elementClass);


				let label_text: string;
				if (parameters.label && typeof parameters.label == 'string') {
					label_text = parameters.label;
				} else {
					let _text = parameters.key;
					label_text = _text.charAt(0).toUpperCase() + _text.substr(1);
				}
				let label_element = Utils.easyHTML.createElement({
					innerHTML: label_text, attr: { class: 'input-label' }
				});

				this.view_element.appendChild(label_element);

				children.forEach(child => {
					this.view_element.appendChild(child);
				});
			}

			parameters.class.forEach((_class: string) => {
				this.view_element.classList.add(_class);
			});
		}

		public get readonly(): boolean { return this._readonly; }
		public set readonly(value: boolean) {
			this._readonly = value;
			this.view_inputs.forEach((input) => {
				input.readOnly = value;
			});
		}

		public get value(): any {
			if (this.type == 'checkbox') {
				return this.view_inputs[0].checked;
			} else
			if (this.type == 'point') {
				let values: number[] = [];

			} else {
				let value = this.view_inputs[0].value;
				if (this.type == 'number') return +value;
				return value;
			}
		}

		public set value(value: any) {
			if (this.type == 'checkbox') {
				this.view_inputs[0].checked = value;
			} else {
				this.view_inputs[0].value = value;
			}
		}

		protected add_change_event(): void {
			this.view_inputs[0].addEventListener('input', this.update.bind(this));
		}

		public update(): void {
			if (this.change_callback) this.change_callback(this.value);
		}
	}
}
