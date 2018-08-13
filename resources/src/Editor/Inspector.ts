/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../GameObject/AbstractObject.ts" />
/// <reference path="../GameObject/Sprite.ts" />
/// <reference path="../GameObject/Container.ts" />
/// <reference path="../Utils/EasyInput.ts" />

module Editor {

	interface IInspector {

	}

	export class Inspector implements IInspector {
		protected view_element: HTMLElement;
		protected selected_gameobjects: GameObject.AbstractObject[] = [];
		protected content_view: HTMLElement;

		protected common_view_group: HTMLElement;
		protected sprite_view_group: HTMLElement;
		protected text_view_group: HTMLElement;

		protected common_inputs: any = {};
		protected sprite_inputs: any = {};
		protected text_inputs: any = {};

		protected commonInputsParameter = [
			{ key: 'name', label: false },
			{ key: 'visible', type: 'checkbox' },
			{ key: 'alpha', type: 'number', step: 0.1 },
			{ key: 'rotation', type: 'number' },
			{ key: 'position', type: 'point' },
			{ key: 'pivot', type: 'point' },
		];

		protected spriteInputsParameter = [
			{ key: 'blend', type: 'select', label: 'Blend', values: PIXI.BLEND_MODES},
			{ key: 'anchor', type: 'point', step: 0.1 },
		];

		protected textInputsParameter = [
			{ key: 'text' },
			{ key: 'fontSize', type: 'number', label: 'Font size' },
		];

		constructor() {
			this.view_element = document.getElementById('inspector');
			this.content_view = this.findViewElement('.content');

			this.initInputs();
		}

		protected findViewElement(path: string): HTMLElement {
			return this.view_element.querySelector(path)
		}

		protected initInputs(): void {
			this.common_view_group = this.create_group('common');
			this.sprite_view_group = this.create_group('sprite');
			this.text_view_group = this.create_group('text');

			this.init_input_group(this.common_view_group, this.commonInputsParameter, this.common_inputs);
			this.init_input_group(this.sprite_view_group, this.spriteInputsParameter, this.sprite_inputs);
			this.init_input_group(this.text_view_group, this.textInputsParameter, this.text_inputs);

			this.clearInput();
		}

		protected create_group(name: string): HTMLElement {
			return Utils.easyHTML.createElement({
				attr: { class: name+'-group' }
			});
		}

		protected init_input_group(group: HTMLElement, inputs_parameter: any[], list: any): void {
			this.content_view.insertBefore(group, this.content_view.lastChild)

			inputs_parameter.forEach((parameters: any) => {
				let easyInput: Utils.EasyInput = this.createEasyInput(parameters);
				list[parameters.key] = easyInput;
				group.appendChild(easyInput.view_element);
			});
		}

		protected createEasyInput(parameters: any): Utils.EasyInput {
			let updateObject: Function;
			if (parameters.type == 'point') {
				updateObject = (game_object: any, values: any) => {
					game_object[parameters.key].set(values[0], values[1]);
				}
			} else {
				updateObject = (game_object: any, value: any) => {
					game_object[parameters.key] = value;
				}
			}

			return new Utils.EasyInput(
				{ class: ['attr'], ...parameters },
				(value: any) => {
					this.selected_gameobjects
						.forEach((game_object) => updateObject(game_object, value) )
				},
			);
		}

		public select(scene_object: GameObject.AbstractObject): void {
			while(this.selected_gameobjects.length > 0) {
				let currentObject = this.selected_gameobjects.pop();
				currentObject.unselect();
			}

			this.add(scene_object);
			this.updateAttributes();
		}

		public add(scene_object: GameObject.AbstractObject): void {
			this.selected_gameobjects.push(scene_object);
			scene_object.select();
		}

		protected updateAttributes(): void {
			if (this.selected_gameobjects.length == 0) {
				this.content_view.classList.remove('enable');
				this.clearInput();
			} else {
				this.content_view.classList.add('enable');
				this.writeInput(this.selected_gameobjects[0]);
			}
		}

		public getSelected(): GameObject.AbstractObject[] {
			return this.selected_gameobjects;
		}

		protected clearInput(): void {
			for(let key in this.common_inputs) {
				this.common_inputs[key].clear();
			}
			for(let key in this.sprite_inputs) {
				this.sprite_inputs[key].clear();
			}
			for(let key in this.text_inputs) {
				this.text_inputs[key].clear();
			}
		}

		protected writeInput(game_object: GameObject.AbstractObject): void {
			if (game_object instanceof GameObject.Sprite) {
				this.sprite_view_group.classList.remove('disable');
				this.text_view_group.classList.add('disable');

				this.write_inputs_list(this.sprite_inputs, game_object);
			} else
			if (game_object instanceof GameObject.Container) {
				this.sprite_view_group.classList.add('disable');
				this.text_view_group.classList.add('disable');
			}

			this.write_inputs_list(this.common_inputs, game_object);
		}

		protected write_inputs_list(list: any, game_object: any): void {
			for (let key in list) {
				let input = list[key];
				if (input.type == 'point') {
					input.x = game_object[key].x;
					input.y = game_object[key].y;
				} else {
					input.value = game_object[key];
				}
			}
		}

		public update(game_object: GameObject.AbstractObject, attr: string|string[]): void {
			if (typeof attr == 'string') {
				if (this.common_inputs[attr]) {
					(this.common_inputs as any)[attr].value = (game_object as any)[attr];
				}
			} else {
				if (this.common_inputs[attr[0]]) {
					(this.common_inputs as any)[attr[0]][attr[1]].value = (game_object as any)[attr[0]][attr[1]];
				}
			}
		}
	}
}
