/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../Utils/easy-html.ts" />
/// <reference path="./Point.ts" />

module GameObject {

	export interface IAbstractInitParameters {
		name?: string;
		sceneElementAttr?: any[];
		hierarchyElementAttr?: any[];
	}

	export abstract class AbstractObject {
		protected _name: string;

		public parent: AbstractObject;
		public scene_view_element: PIXI.DisplayObject;
		public hierarchy_view_element: HTMLElement;

		protected view_area_element: HTMLElement;
		protected childIconElement: HTMLElement;
		protected visibleElement: HTMLElement;
		protected typeElement: HTMLImageElement;
		protected nameElement: HTMLElement;

		protected _destroyed: boolean = false;
		public get destroyed(): boolean { return this._destroyed };

		protected _isSelected: boolean = false;
		public get isSelected(): boolean { return this._isSelected };

		constructor({
			name = 'Object',
			sceneElementAttr = [],
			hierarchyElementAttr = []
		}: IAbstractInitParameters) {
			this.create_scene_elememnt(...sceneElementAttr);
			this.create_hierarchy_element(...hierarchyElementAttr);

			this.name = name;
		}

		protected create_scene_elememnt(attr?: any) {
			this.scene_view_element = new PIXI.DisplayObject();
		}

		protected create_hierarchy_element(attr?: any) {
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

		protected option_error(key: any): void {
			console.warn('Оption does not exist. Skipped.', key, this);
		}

		public getOption(key: string|string[]): any {
			let path, option;
			if (Array.isArray(key)) {
				if (key.length == 1) {
					return this.getOption(key[0]);
				}

				let keyList = [...key];
				option = keyList.pop();
				path = keyList.reduce((_path: any, current: string) => {
					if (_path && _path[current] !== undefined) {
						return _path[current];
					} else return null;
				}, this);

				if (!path || path[option] === undefined) {
					path = keyList.reduce((_path: any, current: string) => {
						if (_path && _path[current] !== undefined) {
							return _path[current];
						} else return null;
					}, this.scene_view_element);
				}

				if (!path || path[option] === undefined) {
					this.option_error(key);
					return null;
				}
			} else {
				option = key;
				if ((this as any)[key] !== undefined) {
					path = (this as any);
				} else
				if ((this.scene_view_element as any)[key] !== undefined) {
					path = (this.scene_view_element as any);
				} else {
					this.option_error(key);
					return null;
				}
			}

			return path[option];
		}

		public setOption(key: string|string[], value: any, isPoint: boolean = false): void {
			let path, option;
			if (Array.isArray(key)) {
				if (key.length == 1) {
					return this.setOption(key[0], value, isPoint);
				}

				let keyList = [...key];
				option = keyList.pop();
				path = keyList.reduce((_path: any, current: string) => {
					if (_path && _path[current] !== undefined) {
						return _path[current];
					} else return null;
				}, this);

				if (!path || path[option] === undefined) {
					path = keyList.reduce((_path: any, current: string) => {
						if (_path && _path[current] !== undefined) {
							return _path[current];
						} else return null;
					}, this.scene_view_element);
				}

				if (!path || path[option] === undefined) {
					this.option_error(key);
					return null;
				}
			} else {
				option = key;
				if ((this as any)[key] !== undefined) {
					path = (this as any);
				} else
				if ((this.scene_view_element as any)[key] !== undefined) {
					path = (this.scene_view_element as any);
				} else {
					this.option_error(key);
					return null;
				}
			}

			if (isPoint) path[option].set(...value);
			else path[option] = value;
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
				this.visible = !this.visible;
				callback(event);
				event.stopPropagation();
			});
		}

		public destroy(): void {
			if (this.parent) (this.parent as any).remove(this);
			this.scene_view_element.destroy();
			this.hierarchy_view_element.parentNode.removeChild(this.hierarchy_view_element);
			this._destroyed = true;
		}
	}
}
