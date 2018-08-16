/// <reference path="./AbstractObject.ts" />

module GameObject {

	let FOLDER_OPEN_IMAGE = 'assets/folderOpenIco.png';
	let FOLDER_CLOSE_IMAGE = 'assets/folderIco.png';

	export class Container extends AbstractObject {
		public scene_view_element: PIXI.Container;

		protected isShow: boolean = true;
		protected hierarchy_view_group_element: HTMLElement;

		constructor(name?: string) {
			super({
				name: name || 'Container'
			});
		}

		protected createSceneElement() {
			this.scene_view_element = new PIXI.Container();
		}

		protected createHierarchyElement(attr?: any) {
			super.createHierarchyElement(attr);
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
				event.stopPropagation();
			});
		}

		public add(game_object: AbstractObject) {
			this.scene_view_element.addChild(game_object.scene_view_element);
			this.hierarchy_view_group_element.insertBefore(
				game_object.hierarchy_view_element,
				this.hierarchy_view_group_element.firstChild
			);

			game_object.parent = this;
		}
	}
}
