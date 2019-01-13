module Editor {
	export abstract class AbsListObject {
		protected take: boolean = false;

		protected take_event_list: Function[] = [];
		protected select_event_list: Function[] = [];

		protected _selected: boolean = false;
		public get selected(): boolean { return this._selected };

		constructor() {

		}

		protected create_view_elements(): void {
			this.init_take_event();
			this.init_select_event();
		}

		protected init_take_event() {
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

		protected init_select_event() {
			this.addEvent('mouseup', (event: Event) => {
				if (!this.take) return;
				this.take = false;

				this.select_event_list.forEach((callback: Function) => callback(event));
			});
		}

		public takeEvent(callback: Function) {
			this.take_event_list.push(callback);
		}


		public selectEvent(callback: Function): void {
			this.select_event_list.push(callback);
		}

		public addEvent(eventType: string, callback: Function) {}

		public removeEvent(eventType: string, callback: Function) {}

		public select(): void {
			this._selected = true;
		}

		public unselect(): void {
			this._selected = false;
		}

	}
}
