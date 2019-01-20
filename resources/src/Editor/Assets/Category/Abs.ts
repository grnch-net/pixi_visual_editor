/// <reference path="../../../Utils/easy-html.ts" />
/// <reference path="../../abs-list.ts" />
/// <reference path="../Object/Abs.ts" />

module Editor.AssetCategory {

	export abstract class Abs extends AbsList {
		public view_element: HTMLElement;
		public view_show_button: HTMLElement;

		protected show_callback: Function;

		protected item_list: {
			[key: string]: AssetObject.Abs
		};
		protected selected_list: AssetObject.Abs[];

		protected _active: boolean;
		public get active(): boolean {
			return this._active;
		}

		public uploadType: string;

		constructor(
			protected ctrl: Assets.Ctrl,
			public name: string
		) {
			super();
			this.init_view_element();
			this.init_view_show_button();
		}

		protected init_class_options(): void {
			super.init_class_options();
			this.item_list = {};
			this.selected_list = [];
			this._active = false;
		}

		protected init_view_element(): void {
			this.view_element = Utils.easyHTML.createElement({
				attr: { class: 'category' }
			});
		}

		protected init_view_show_button(): void {
			let click_event = this.show.bind(this);
			this.view_show_button = Utils.easyHTML.createElement({
				innerHTML: this.name,
                attr: { class: 'item' },
				event: { click: click_event }
            });
		}

		public show(): void {
			if (this._active) return;
			this._active = true;

			if (this.show_callback) this.show_callback();

			this.view_show_button.classList.add('active');
			this.view_element.classList.add('active');
		}

		public hide(): void {
			if (!this._active) return;
			this._active = false;

			this.view_show_button.classList.remove('active');
			this.view_element.classList.remove('active');
		}

		public showEvent(
			callback: Function
		): void {
			this.show_callback = callback;
		}

		public upload(
			event: Event
		): any {
			let input: any = event.target;
			if (input && input.files) {
				return this.sort_files(input.files);
			}
		}

		protected sort_files(
			files: FileList
		): any {
			let file_list: any = {};

			for(let key in files) {
				let file: any = files[key];
				if (file instanceof File) {
					let file_name_arr: string[] = file.name.split('.');
					if (file_name_arr.length == 1) {
						console.warn(`Invalid file name (${file.name}). Skipping.`);
						continue;
					}

					// TODO: Add replace() method
					if (this.item_list[file.name]) {
						console.warn(`Add asset: the file "${file.name}" already exists.`);
						continue;
					}

					// let file_type: string = file_name_arr[file_name_arr.length-1];
					file_list[file.name] = file;
				}
			}

			return file_list;
		}

		protected add_asset_event(
			asset: AssetObject.Abs
		): void {
			let eventCtrl = this.ctrl.editor.eventCtrl;
			asset.takeEvent((event: MouseEvent) => {
				eventCtrl.drag(event, {
					type: EventTargetType.ASSETS,
					take: () => this.asset_take_event(asset),
					drop: this.asset_drop_event.bind(this),
					args: this.selected_list
					// args: asset
				});
			});

			asset.selectEvent(() => {
				let dragType = eventCtrl.dragType;
				if (dragType !== null) return;
				this.select(asset);
			});
		}

		protected asset_take_event(
			asset: AssetObject.Abs
		): void {
			if (!asset.selected) this.select(asset);
		}

		protected asset_drop_event(
			type: EventTargetType,
			args: AssetObject.Abs[]
		): void {}

		public remove(
			asset: AssetObject.Image
		): void {
			asset.destroy();
			delete this.item_list[asset.name];
			let parent: HTMLElement = asset.view_element.parentElement;
			parent.removeChild(asset.view_element);
		}

		public select(
			asset_object: AssetObject.Abs
		): void {
			if (asset_object.selected) {
				if (this.selected_list.length == 1) { return; }
				else { this.clearSelected(asset_object); }
			} else {
				this.clearSelected();
				this.add(asset_object);
			}

		}

		public clearSelected(
			exception: AssetObject.Abs = null
		): void {
			if (exception) {
				while(this.selected_list.length > 0) {
					let currentObject = this.selected_list.pop();
					if (currentObject != exception) currentObject.unselect();
				}
				this.selected_list.push(exception);
			} else {
				while(this.selected_list.length > 0) {
					let currentObject = this.selected_list.pop();
					currentObject.unselect();
				}
			}
		}

		public add(
			asset_object: AssetObject.Abs
		): void {
			this.selected_list.push(asset_object);
			asset_object.select();
		}

		public getSelected(): AssetObject.Abs[] {
			return this.selected_list;
		}

		public unselect(
			asset_object: AssetObject.Abs,
			update: boolean = true
		): void {
			let index = this.selected_list.indexOf(asset_object);
			if (index > -1) this.selected_list.splice(index, 1);
			if (!asset_object.destroyed) asset_object.unselect();
		}

	}
}
