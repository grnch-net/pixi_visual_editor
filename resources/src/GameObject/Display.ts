/// <reference path="./Abs.ts" />

module GameObject {

	export let displayOptions = [
		{ key: 'name', label: false },
		{ key: 'visible', type: 'checkbox' },
		{ key: 'alpha', type: 'number', step: 0.1, min: 0, max: 1 },
		{ key: 'rotation', type: 'number' },
		{ key: 'position', type: 'point' },
		{ key: 'scale', type: 'point', step: 0.1 },
		{ key: 'pivot', type: 'point' },
	];

	export class Display extends Abs {
		public scene_view_element: PIXI.DisplayObject;

		constructor(
			parameters: IAbsInitParameters
		) {
			if (!parameters.name) parameters.name = 'DisplayObject';
			super(parameters);
		}

		protected create_scene_elememnt(
			attr?: any
		): void {
			this.scene_view_element = new PIXI.DisplayObject();
		}

		public get name(): string { return this._name; }
		public set name(value: string) {
			this._name = value;
			this.nameElement.innerHTML = value;
			this.scene_view_element.name = value;
		}

		public get visible(): boolean {
			return this.scene_view_element.visible;
		}
		public set visible(value: boolean) {
			if (value) this.visibleElement.classList.add('active');
			else this.visibleElement.classList.remove('active');

			this.scene_view_element.visible = value;
		}

		public get rotation(): number {
			return this.scene_view_element.rotation * 180 / Math.PI;
		}
		public set rotation(value: number) {
			this.scene_view_element.rotation = value * Math.PI / 180;
		}

	}
}
