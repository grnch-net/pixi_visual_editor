/// <reference path="./lib.d.ts/pixi.d.ts" />

import { easyHTML } from"./utils/easy-html";

export class Editor {
	protected scene: PIXI.Container;

	protected assets_list: Object[] = [];
	protected assets_element: HTMLElement;

	constructor() {
		this.init_user_interface();
	}

	protected init_user_interface(): void {
		this.init_options();
		this.init_bottom_block();
	}

	protected init_options(): void {
		document.getElementById('images_upload').addEventListener('change', this.texture_upload.bind(this));
	}

	protected init_bottom_block(): void {
		let block_visible: boolean = true;
		let block_element: HTMLElement = document.querySelector('.user-interface.bottom-block');

		this.assets_element = document.querySelector('#assets');

		block_element.querySelector('.labels-area .visible-button').addEventListener('click', () => {
			if (!block_visible) return;
			block_element.querySelector('.labels-area .button.show').classList.remove('show');
			block_element.classList.add('hide');
			block_visible = false;
		});


		let labels = block_element.querySelectorAll('.labels-area .label');
		let label_event = (label: HTMLElement) => {
			let current_show = block_element.querySelector('.labels-area .button.show');
			if (current_show) current_show.classList.remove('show');
			label.classList.add('show');

			block_element.classList.remove('hide');
			block_visible = true;

			let category = label.getAttribute('data-category');
			console.warn(category, block_element.querySelector('#'+category));
			block_element.querySelector('.main-area .container.show').classList.remove('show');
			block_element.querySelector('#'+category).classList.add('show');
		}

		for (let i=0; i<labels.length; ++i) {
			labels[i].addEventListener('click', label_event.bind(null, labels[i]));
		}



	}

























	protected texture_upload(event: Event): void {
		let input: any = event.target;
		if (input && input.files) {
			for(let i=0; i<input.files.length; i++) {
				this.load_texture(input.files[i]);
			}
		}
	}

	protected load_texture(file: any) {
		let asset: any = {};

		asset.element = easyHTML.createElement({
			type: 'div',
			attr: { class: 'item', title: file.name }
		});

		let url = URL.createObjectURL(file);
		asset.img = new Image();
		asset.img.src = url;
		asset.element.appendChild(asset.img);

		easyHTML.createElement({
			type: 'div', parent: asset.element,
			attr: { class: 'name' },
			innerHTML: file.name
		});

		easyHTML.createElement({
			type: 'div', parent: asset.element,
			attr: { class: 'touch' }
		});

		this.assets_element.querySelector('.content').appendChild(asset.element);


		asset.img.onload = () => {
			let base = new PIXI.BaseTexture(asset.img);
			asset.texture = new PIXI.Texture(base);

			this.assets_list.push(asset);
			// let sprite = new PIXI.Sprite(texture);
			// this.scene.addChild(sprite);
		}
	}
};
