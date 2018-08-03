module Utils {

	export class EasyInput {
		protected type: string;

		constructor(
			protected view_element: HTMLInputElement,
			protected change_callback: Function
		) {
			this.add_change_event();
		}

		public get value(): any {
			if (this.type == 'checkbox') {
				return this.view_element.checked;
			} else {
				let value = this.view_element.value;
				if (this.type == 'number') return +value;
				return value;
			}
		}

		public set value(value: any) {
			if (this.type == 'checkbox') {
				this.view_element.checked = value;
			} else {
				this.view_element.value = value;
			}
		}

		protected add_change_event(): void {
			this.view_element.addEventListener('change', this.update.bind(this));
		}

		public update(): void {
			if (this.change_callback) this.change_callback(this.value);
		}
	}
}
