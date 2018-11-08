module Editor {
	export enum EventTargetType {
		INPUT,
		SCENE,
		ASSETS,
		HIERARCHY
	}

	export class EventCtrl {
		public dragType: EventTargetType = null;
		protected dropCallback: Function = null;

		public take(down_event: MouseEvent, parameters: { type: EventTargetType, drop?: Function }): void {
			this.dragType = parameters.type;
			this.dropCallback = parameters.drop;

			switch(parameters.type) {
				case EventTargetType.SCENE:

					break
				case EventTargetType.ASSETS:

					break
				case EventTargetType.HIERARCHY:

					break;
			}

			let up_callback = (up_event: MouseEvent) => {
				requestAnimationFrame(this.drop.bind(this, up_event));
				document.removeEventListener('mouseup', up_callback)
			}
			document.addEventListener('mouseup', up_callback);
		}

		public drag(down_event: MouseEvent, parameters: { type: EventTargetType, take?: Function, drop?: Function }): void {
			let move_callback: any;
			let up_callback: any;

			move_callback = (move_event: MouseEvent) => {
				console.warn('move');
				let x: number = Math.abs(move_event.x - down_event.x);
				let y: number = Math.abs(move_event.y - down_event.y);
				if (x > 10 || y > 10) {
					console.warn('take');
					up_callback();
					if (parameters.take) parameters.take();
					this.take(down_event, parameters);
				}
			};
			document.addEventListener('mousemove', move_callback);

			up_callback = () => {
				console.warn('up');
				document.removeEventListener('mousemove', move_callback)
				document.removeEventListener('mouseup', up_callback)
			};
			document.addEventListener('mouseup', up_callback);
		}

		public drop(up_event: MouseEvent, endTargetType: EventTargetType = null): void {
			switch(this.dragType) {
				case EventTargetType.SCENE:

					break
				case EventTargetType.ASSETS:

					break
				case EventTargetType.HIERARCHY:

					break;
			}

			if (this.dragType === null) {
				this.dropCallback = null;
				return;
			}

			if (this.dropCallback) this.dropCallback(endTargetType);
			this.dropCallback = null;
			this.dragType = null;
		}
	}
}
