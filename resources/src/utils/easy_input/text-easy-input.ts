/// <reference path="../../Utils/easy-html.ts" />
module Utils.EasyInputModule {

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		parent?: HTMLElement;
		class?: string[];
	}

	export interface IViewInputParameters {
		elementType?: string;
		inputType?: string;
		class?: string;
	}

	export class TextEasyInput {
		protected type: string = 'text';
		protected _readonly: boolean;
		protected view_inputs: HTMLElement[] = [];
		protected label_element: HTMLElement;

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

				this._readonly = (this.view_inputs[0] as HTMLInputElement).readOnly;
			} else {
				this.init_view_element(parameters);

				parameters.class.forEach((_class: string) => {
					this.view_element.classList.add(_class);
				});

				this.view_element.dataset.key = parameters.key;

				if (parameters.parent) {
					parameters.parent.appendChild(this.view_element);
				}
			}

			this.add_change_event();
		}

		protected init_view_element(
			parameters: IInitParameters,
			viewInputAttr: IViewInputParameters = {}
		): void {
			let view_input = Utils.easyHTML.createElement({
				type: viewInputAttr.elementType || 'input',
				attr: {
					class: viewInputAttr.class || '',
				}
			}) as HTMLElement;

			if (!viewInputAttr.elementType) {
				if (viewInputAttr.inputType !== undefined) {
					(view_input as HTMLInputElement).type = viewInputAttr.inputType;
				} else {
					(view_input as HTMLInputElement).type = this.type;
				}
			}

			if (parameters.label == false) {
				view_input.classList.add('no-label');
				this.view_element = view_input;
			} else {
				this.view_element = this.create_view_element(parameters);

				this.label_element = this.create_label(parameters);
				this.view_element.appendChild(this.label_element);

				this.init_children(view_input, parameters);
			}
		}

		protected init_children(view_input: any, parameters: IInitParameters): void {
			this.view_inputs.push(view_input as HTMLInputElement);
			this.view_element.appendChild(view_input);
		}

		protected create_label(parameters: IInitParameters, endText: string = ':', labelType = 'span'): HTMLElement {
			let label_text: string;
			if (parameters.label && typeof parameters.label == 'string') {
				label_text = parameters.label;
			} else {
				let _text = parameters.key;
				label_text = _text.charAt(0).toUpperCase() + _text.substr(1);
				label_text += endText;
			}

			let label_element = Utils.easyHTML.createElement({
				type: labelType,
				innerHTML: label_text, attr: { class: 'attr-label' }
			});

			return label_element;
		}

		protected create_view_element(parameters: IInitParameters, elemetnClass: string = 'input-area'): HTMLElement {
			let view_element = Utils.easyHTML.createElement({
				attr: { class: elemetnClass}
			});

			return view_element;
		}

		public get readonly(): boolean { return this._readonly; }
		public set readonly(value: boolean) {
			this._readonly = value;

			this.view_inputs.forEach((input: HTMLInputElement) => {
				input.readOnly = value;
			});
		}

		public get value(): any {
			return (this.view_inputs[0] as HTMLInputElement).value;
		}

		public set value(value: any) {
			let text: string;
			if (typeof value != 'string') {
				if (value.toString) {
					text = value.toString();
				} else {
					console.warn('The value is not a string type and can not be converted to a string. Skipped.', value);
					return
				}
			} else {
				text = value;
			}

			this.view_inputs.forEach((input: HTMLInputElement) => {
				input.value = text;
			});
		}

		protected add_change_event(event: string = 'input'): void {
			this.view_inputs[0].addEventListener(event, this.update.bind(this));
		}

		public update(): void {
			if (this.change_callback) this.change_callback(this.value);
		}

		public clear(): void {
			this.value = '';
		}

	}
}
