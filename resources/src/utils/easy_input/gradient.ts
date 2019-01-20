/// <reference path="color.ts" />
module Utils.EasyInputModule {

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		parent?: HTMLElement;
		class?: string[];
	}

	export class GradientEasyInput extends ColorEasyInput {
		protected COLOR_HEIGHT: number = 16;
		protected color_group: HTMLElement;

		protected init_children(
			view_input: any,
			parameters: IInitParameters
		): void {
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

		protected create_view_element(
			parameters: IInitParameters
		): HTMLElement {
			let view_element = super.create_view_element(parameters);
			view_element.classList.add('type-gradient');

			return view_element;
		}

		public addColor(
			color: string = '000000',
			update: boolean = true,
			create: boolean = true
		): void {
			let view_input: any;
			if (create) {
				view_input = Utils.easyHTML.createElement({
					type: 'input',
					attr: { class: 'jscolor', type: '' },
				});

				let picker = new (window as any).jscolor(view_input, { value: color });
				view_input.jscolor = picker;

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
			this.addMoveEvent(move_area, color_container);

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

		addMoveEvent(
			move_area: HTMLElement,
			color_container: HTMLElement
		): void {
			let children: HTMLElement[];
			let index: number;
			let start_position: number;

			let move_callback = (move_event: MouseEvent) => {
				if (move_event.y - start_position < -this.COLOR_HEIGHT
					&& index > 0
				) {
					let input = this.view_inputs[index];
					this.view_inputs[index] = this.view_inputs[index-1];
					this.view_inputs[index-1] = input;

					this.color_group.insertBefore(color_container, children[index-1]);

					index--;
					start_position = start_position - this.COLOR_HEIGHT;
				} else
				if (move_event.y - start_position > this.COLOR_HEIGHT
					&& index < children.length-1
				) {
					let input = this.view_inputs[index];
					this.view_inputs[index] = this.view_inputs[index+1];
					this.view_inputs[index+1] = input;

					this.color_group.insertBefore(color_container, children[index+2]);

					index++;
					start_position = start_position + this.COLOR_HEIGHT;
				} else {
					return;
				}

				children = Array.prototype.slice.call( this.color_group.children );
				this.update();
			}

			let up_callback = (up_event: MouseEvent) => {
				document.removeEventListener('mousemove', move_callback);
				document.removeEventListener('mouseup', up_callback);
			}

			move_area.addEventListener('mousedown', (down_event: MouseEvent) => {
				children = Array.prototype.slice.call( this.color_group.children );
				index = children.indexOf(color_container);
				start_position = down_event.y;
				document.addEventListener('mousemove', move_callback);
				document.addEventListener('mouseup', up_callback);
			})
		}

		removeColor(
			update: boolean = true
		): void {
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
			this.clear(false);
			if (Array.isArray(value)) {
				value.forEach((color: string, index: number) => {
					let colorHex = (window as any).tinycolor(color).toHex();
					let view_input = this.view_inputs[index] as any;

					if (view_input) {
						view_input.jscolor.fromString(colorHex);
					} else {
						this.addColor(colorHex, false);
					}
				});
				while(this.view_inputs.length > value.length) {
					this.removeColor(false);
				}
			} else {
				let colorHex = (window as any).tinycolor(value).toHex();
				let view_input = (this.view_inputs[0] as any);

				view_input.jscolor.fromString(colorHex);
			}
		}

		public clear(
			firstTo: boolean = true
		): void {
			if (firstTo) super.clear();
			while(this.view_inputs.length > 1) {
				this.removeColor(false);
			}
		}
	}
}
