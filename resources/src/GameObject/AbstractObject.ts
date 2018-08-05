/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../Utils/easy-html.ts" />
/// <reference path="./Point.ts" />

module GameObject {

	interface IAbstractInitParameters {
		name?: string;
		sceneElementAttr?: any[];
		hierarchyElementAttr?: any[];
	}

	export abstract class AbstractObject {
		protected _name: string;
		protected _visible: boolean = true;
		protected _alpha: number = 1;
		protected _rotation: number = 0;

		public parent: PIXI.Container;
		public position: Point = new Point(0, 0, this.updatePosition.bind(this));
		public scale: Point = new Point(1, 1, this.updateScale.bind(this));
		public pivot: Point = new Point(0, 0, this.updatePivot.bind(this));

		public sceneElement: PIXI.DisplayObject;
		public hierarchyElement: HTMLElement;

		protected nameElement: HTMLElement;
		protected visibleElement: HTMLElement;

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

			this.visibleElement = Utils.easyHTML.createElement({
				type: 'div', parent: this.hierarchyElement,
				attr: { class: 'visible active' }
			});

			this.nameElement = Utils.easyHTML.createElement({
				type: 'div', parent: this.hierarchyElement,
				attr: { class: 'name' }
			});

			this.visibleElement.addEventListener('click', this.changeVisible.bind(this));
		}

		protected changeVisible(): void {
			this.visible = !this.visible;
		}

		public get name(): string { return this._name; }
		public set name(value: string) {
			this._name = value;
			this.nameElement.innerHTML = value;
			this.sceneElement.name = value;
		}

		public get visible(): boolean { return this._visible; }
		public set visible(value: boolean) {
			if (value == this._visible) return;
			this._visible = value;

			if (value) this.visibleElement.classList.add('active');
			else this.visibleElement.classList.remove('active');

			this.sceneElement.visible = value;
		}

		public get alpha(): number { return this._alpha; }
		public set alpha(value: number) {
			this._alpha = value;
			this.sceneElement.alpha = value;
		}

		public get rotation(): number { return this._rotation; }
		public set rotation(value: number) {
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
