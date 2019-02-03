/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../Utils/easy-html.ts" />
/// <reference path="../Editor/abs-list-item.ts" />

module GameObject {

	export enum InsertType {
		BEFORE,
		AFTER
	}

	export interface IAbsInitParameters {
		name?: string;
		sceneElementAttr?: any[];
		hierarchyElementAttr?: any[];
	}

	export abstract class Abs extends Editor.AbsListItem {
		protected _name: string;

		public customName: string;
		public parent: Abs;
		public scene_view_element: any;
		public hierarchy_view_element: HTMLElement;
		public insertType: InsertType;

		protected view_area_element: HTMLElement;
		protected childIconElement: HTMLElement;
		protected visibleElement: HTMLElement;
		protected typeElement: HTMLImageElement;
		protected nameElement: HTMLElement;

		protected visible_events: Function[];
		protected insert_event: EventListener;

		protected _destroyed: boolean;
		public get destroyed(): boolean {
			return this._destroyed;
		};

		constructor({
			name = 'Object',
			sceneElementAttr = [],
			hierarchyElementAttr = []
		}: IAbsInitParameters) {
			super();
			this.create_scene_elememnt(...sceneElementAttr);
			this.create_hierarchy_element(...hierarchyElementAttr);

			this.name = name;

			this.create_view_elements();
			this.init_visible_event();
		}

		protected init_class_options(): void {
			super.init_class_options();
			this.customName = '';
			this.visible_events = [];
			this._destroyed = false;
		}

		protected create_scene_elememnt(
			attr?: any
		): void {
			this.scene_view_element = null;
		}

		protected create_hierarchy_element(
			attr?: any
		): void {
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
				attr: { class: 'visible' }
			});
			if (this.scene_view_element) {
				this.visibleElement.classList.add('active');
			}

			this.typeElement = Utils.easyHTML.createElement({
				type: 'img', parent: this.view_area_element,
				attr: { class: 'type' }
			}) as HTMLImageElement;

			this.nameElement = Utils.easyHTML.createElement({
				type: 'div', parent: this.view_area_element,
				attr: { class: 'name' }
			});
		}

		public get name(): string {
			return this._name;
		}
		public set name(value: string) {
			this._name = value;
			this.nameElement.innerHTML = value;
			if (this.scene_view_element) {
				this.scene_view_element.name = value;
			}
		}

		public get visible(): boolean {
			if (this.scene_view_element) {
				return this.scene_view_element.visible;
			}
			return null;
		}
		public set visible(value: boolean) {
			if (!this.scene_view_element) return;

			if (value) this.visibleElement.classList.add('active');
			else this.visibleElement.classList.remove('active');

			this.scene_view_element.visible = value;
		}

		protected option_error(
			key: any
		): void {
			console.warn('Оption does not exist. Skipped.', key, this);
		}

		public getOption(
			key: string|string[]
		): any {
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

		public setOption(
			key: string|string[],
			value: any,
			isPoint: boolean = false
		): void {
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

		public visibleEvent(
			callback: Function
		) {
			this.visible_events.push(callback);
		}

		protected init_visible_event(): void {
			this.visibleElement.addEventListener('click', (event: Event) => {
				this.visible = !this.visible;
				this.visible_events.forEach((callback: Function) => callback(event));
			});
			this.visibleElement.addEventListener('mousedown', (event: Event) => {
				event.stopPropagation();
			});
		}

		public destroy(): void {
			if (this.parent) (this.parent as any).remove(this);
			this.scene_view_element.destroy();
			this.hierarchy_view_element.parentNode.removeChild(this.hierarchy_view_element);
			this._destroyed = true;
		}

		public addEvent(
			event: string,
			callback: any
		): void {
			this.view_area_element.addEventListener(event, callback);
		}


		public select(): void {
			super.select();
			this.hierarchy_view_element.classList.add('selected');
		}

		public unselect(): void {
			super.unselect();
			this.hierarchy_view_element.classList.remove('selected');
		}

		public showInsertArea(): void {
			this.insert_event = this.onInsertEvent.bind(this);
			this.view_area_element.addEventListener('mousemove', this.insert_event);
			this.view_area_element.classList.add('dropTarget');
		}

		public hideInsertArea(): void {
			this.view_area_element.classList.remove('dropTarget', 'insertBefore', 'insertAfter');
			this.view_area_element.removeEventListener('mousemove', this.insert_event);
			this.insert_event = null;
			this.insertType = null;
		}

		protected onInsertEvent(event: MouseEvent): void {
			let target = event.target as HTMLElement;
			let target_height = target.offsetHeight;

			if (event.layerY < target_height/2) {
				if (this.insertType == InsertType.BEFORE) return;

				this.insertType = InsertType.BEFORE;
				this.view_area_element.classList.remove('insertAfter');
				this.view_area_element.classList.add('insertBefore');
			} else {
				if (this.insertType == InsertType.AFTER) return;

				this.insertType = InsertType.AFTER;
				this.view_area_element.classList.remove('insertBefore');
				this.view_area_element.classList.add('insertAfter');
			}
		}
	}
}
