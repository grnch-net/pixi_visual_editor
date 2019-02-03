module Editor {
	export abstract class AbsListItem {
		protected take: boolean;

		protected take_event_list: Function[];
		protected select_event_list: Function[];

		protected deselect: boolean;
		protected _selected: boolean;
		public get selected(): boolean {
			return this._selected
		};

		constructor() {
			this.init_class_options();
		}

		protected init_class_options(): void {
			this.take = false;
			this.take_event_list = [];
			this.select_event_list = [];
			this._selected = false;
			this.deselect = false;
		}

		protected create_view_elements(): void {
			this.init_take_event();
			this.init_select_event();
		}

		protected init_take_event(): void {
			this.addEvent('mousedown', (event: Event) => {
				this.take = true;

				let up_event = () => {
					requestAnimationFrame(() => { this.take = false; });
					document.removeEventListener('mouseup', up_event);
				}
				document.addEventListener('mouseup', up_event);

				this.take_event_list.forEach((callback: Function) => callback(event));
			});
		}

		protected init_select_event(): void {
			this.addEvent('mouseup', (event: Event) => {
				if (!this.take) return;
				this.take = false;

				if (this.deselect) {
					this.deselect = false;
					return;
				}

				this.select_event_list.forEach((callback: Function) => callback(event));
			});
		}

		public takeEvent(
			callback: Function
		): void {
			this.take_event_list.push(callback);
		}


		public selectEvent(
			callback: Function
		): void {
			this.select_event_list.push(callback);
		}

		public addEvent(
			eventType: string,
			callback: Function
		): void {}

		public removeEvent(
			eventType: string,
			callback: Function
		): void {}

		public select(): void {
			this._selected = true;
		}

		public unselect(): void {
			this._selected = false;
		}

	}
}
