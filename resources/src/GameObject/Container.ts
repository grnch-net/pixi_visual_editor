/// <reference path="./Abs.ts" />
/// <reference path="./Display.ts" />

module GameObject {

	let FOLDER_OPEN_IMAGE = 'assets/folderOpenIco.png';
	let FOLDER_CLOSE_IMAGE = 'assets/folderIco.png';

	export class Container extends Display {
		public scene_view_element: PIXI.Container;
		public children: Abs[];

		protected isShow: boolean;
		protected hierarchy_view_group_element: HTMLElement;

		constructor(
			name?: string
		) {
			super({
				name: name || 'Container'
			});
		}

		protected init_class_options(): void {
			super.init_class_options();
			this.children = [];
			this.isShow = true;
		}

		protected create_scene_elememnt(): void {
			this.scene_view_element = new PIXI.Container();
		}

		protected create_hierarchy_element(
			attr?: any
		): void {
			super.create_hierarchy_element(attr);
			(this.typeElement as HTMLImageElement).src = FOLDER_OPEN_IMAGE;
			this.typeElement.classList.add('container');

			this.hierarchy_view_group_element = Utils.easyHTML.createElement({
				type: 'div', parent: this.hierarchy_view_element,
				attr: { class: 'group' }
			});

			this.add_group_visable_event();
		}

		protected add_group_visable_event(): void {
			this.typeElement.addEventListener('mouseup', () => {
				if (this.isShow) {
					this.hierarchy_view_group_element.classList.add('hide');
					this.typeElement.src = FOLDER_CLOSE_IMAGE;
				} else {
					this.typeElement.src = FOLDER_OPEN_IMAGE;
					this.hierarchy_view_group_element.classList.remove('hide');

				}

				this.isShow = !this.isShow;
				this.deselect = true;
			});
		}

		public addChild(
			game_object: Abs
		): void {
			if (!this.check_and_clean_child(game_object)) return;

			this.hierarchy_view_group_element.insertBefore(
				game_object.hierarchy_view_element,
				this.hierarchy_view_group_element.firstChild
			);

			this.scene_view_element.addChild(game_object.scene_view_element);

			game_object.parent = this;
			this.children.push(game_object);
		}

		public addLastChild(
			game_object: Abs
		): void {
			if (!this.check_and_clean_child(game_object)) return;

			this.hierarchy_view_group_element.appendChild(
				game_object.hierarchy_view_element,
			);

			this.scene_view_element.addChildAt(game_object.scene_view_element, 0);

			game_object.parent = this;
			this.children.unshift(game_object);
		}

		public remove(
			game_object: Abs
		): void {
			let index = this.children.indexOf(game_object);
			if (index > -1) this.children.splice(index, 1);

			this.hierarchy_view_group_element.removeChild(game_object.hierarchy_view_element);
			this.scene_view_element.removeChild(game_object.scene_view_element);

			game_object.parent = null;
		}

		public destroy(): void {
			while(this.children.length > 0) {
				let child = this.children.pop();
				child.destroy();
			}

			super.destroy();
		}

		public insertBeforeChild(
			insertObject: GameObject.Abs,
			beforeObject: GameObject.Abs
		): void {
			if (!this.check_and_clean_child(insertObject)) return;

			this.hierarchy_view_group_element.insertBefore(insertObject.hierarchy_view_element, beforeObject.hierarchy_view_element);

			let scene_index = this.children.indexOf(beforeObject) +1;
			if (scene_index > this.children.length) {
				this.addChild(insertObject);
			} else {
				this.children.splice(scene_index, 0, insertObject);
				this.scene_view_element.addChildAt(insertObject.scene_view_element, scene_index);
				insertObject.parent = this;
			}
		}

		public insertAfterChild(
			insertObject: GameObject.Abs,
			afterObject: GameObject.Abs
		): void {
			if (!this.check_and_clean_child(insertObject)) return;

			let next_element: Element = afterObject.hierarchy_view_element.nextElementSibling;
			this.hierarchy_view_group_element.insertBefore(insertObject.hierarchy_view_element, next_element);

			let scene_index = this.children.indexOf(afterObject);
			this.children.splice(scene_index, 0, insertObject);
			this.scene_view_element.addChildAt(insertObject.scene_view_element, scene_index);

			insertObject.parent = this;
		}

		protected check_and_clean_child(
			game_object: GameObject.Abs
		): boolean {
			if (game_object == this
				|| this.getPedigree().includes(game_object)) {
				console.warn('The parent can not be a child of children.');
				return false;
			}

			let previous_parent = game_object.parent as GameObject.Container;
			if (previous_parent) {
				previous_parent.remove(game_object);
			}

			return true;
		}

		protected getPedigree(
			game_object: GameObject.Abs = this,
			list: GameObject.Container[] = []
		): GameObject.Abs[] {
			let parent = game_object.parent as GameObject.Container;
			if (parent) {
				list.push(parent);
				return this.getPedigree(parent, list);
			} else {
				return list
			}
		}
	}
}
