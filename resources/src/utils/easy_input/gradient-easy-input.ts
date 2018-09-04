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
		protected type: string = 'gradient';
		protected color_group: HTMLElement;

		protected init_children(view_input: any, parameters: IInitParameters): void {
			this.view_inputs.push(view_input);

			this.color_group = Utils.easyHTML.createElement({
				attr: { class: 'remove-color-area' },
				innerHTML: 'Remove'
			});
			this.addColor(false);

			let remove_color_button = Utils.easyHTML.createElement({
				attr: { class: 'remove-color-area' },
				innerHTML: 'Remove'
			});

			let add_color_button = Utils.easyHTML.createElement({
				attr: { class: 'add-color-button' },
				innerHTML: 'Add color'
			});
			add_color_button.addEventListener('click', () => this.addColor());

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

		public addColor(duplicate: boolean = true): void {
			let view_input;
			if (duplicate) {
				let lastIndex = this.view_inputs.length-1;
				view_input = this.view_inputs[lastIndex].cloneNode(true) as HTMLElement;
				this.view_inputs.push(view_input);
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

			let stop_color = Utils.easyHTML.createElement({
				type: 'input',
				attr: {
					class: 'stop-color',
					type: 'number',
					min: 0,
					max: 1,
					step: 0.1,
					value: 0
				}
			})

			color_container.appendChild(move_area);
			color_container.appendChild(view_input);
			// color_container.appendChild(stop_color);

			this.color_group.appendChild(color_container);
		}

		removeColor(): void {
			this.view_inputs.pop();
			this.color_group.removeChild(this.color_group.lastChild);
		}
	}
}
