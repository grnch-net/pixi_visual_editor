/// <reference path="./EventCtrl.ts" />

module Editor {
	export class AbsList {
		protected event_target_type: EventTargetType;

		constructor(
			protected eventCtrl: Editor.EventCtrl
		) {
			this.init_class_options();
		}

		protected init_class_options(): void {}

		protected addTargetEvent(
			target_element: HTMLElement
		): void {
			target_element
			.addEventListener('mouseup', (event: MouseEvent) => {
				this.eventCtrl.drop(
					event,
					this.event_target_type,
					this.onDropEvent.bind(this)
				);
			});
		}

		protected onDropEvent(
			type: EventTargetType,
			args: any
		): void {}

		protected addItemEvent(
			item: any,
			args: any[]
		): void {
			item.takeEvent((event: MouseEvent) => {
				this.eventCtrl.drag(event, {
					type: this.event_target_type,
					take: () => this.itemTakeEvent(item, args),
					drop: this.itemDropEvent.bind(this),
					args: args
				});
			});

			item.selectEvent(() => {
				let dragType = this.eventCtrl.dragType;
				if (dragType !== null) return;
				this.itemSelectEvent(item, args);
			});
		}

		protected itemTakeEvent(
			item: any,
			args: any[]
		): void {}

		protected itemDropEvent(
			type: EventTargetType,
			args: any[]
		): void {}

		protected itemSelectEvent(
			item: any,
			args: any[]
		): void {}
	}
}
