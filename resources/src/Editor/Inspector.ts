
module Editor {
	export class Inspector {
		protected list: GameObject.Abstract[] = []; // Selected objects

		constructor() {

		}

		public select(scene_object: GameObject.Abstract): void {
			while(this.list.length > 0) {
				let currentObject = this.list.pop();
				currentObject.unselect();
			}

			this.add(scene_object);
		}

		public add(scene_object: GameObject.Abstract): void {
			this.list.push(scene_object);
			scene_object.select();
		}
	}
}
