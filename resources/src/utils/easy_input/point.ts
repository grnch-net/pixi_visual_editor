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

	export class PointEasyInput extends NumberEasyInput {

		protected init_view_element(
			parameters: IInitParameters
		): void {
			super.init_view_element(parameters, {
				inputType: 'number'
			});
		}

		protected init_children(
			view_input: any,
			parameters: IInitParameters
		): void {
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

			this.view_inputs.push(x_value, y_value);

			let children = [x_label, x_value, y_label, y_value];
			children.forEach(child => {
				this.view_element.appendChild(child);
			});
		}

		protected create_label(
			parameters: IInitParameters
		): HTMLElement {
			return super.create_label(parameters, '', 'div');
		}

		protected create_view_element(
			parameters: IInitParameters
		): HTMLElement {
			let view_element = super.create_view_element(parameters, 'point-area');
			return view_element;
		}

		public get value(): any {
			return [
				+(this.view_inputs[0] as HTMLInputElement).value,
				+(this.view_inputs[1] as HTMLInputElement).value
			];
		}

		protected add_change_event(): void {
			let event: string = 'input';
			this.view_inputs[0].addEventListener(event, this.update.bind(this));
			this.view_inputs[1].addEventListener(event, this.update.bind(this));
		}

		public get x(): number { return +(this.view_inputs[0] as HTMLInputElement).value; }
		public get y(): number { return +(this.view_inputs[1] as HTMLInputElement).value; }

		public set x(value: number) { (this.view_inputs[0] as HTMLInputElement).value = value.toString(); }
		public set y(value: number) { (this.view_inputs[1] as HTMLInputElement).value = value.toString(); }

	}
}
