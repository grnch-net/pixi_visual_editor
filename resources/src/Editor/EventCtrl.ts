module Editor {
	export enum eventTargetType {
		ASSETS,
		HIERARCHY
	}

	export class EventCtrl {
		public dragType: eventTargetType = null;

		public take(type: eventTargetType = null): void {
			this.dragType = type;
			switch(type) {
				case eventTargetType.ASSETS:

					break
				case eventTargetType.HIERARCHY:

					break;
			}
		}

		public drop(type: eventTargetType = null): void {
			switch(type) {
				case eventTargetType.ASSETS:

					break
				case eventTargetType.HIERARCHY:

					break;
			}
			this.dragType = null;
		}
	}
}
