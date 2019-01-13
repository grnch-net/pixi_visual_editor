module Editor {
	export enum EventTargetType {
		INPUT,
		SCENE,
		ASSETS,
		HIERARCHY
	}

	interface ITake {
	    type: EventTargetType;
		take?: Function;
		drop?: Function;
		args?: any;
	}

	export class EventCtrl {
		public dragType: EventTargetType = null;
		public dropArguments: any = null;
		protected dropCallback: Function = null;

		protected view_element: HTMLElement;
		protected element_half_width: number;
		protected element_half_height: number;

		constructor() {
			this.view_element = document.getElementById('drag-event');
			this.view_element.classList.add('active');
			this.element_half_width = this.view_element.clientWidth /2;
			this.element_half_height = this.view_element.clientHeight /2;
			this.view_element.classList.remove('active');
		}

		public take(down_event: MouseEvent, parameters: ITake): void {
			this.dragType = parameters.type;
			this.dropCallback = parameters.drop;
			this.dropArguments = parameters.args;

			if (parameters.take) parameters.take();

			this.view_element.classList.add('active');
			this.view_element.style.transform = `translate3d(
				${down_event.x-this.element_half_width}px,
				${down_event.y-this.element_half_height}px,
				0px
			)`;

			let move_callback = (move_event: MouseEvent) => {
				this.view_element.style.transform = `translate3d(
					${move_event.x - this.element_half_width}px,
					${move_event.y - this.element_half_height}px,
					0px
				)`;
			};
			document.addEventListener('mousemove', move_callback);

			let up_callback = (up_event: MouseEvent) => {
				requestAnimationFrame(this.drop.bind(this, up_event));
				document.removeEventListener('mousemove', move_callback);
				document.removeEventListener('mouseup', up_callback);
				this.view_element.classList.remove('active');
			};
			document.addEventListener('mouseup', up_callback);
		}

		public drag(down_event: MouseEvent, parameters: ITake): void {
			let move_callback: any;
			let up_callback: any;

			move_callback = (move_event: MouseEvent) => {
				let x: number = Math.abs(move_event.x - down_event.x);
				let y: number = Math.abs(move_event.y - down_event.y);
				if (x > 5 || y > 5) {
					up_callback();
					this.take(down_event, parameters);
				}
			};
			document.addEventListener('mousemove', move_callback);

			up_callback = () => {
				document.removeEventListener('mousemove', move_callback)
				document.removeEventListener('mouseup', up_callback)
			};
			document.addEventListener('mouseup', up_callback);
		}

		public drop(
			up_event: MouseEvent,
			endTargetType: EventTargetType = null,
			callback: Function = null
		): void {
			if (this.dragType === null) {
				this.dropCallback = null;
				return;
			} else {
				if (this.dropCallback) {
					this.dropCallback(endTargetType, this.dropArguments);
				}
				if (callback) {
					callback(this.dragType, this.dropArguments);
				}
			}

			this.dropCallback = null;
			this.dragType = null;
		}
	}
}
