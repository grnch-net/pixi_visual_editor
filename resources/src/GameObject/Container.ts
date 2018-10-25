/// <reference path="./Abs.ts" />
/// <reference path="./Display.ts" />

module GameObject {

	let FOLDER_OPEN_IMAGE = 'assets/folderOpenIco.png';
	let FOLDER_CLOSE_IMAGE = 'assets/folderIco.png';

	export class Container extends Display {
		public scene_view_element: PIXI.Container;
		public children: Abs[] = [];

		protected isShow: boolean = true;
		protected hierarchy_view_group_element: HTMLElement;

		constructor(name?: string) {
			super({
				name: name || 'Container'
			});
		}

		protected create_scene_elememnt() {
			this.scene_view_element = new PIXI.Container();
		}

		protected create_hierarchy_element(attr?: any) {
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
				event.stopPropagation();
			});
		}

		public add(game_object: Abs) {
			this.scene_view_element.addChild(game_object.scene_view_element);
			this.hierarchy_view_group_element.insertBefore(
				game_object.hierarchy_view_element,
				this.hierarchy_view_group_element.firstChild
			);

			game_object.parent = this;
			this.children.push(game_object);
		}

		public remove(game_object: Abs): void {
			let index = this.children.indexOf(game_object);
			if (index > -1) this.children.splice(index, 1);
			game_object.parent = null;
		}

		public destroy(): void {
			while(this.children.length > 0) {
				let child = this.children.pop();
				child.destroy();
			}

			super.destroy();
		}
	}
}
