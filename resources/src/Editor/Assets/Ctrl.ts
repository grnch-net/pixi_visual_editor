/// <reference path="../../lib.d.ts/pixi.d.ts" />
/// <reference path="../../Utils/easy-html.ts" />
/// <reference path="../../GameObject/Sprite.ts" />
/// <reference path="../EventCtrl.ts" />
/// <reference path="../Hierarchy.ts" />
/// <reference path="Object/Image.ts" />
/// <reference path="Object/Font.ts" />
/// <reference path="Object/Script.ts" />
/// <reference path="Category/Image.ts" />
/// <reference path="Category/Font.ts" />
/// <reference path="Category/Script.ts" />
/// <reference path="Category/Sound.ts" />

module Editor.Assets {

	export class Ctrl {
		protected view_element: HTMLElement;
		protected view_content: HTMLElement;
		protected view_upload_button: HTMLInputElement;
		protected view_category_list: HTMLElement;

		protected view_categories: {
			[key: string]: AssetCategory.Abs
		};
		protected active_category: AssetCategory.Abs;


		constructor(
			public editor: Editor.Ctrl,
		) {
			this.init_class_options();
			this.init_view();
			this.init_category();
		}

		protected init_class_options(): void {
			this.view_categories = {};
		}


		protected init_view(): void {
			this.view_element = document.querySelector('#assets');;
			this.view_content = this.view_element.querySelector('.content');
			this.view_category_list = this.view_element.querySelector('.category-list');

			this.view_upload_button = this.view_element.querySelector('.item.upload');
			this.view_upload_button.querySelector('input').addEventListener('change', this.upload_new_assets.bind(this));
		}

		protected init_category(): void {
			this.view_categories = {
				image	: this.new_category(AssetCategory.Image, true),
				font	: this.new_category(AssetCategory.Font),
				script	: this.new_category(AssetCategory.Script),
				sound	: this.new_category(AssetCategory.Sound)
			}
		}

		protected new_category(
			Category: any,
			active: boolean = false
		): AssetCategory.Abs {
			let category: AssetCategory.Abs = new Category(this);

			this.view_content.appendChild(category.view_element);
			this.view_category_list.appendChild(category.view_show_button);

			let show_event: Function = () => this.change_category(category);
			category.showEvent(show_event);

			if (active) category.show();

			return category;
		}

		protected change_category(
			category: AssetCategory.Abs
		): void {
			if (this.active_category) {
				this.active_category.hide();
			}

			this.active_category = category;

			if (category.view_element.children.length) {
				category.view_element.insertBefore(this.view_upload_button, category.view_element.firstChild);
			} else {
				category.view_element.appendChild(this.view_upload_button);
			}

			this.view_upload_button.querySelector('input').accept = category.uploadType;
		}

		protected upload_new_assets(
			event: Event
		): void {
			this.active_category.upload(event);
		}

	}
}
