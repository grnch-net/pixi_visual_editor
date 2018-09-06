/// <reference path="color-easy-input.ts" />
module Utils.EasyInputModule {

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		parent?: HTMLElement;
		class?: string[];
	}

	export class GradientEasyInput extends ColorEasyInput {
		protected color_group: HTMLElement;

		protected init_children(view_input: any, parameters: IInitParameters): void {
			this.view_inputs.push(view_input);

			this.color_group = Utils.easyHTML.createElement({
				attr: { class: 'color-group' }
			});

			this.addColor('000000', false, false);

			let remove_color_button = Utils.easyHTML.createElement({
				attr: { class: 'remove-color-area' },
				innerHTML: 'Remove'
			});
			remove_color_button.addEventListener('click', () => this.removeColor());

			let add_color_button = Utils.easyHTML.createElement({
				attr: { class: 'add-color-button' },
				innerHTML: 'Add color'
			});
			add_color_button.addEventListener('click', () => {
				let lastIndex = this.view_inputs.length-1;
				let lastInput: any = this.view_inputs[lastIndex];
				this.addColor(lastInput.value);
			});

			let children = [this.color_group, remove_color_button, add_color_button];
			children.forEach(child => {
				this.view_element.appendChild(child);
			});
		}

		protected create_view_element(parameters: IInitParameters): HTMLElement {
			let view_element = super.create_view_element(parameters);
			view_element.classList.add('type-gradient');

			return view_element;
		}

		public addColor(color: string = '000000', update: boolean = true, create: boolean = true): void {
			let view_input: any;
			if (create) {
				view_input = Utils.easyHTML.createElement({
					type: 'input',
					attr: { class: 'jscolor', type: '' },
				});
				(window as any).jscolor(view_input, { value: color });

				this.view_inputs.push(view_input);
				this.add_change_event('', this.view_inputs.length-1);
			} else {
				view_input = this.view_inputs[0];
			}

			let color_container = Utils.easyHTML.createElement({
				attr: { class: 'color-object' },
			});

			let move_area = Utils.easyHTML.createElement({
				attr: { class: 'move-area' },
				innerHTML: '='
			});

			// let stop_color = Utils.easyHTML.createElement({
			// 	type: 'input',
			// 	attr: {
			// 		class: 'stop-color',
			// 		type: 'number',
			// 		min: 0,
			// 		max: 1,
			// 		step: 0.1,
			// 		value: 0
			// 	}
			// });

			color_container.appendChild(move_area);
			color_container.appendChild(view_input);
			// color_container.appendChild(stop_color);

			this.color_group.appendChild(color_container);

			if (update) this.update();
		}

		removeColor(update: boolean = true): void {
			if (this.view_inputs.length == 1) return;

			this.view_inputs.pop();
			this.color_group.removeChild(this.color_group.lastChild);

			if (update) this.update();
		}

		public get value(): any {
			let colorList: string[] = [];

			this.view_inputs.forEach((input: HTMLInputElement) => {
				colorList.push('#' + input.value);
			});
			return colorList;
		}

		public set value(value: any) {
			if (Array.isArray(value)) {
				value.forEach((color: string, index: number) => {
					if (this.view_inputs[index]) {
						(this.view_inputs[index] as any).jscolor.fromString(color.substr(1));
					} else {
						this.addColor(color, false);
					}
				});
				while(this.view_inputs.length > value.length) {
					this.removeColor(false);
				}
			} else {
				this.clear(false);
				(this.view_inputs[0] as any).jscolor.fromString(value.substr(1));
			}
		}

		public clear(firstTo: boolean = true): void {
			if (firstTo) super.clear();
			while(this.view_inputs.length > 1) {
				this.removeColor(false);
			}
		}
	}
}
