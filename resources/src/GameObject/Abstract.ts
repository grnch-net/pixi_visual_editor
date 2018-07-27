/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../Utils/easy-html.ts" />

module GameObject {

	class Point {
		public _x: number = 0;
		public _y: number = 0;

		constructor(
			protected update: Function
		) {}

		get x(): number { return this._x; }
		set x(value: number) { this._x = value; this.update(this._x, this._y); }

		get y(): number { return this._y; }
		set y(value: number) { this._y = value; this.update(this._x, this._y); }

		public set(x: number, y: number): void {
			this._x = x;
			this._y = y;
			this.update(this._x, this._y);
		};
	}

	interface IAbstractInitParameters {
		name?: string;
		sceneElementAttr?: any[];
		hierarchyElementAttr?: any[];
	}

	export abstract class Abstract {
		protected _name: string;
		protected _visible: boolean = true;
		protected _alpha: number = 1;
		protected _rotation: number = 0;

		public parent: PIXI.Container;
		public position: Point = new Point(this.updatePosition);
		public scale: Point = new Point(this.updateScale);
		public pivot: Point = new Point(this.updatePivot);

		public sceneElement: PIXI.DisplayObject;
		public hierarchyElement: HTMLElement;

		protected _nameElement: HTMLElement;
		protected _visibleElement: HTMLElement;

		constructor({
			name = 'Object',
			sceneElementAttr = [],
			hierarchyElementAttr = []
		}: IAbstractInitParameters) {
			this.createSceneElement(...sceneElementAttr);
			this.createHierarchyElement(...hierarchyElementAttr);

			this.name = name;
		}

		protected createSceneElement(attr?: any) {
			this.sceneElement = new PIXI.DisplayObject();
		}

		protected createHierarchyElement(attr?: any) {
			this.hierarchyElement = Utils.easyHTML.createElement({
				type: 'div',
				attr: { class: 'object' }
			});

			this._visibleElement = Utils.easyHTML.createElement({
				type: 'div', parent: this.hierarchyElement,
				attr: { class: 'visible active' }
			});

			this._nameElement = Utils.easyHTML.createElement({
				type: 'div', parent: this.hierarchyElement,
				attr: { class: 'name' }
			});
		}

		get name(): string { return this._name; }
		set name(value: string) {
			this._name = value;
			this._nameElement.innerHTML = value;
			this.sceneElement.name = value;
		}

		get visible(): boolean { return this._visible; }
		set visible(value: boolean) {
			if (value == this._visible) return;
			this._visible = value;

			if (value) this._visibleElement.classList.add('active');
			else this._visibleElement.classList.remove('active');

			this.sceneElement.visible = value;
		}

		get alpha(): number { return this._alpha; }
		set alpha(value: number) {
			this._alpha = value;
			this.sceneElement.alpha = value;
		}

		get rotation(): number { return this._rotation; }
		set rotation(value: number) {
			this._rotation = value;
			this.sceneElement.rotation = value;
		}

		protected updatePosition(x: number, y: number): void {
			this.sceneElement.position.set(x, y)
		}

		protected updateScale(x: number, y: number): void {
			this.sceneElement.scale.set(x, y)
		}

		protected updatePivot(x: number, y: number): void {
			this.sceneElement.pivot.set(x, y)
		}

		public select(): void {
			this.hierarchyElement.classList.add('selected');
		}

		public unselect(): void {
			this.hierarchyElement.classList.remove('selected');
		}

		public touchEvent(callback: any): void {
			this.hierarchyElement.addEventListener('mouseup', callback);
		}
	}
}
