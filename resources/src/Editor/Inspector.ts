/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../GameObject/Abs.ts" />
/// <reference path="../GameObject/Sprite.ts" />
/// <reference path="../GameObject/Container.ts" />
/// <reference path="../Utils/easy-html.ts" />
/// <reference path="../Utils/easy_input/ctrl.ts" />

module Editor {
	interface IInspector {

	}

	export class Inspector implements IInspector {
		protected window_view: HTMLElement;
		protected content_view: HTMLElement;

		protected selected_list: GameObject.Abs[] = [];

		protected display_object_view: HTMLElement;
		protected sprite_view: HTMLElement;
		protected text_view: HTMLElement;
		protected custom_view: any = {};
		protected sub_view: any = {};

		protected display_object_inputs: any = {};
		protected sprite_inputs: any = {};
		protected text_inputs: any = {};
		protected custom_inputs: any = {};

		constructor() {
			this.window_view = document.getElementById('inspector');
			this.content_view = this.findViewElement('.content');

			this.initInputs();
		}

		protected findViewElement(path: string): HTMLElement {
			return this.window_view.querySelector(path)
		}

		protected initInputs(): void {
			this.display_object_view = this.create_group_element('common-group');
			this.sprite_view = this.create_group_element('sprite-group');
			this.text_view = this.create_group_element('text-group');

			this.init_input_group(this.display_object_view, GameObject.displayOptions, this.display_object_inputs);
			this.init_input_group(this.sprite_view, GameObject.spriteOptions, this.sprite_inputs);
			this.init_input_group(this.text_view, GameObject.textOptions, this.text_inputs);

			this.updateAttributes();
		}

		protected create_group_element(name: string): HTMLElement {
			return Utils.easyHTML.createElement({
				attr: { class: name }
			});
		}

		protected init_input_group(group: HTMLElement, inputs_parameter: any[], list: any): void {
			this.content_view.insertBefore(group, this.content_view.lastChild)

			inputs_parameter.forEach((parameters: any) => {
				if (parameters.parent)
					if (!this.sub_view[parameters.parent])
						console.warn(`Parent group "${parameters.parent}" is undefined. Skipped.`, parameters);
					else parameters.parent = this.sub_view[parameters.parent];
				else parameters.parent = group;

				let easyInput: Utils.EasyInput = this.createEasyInput(parameters);
				let key = parameters.key;
				if (Array.isArray(key)) key = key.join('.');
				list[key] = easyInput;

				if (parameters.subgroup) {
					this.sub_view[key] = this.create_group_element('sub-group');
					group.appendChild(this.sub_view[key]);
				}
			});
		}

		protected createEasyInput(parameters: any): Utils.EasyInput {
			let updateObject: Function;
			let key = parameters.key;
			if (Array.isArray(key)) key = key.join('.');

			if (parameters.subgroup) {
				updateObject = (game_object: any, value: any) => {
					game_object.setOption(parameters.key, value);
					this.change_visible_sub_group(value, this.sub_view[key]);
				};
			} else {
				let isPoint = parameters.type == 'point';
				updateObject = (game_object: any, value: any) => {
					game_object.setOption(parameters.key, value, isPoint);
				};
			}

			return Utils.easyInput(
				{ class: ['attr'], ...parameters },
				(value: any) => {
					this.selected_list
						.forEach((game_object) => updateObject(game_object, value) )
				},
			);
		}

		protected change_visible_sub_group(value: boolean, subgroup: HTMLElement): void {
			if (value) subgroup.classList.remove('disable');
			else subgroup.classList.add('disable');
		}

		public updateAttributes(): void {
			if (this.selected_list.length == 0) {
				this.display_object_view.classList.add('disable');
				this.sprite_view.classList.add('disable');
				this.text_view.classList.add('disable');
				this.content_view.classList.remove('enable');
				for (let key in this.custom_view) {
					this.custom_view[key].classList.add('disable');
				}
				this.clear_input();
			} else {
				this.content_view.classList.add('enable');
				this.update_content(this.selected_list[0]);
			}
		}

		protected clear_input(): void {
			for(let key in this.display_object_inputs) {
				this.display_object_inputs[key].clear();
			}
			for(let key in this.sprite_inputs) {
				this.sprite_inputs[key].clear();
			}
			for(let key in this.text_inputs) {
				this.text_inputs[key].clear();
			}
			for(let custom_key in this.custom_inputs) {
				for(let key in this.custom_inputs[custom_key]) {
					this.custom_inputs[custom_key][key].clear();
				}
			}
		}

		protected update_content(game_object: GameObject.Abs): void {
			if (game_object instanceof GameObject.Text) {
				this.sprite_view.classList.remove('disable');
				this.text_view.classList.remove('disable');

				this.write_inputs_list(this.sprite_inputs, game_object);
				this.write_inputs_list(this.text_inputs, game_object);
			} else
			if (game_object instanceof GameObject.Sprite) {
				this.sprite_view.classList.remove('disable');
				this.text_view.classList.add('disable');

				this.write_inputs_list(this.sprite_inputs, game_object);
			} else
			// if (game_object instanceof GameObject.Container)
			{
				this.sprite_view.classList.add('disable');
				this.text_view.classList.add('disable');
			}

			if (game_object instanceof GameObject.Display) {
				this.write_inputs_list(this.display_object_inputs, game_object);
				this.display_object_view.classList.remove('disable');
			} else {
				this.display_object_view.classList.add('disable');
			}

			for (let key in this.custom_view) {
				this.custom_view[key].classList.add('disable');
			}

			if (this.custom_view[game_object.customName]) {
				this.custom_view[game_object.customName].classList.remove('disable');
				this.write_inputs_list(this.custom_inputs[game_object.customName], game_object);
			}

		}

		protected write_inputs_list(list: any, game_object: any): void {
			for (let key in list) {
				let input = list[key];
				let _key = key.split('.');
				if (input.type == 'point') {
					input.x = game_object.getOption([..._key,'x']);
					input.y = game_object.getOption([..._key,'y']);
				} else {
					input.value = game_object.getOption(_key);
				}

				if (this.sub_view[key]) {
					this.change_visible_sub_group(input.value, this.sub_view[key]);
				}
			}
		}

		public update(game_object: GameObject.Abs, attr: string|string[]): void {
			let path;
			if (Array.isArray(attr)) {
				path = attr.reduce((_path: any, current: string) => {
					if (_path && _path[current] !== undefined) {
						return _path[current];
					} else return null;
				}, this.display_object_inputs);

				if (!path) {
					console.warn('Оption does not exist. Skipped.', attr, this.display_object_inputs);
					return null;
				}
			} else {
				if (this.display_object_inputs[attr]) {
					path = this.display_object_inputs[attr];
				} else {
					console.warn('Оption does not exist. Skipped.', attr, this);
					return null;
				}
			}

			path.value = game_object.getOption(attr);
		}

		public addNewFontFamily(font: string): void {
			GameObject.textStyle.fontFamily.push(font);
			this.text_inputs['style.fontFamily'].updateSelect(GameObject.textStyle.fontFamily);

			if (this.selected_list.length > 0) {
				this.text_inputs['style.fontFamily'].value = this.selected_list[0].getOption(['style','fontFamily']);
			}
		}

		public select(game_object: GameObject.Abs): void {
			if (game_object.selected) {
				if (this.selected_list.length == 1) { return; }
				else { this.clearSelected(game_object); }
			} else {
				this.clearSelected();
				this.add(game_object);
				this.updateAttributes();
			}

		}

		public clearSelected(exception: GameObject.Abs = null): void {
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

		public add(game_object: GameObject.Abs): void {
			this.selected_list.push(game_object);
			game_object.select();
		}

		public getSelected(): GameObject.Abs[] {
			return this.selected_list;
		}

		public unselect(game_object: GameObject.Abs, update: boolean = true): void {
			let index = this.selected_list.indexOf(game_object);
			if (index > -1) this.selected_list.splice(index, 1);
			if (!game_object.destroyed) game_object.unselect();
			if (update) this.updateAttributes();
		}

		public addCustomObject(name: string, parameters: any): void {
			this.custom_view[name] = this.create_group_element('custom-group');
			this.custom_inputs[name] = {};

			this.init_input_group(this.custom_view[name], parameters, this.custom_inputs[name]);

			let game_object = this.selected_list[0];
			if (game_object) {
				if (game_object.customName == name) {
					this.custom_view[name].classList.remove('disable');
					this.write_inputs_list(this.custom_inputs[name], game_object);
				}
			} else {
				this.custom_view[name].classList.add('disable');
			}
		}
	}
}
