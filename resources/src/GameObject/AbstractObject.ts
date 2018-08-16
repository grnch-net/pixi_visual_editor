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

		public parent: AbstractObject;
		public position: Point = new Point(0, 0, this.updatePosition.bind(this));
		public scale: Point = new Point(1, 1, this.updateScale.bind(this));
		public pivot: Point = new Point(0, 0, this.updatePivot.bind(this));

		public scene_view_element: PIXI.DisplayObject;
		public hierarchy_view_element: HTMLElement;

		protected view_area_element: HTMLElement;
		protected childIconElement: HTMLElement;
		protected visibleElement: HTMLElement;
		protected typeElement: HTMLImageElement;
		protected nameElement: HTMLElement;

		protected _isSelected: boolean = false;
		public get isSelected(): boolean { return this._isSelected };

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
			this.scene_view_element = new PIXI.DisplayObject();
		}

		protected createHierarchyElement(attr?: any) {
			this.hierarchy_view_element = Utils.easyHTML.createElement({
				type: 'div',
				attr: { class: 'object' }
			});

			this.view_area_element = Utils.easyHTML.createElement({
				type: 'div', parent: this.hierarchy_view_element,
				attr: { class: 'view-area' }
			});

			this.childIconElement = Utils.easyHTML.createElement({
				type: 'div', parent: this.view_area_element,
				attr: { class: 'child-icon' }
			});

			this.visibleElement = Utils.easyHTML.createElement({
				type: 'div', parent: this.view_area_element,
				attr: { class: 'visible active' }
			});

			this.typeElement = Utils.easyHTML.createElement({
				type: 'img', parent: this.view_area_element,
				attr: { class: 'type' }
			}) as HTMLImageElement;

			this.nameElement = Utils.easyHTML.createElement({
				type: 'div', parent: this.view_area_element,
				attr: { class: 'name' }
			});
		}

		protected changeVisible(): void {
			this.visible = !this.visible;
		}

		public get name(): string { return this._name; }
		public set name(value: string) {
			this._name = value;
			this.nameElement.innerHTML = value;
			this.scene_view_element.name = value;
		}

		public get visible(): boolean { return this._visible; }
		public set visible(value: boolean) {
			if (value == this._visible) return;
			this._visible = value;

			if (value) this.visibleElement.classList.add('active');
			else this.visibleElement.classList.remove('active');

			this.scene_view_element.visible = value;
		}

		public get alpha(): number { return this._alpha; }
		public set alpha(value: number) {
			this._alpha = value;
			this.scene_view_element.alpha = value;
		}

		public get rotation(): number { return this._rotation; }
		public set rotation(value: number) {
			this._rotation = value;
			this.scene_view_element.rotation = value;
		}

		protected updatePosition(x: number, y: number): void {
			this.scene_view_element.position.set(x, y)
		}

		protected updateScale(x: number, y: number): void {
			this.scene_view_element.scale.set(x, y)
		}

		protected updatePivot(x: number, y: number): void {
			this.scene_view_element.pivot.set(x, y)
		}

		public select(): void {
			this.hierarchy_view_element.classList.add('selected');
			this._isSelected = true;
		}

		public unselect(): void {
			this.hierarchy_view_element.classList.remove('selected');
			this._isSelected = false;
		}

		public selectEvent(callback: any): void {
			this.view_area_element.addEventListener('mouseup', (event: Event) => {
				callback(event);
				event.stopPropagation();
			});
		}

		public visibleEvent(callback: any): void {
			this.visibleElement.addEventListener('mouseup', (event: Event) => {
				this.changeVisible();
				callback(event);
				event.stopPropagation();
			});
		}
	}
}
