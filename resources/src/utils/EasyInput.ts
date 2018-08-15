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
		placeholder?: string;
		rows?: string;
	}

	export class EasyInput {
		protected type: string;
		protected _readonly: boolean;
		protected view_inputs: HTMLElement[] = [];

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

				this.type = (this.view_inputs[0] as HTMLInputElement).type;
				this._readonly = (this.view_inputs[0] as HTMLInputElement).readOnly;
			} else {
				this.type = parameters.type || 'text';
				this.init_view_element(parameters);
			}

			this.add_change_event();

			if (this.type != 'point') {
				delete this.x;
				delete this.y;
			}
		}

		protected init_view_element(parameters: IInitParameters): void {
			let element_type: string = 'input';
			let input_type: string;
			let input_class: string;

			if (this.type == 'textarea') { element_type = 'textarea'; } else
			if (this.type == 'select') { element_type = 'select'; } else
			if (this.type == 'point') { input_type = 'number'; } else
			if (this.type == 'color') {
				input_type = '';
				input_class = 'jscolor';
			} else {
				input_type = this.type;
			}

			let view_input = Utils.easyHTML.createElement({
				type: element_type,
				attr: {
					class: input_class,
					type: input_type,
					placeholder: parameters.placeholder,
					rows: parameters.rows
				}
			}) as HTMLElement;

			if (parameters.step) {
				(view_input as HTMLInputElement).step = parameters.step.toString();
			}

			let children: HTMLElement[] = [];
			if (this.type == 'point') {
				children = this.create_point_elements(view_input as HTMLInputElement);
			} else
			if (this.type == 'checkbox') {
				children = this.create_checkbox_elements(view_input as HTMLInputElement);
			} else
			if (this.type == 'select') {
				children = this.create_select_elements(view_input as HTMLSelectElement, parameters.values);
			} else {
				this.view_inputs.push(view_input as HTMLInputElement);
				children.push(view_input);
			}


			if (parameters.label == false) {
				view_input.classList.add('no-label');
				this.view_element = view_input;

				if (parameters.parent) {
					parameters.parent.appendChild(view_input);
				}
			} else {
				this.view_element = this.create_view_element(parameters);

				let label_element = this.create_label(parameters);
				this.view_element.appendChild(label_element);

				children.forEach(child => {
					this.view_element.appendChild(child);
				});
			}

			parameters.class.forEach((_class: string) => {
				this.view_element.classList.add(_class);
			});

			this.view_element.dataset.key = parameters.key;
		}

		protected create_point_elements(view_input: HTMLInputElement): HTMLElement[] {
			let x_label = Utils.easyHTML.createElement({
				type: 'span',
				innerHTML: 'x:', attr: { class: 'axis x' }
			});
			let x_value = view_input;

			let y_label = Utils.easyHTML.createElement({
				type: 'span',
				innerHTML: 'y:', attr: { class: 'axis y' }
			});
			let y_value = view_input.cloneNode() as HTMLInputElement;

			let children = [x_label, x_value, y_label, y_value];
			this.view_inputs.push(x_value, y_value);

			return children;
		}

		protected create_checkbox_elements(view_input: HTMLInputElement): HTMLElement[] {
			this.view_inputs.push(view_input);

			let checkmark = Utils.easyHTML.createElement({
				type: 'span',
				attr: { class: 'checkmark' }
			}) as HTMLInputElement;

			return [view_input, checkmark];
		}

		protected create_select_elements(view_input: HTMLSelectElement, values: any): HTMLElement[] {
			for(let key in values) {
				let index = (values as any)[key];
				let option = document.createElement("option");
				option.text = key;
				option.value = values[key];
				view_input.add(option);
			}

			this.view_inputs.push(view_input);
			return [view_input];
		}

		protected create_label(parameters: IInitParameters): HTMLElement {
			let label_text: string;
			if (parameters.label && typeof parameters.label == 'string') {
				label_text = parameters.label;
			} else {
				let _text = parameters.key;
				label_text = _text.charAt(0).toUpperCase() + _text.substr(1);
				if (this.type == 'checkbox') {}
				else if (this.type == 'point') {}
				else label_text += ':';
			}

			let label_type = (this.type == 'point')? 'div':'span';

			let label_element = Utils.easyHTML.createElement({
				type: label_type,
				innerHTML: label_text, attr: { class: 'attr-label' }
			});

			return label_element;
		}

		protected create_view_element(parameters: IInitParameters): HTMLElement {
			let view_element = Utils.easyHTML.createElement({
				parent: parameters.parent,
				attr: {}
			});

			let elementClass: string = 'input-area';
			if (this.type == 'point') elementClass = 'point-area';
			view_element.classList.add(elementClass);
			if (this.type == 'checkbox') {
				view_element.classList.add('checkbox');
			}

			return view_element;
		}

		public get readonly(): boolean { return this._readonly; }
		public set readonly(value: boolean) {
			this._readonly = value;

			if (this.type == 'select') return;
			this.view_inputs.forEach((input: HTMLInputElement) => {
				input.readOnly = value;
			});
		}

		public get value(): any {
			if (this.type == 'checkbox') {
				return (this.view_inputs[0] as HTMLInputElement).checked;
			} else
			if (this.type == 'point') {
				return [
					+(this.view_inputs[0] as HTMLInputElement).value,
					+(this.view_inputs[1] as HTMLInputElement).value
				];
			} else
			if (this.type == 'color') {
				return '#' + (this.view_inputs[0] as HTMLInputElement).value;
			} else {
				let value = (this.view_inputs[0] as HTMLInputElement).value;
				if (this.type == 'number') return +value;
				return value;
			}
		}

		public set value(value: any) {
			if (this.type == 'color') {
				(this.view_inputs[0] as any).jscolor.fromString(value.substr(1));
			} else
			if (this.type == 'checkbox') {
				(this.view_inputs[0] as HTMLInputElement).checked = value;
			} else {
				// this.view_inputs[0].value = value;
				this.view_inputs.forEach((input: HTMLInputElement) => {
					input.value = value;
				});
			}
		}

		protected add_change_event(): void {
			let event: string = 'input';
			if (this.type == 'select') event = 'change';
			this.view_inputs[0].addEventListener(event, this.update.bind(this));

			if (this.type == 'color') {
				this.view_inputs[0].addEventListener('change', this.update.bind(this));
			} else
			if (this.type == 'point') {
				this.view_inputs[1].addEventListener(event, this.update.bind(this));
			}
		}

		public update(): void {
			if (this.change_callback) this.change_callback(this.value);
		}

		public clear(): void {
			if (this.type == 'color') {
				requestAnimationFrame(() => {
					(this.view_inputs[0] as HTMLInputElement).value = '';
					this.view_inputs[0].style.backgroundColor = '';
				});
			} else
			if (this.type == 'checkbox') {
				this.value = false;
			} else
			if (this.type == 'select') {
				(this.view_inputs[0] as any).selectedIndex = -1;
			} else {
				this.value = '';
			}
		}

		public get x(): number { return +(this.view_inputs[0] as HTMLInputElement).value; }
		public get y(): number { return +(this.view_inputs[1] as HTMLInputElement).value; }

		public set x(value: number) { (this.view_inputs[0] as HTMLInputElement).value = value.toString(); }
		public set y(value: number) { (this.view_inputs[1] as HTMLInputElement).value = value.toString(); }
	}
}
