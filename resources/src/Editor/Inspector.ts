/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../GameObject/AbstractObject.ts" />
/// <reference path="../GameObject/Sprite.ts" />
/// <reference path="../GameObject/Container.ts" />
/// <reference path="../Utils/easy-html.ts" />
/// <reference path="../Utils/easy_input/easy-input.ts" />

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
		protected text_word_wrap_view_group: HTMLElement;
		protected text_shadow_view_group: HTMLElement;

		protected common_inputs: any = {};
		protected sprite_inputs: any = {};
		protected text_inputs: any = {};

		protected fontFamilyList: string[] = ['Arial'];

		protected commonInputsParameter = [
			{ key: 'name', label: false },
			{ key: 'visible', type: 'checkbox' },
			{ key: 'alpha', type: 'number', step: 0.1, min: 0, max: 1 },
			{ key: 'rotation', type: 'number' },
			{ key: 'position', type: 'point' },
			{ key: 'scale', type: 'point', step: 0.1 },
			{ key: 'pivot', type: 'point' },
		];

		protected spriteInputsParameter = [
			{ key: 'anchor', type: 'point', step: 0.1 },
			{ key: 'blendMode', type: 'select', label: 'Blend', values: PIXI.BLEND_MODES},
		];

		protected textInputsParameter = [
			{ key: 'text', type: 'textarea', label: false, placeholder: 'Text', rows: 2 },
			{ key: ['style', 'fontSize'], type: 'number', label: 'Font size:' },
			{ key: ['style', 'fontFamily'], label: 'Font family:', type: 'select', values: this.fontFamilyList},
			{ key: ['style', 'align'], type: 'select', values: GameObject.textStyle.align},
			{ key: ['style', 'fontStyle'], type: 'select', label: 'Font style:', values: GameObject.textStyle.fontStyle},
			{ key: ['style', 'fontWeight'], type: 'select', label: 'Font weight:', values: GameObject.textStyle.fontWeight},
			{ key: ['style', 'leading'], type: 'number' },
			{ key: ['style', 'letterSpacing'], type: 'number', label: 'Letter spacing:' },
			{ key: ['style', 'padding'], type: 'number' },
			{ key: ['style', 'miterLimit'], label: 'Miter limit:', type: 'number' },
			{ key: ['style', 'lineJoin'], type: 'select', label: 'Line join:', values: GameObject.textStyle.lineJoin},
			{ key: ['style', 'fill'], type: 'gradient' },
			{ key: ['style', 'fillGradientType'], type: 'select', label: 'Gradient type:', values: PIXI.TEXT_GRADIENT},
			{ key: ['style', 'stroke'], type: 'color' },
			{ key: ['style', 'strokeThickness'], type: 'number', label: 'Stroke width:' },
			{ key: ['style', 'wordWrap'], type: 'checkbox', label: 'Word wrap' },
			{ key: ['style', 'dropShadow'], type: 'checkbox', label: 'Shadow' },
		];

		protected textWordWrapParameters = [
			{ key: ['style', 'wordWrapWidth'], type: 'number', label: 'Width:' },
			{ key: ['style', 'breakWords'], type: 'checkbox', label: 'Break words' },
		];

		protected textShadowParameters = [
			{ key: ['style', 'dropShadowAlpha'], type: 'number', label: 'Alpha:', step: 0.1, min: 0, max: 1 },
			{ key: ['style', 'dropShadowAngle'], type: 'number', label: 'Angle:' },
			{ key: ['style', 'dropShadowBlur'], type: 'number', label: 'Blur:' },
			{ key: ['style', 'dropShadowColor'], type: 'color', label: 'Color:' },
			{ key: ['style', 'dropShadowDistance'], type: 'number', label: 'Distance:' },
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
			this.common_view_group = this.create_group_element('common-group');
			this.sprite_view_group = this.create_group_element('sprite-group');
			this.text_view_group = this.create_group_element('text-group');

			this.init_input_group(this.common_view_group, this.commonInputsParameter, this.common_inputs);
			this.init_input_group(this.sprite_view_group, this.spriteInputsParameter, this.sprite_inputs);
			this.init_input_group(this.text_view_group, this.textInputsParameter, this.text_inputs);

			this.text_word_wrap_view_group = this.create_group_element('sub-group');
			this.text_word_wrap_view_group.classList.add('disable');
			Utils.easyHTML.insertAfter(this.text_word_wrap_view_group, this.text_inputs['style.wordWrap'].view_element);

			this.text_shadow_view_group = this.create_group_element('sub-group');
			this.text_shadow_view_group.classList.add('disable');
			Utils.easyHTML.insertAfter(this.text_shadow_view_group, this.text_inputs['style.dropShadow'].view_element);

			this.textWordWrapParameters.forEach((parameters: any) => {
				let easyInput: Utils.EasyInput = this.createEasyInput(parameters);
				let key = parameters.key;
				if (Array.isArray(key)) key = key.join('.');
				this.text_inputs[key] = easyInput;
				this.text_word_wrap_view_group.appendChild(easyInput.view_element);
			});

			this.textShadowParameters.forEach((parameters: any) => {
				let easyInput: Utils.EasyInput = this.createEasyInput(parameters);
				let key = parameters.key;
				if (Array.isArray(key)) key = key.join('.');
				this.text_inputs[key] = easyInput;
				this.text_shadow_view_group.appendChild(easyInput.view_element);
			});

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
				let easyInput: Utils.EasyInput = this.createEasyInput(parameters);
				let key = parameters.key;
				if (Array.isArray(key)) key = key.join('.');
				list[key] = easyInput;
				group.appendChild(easyInput.view_element);
			});
		}

		protected createEasyInput(parameters: any): Utils.EasyInput {
			let updateObject: Function;
			let key = parameters.key;
			if (Array.isArray(key)) key = key.join('.');

			if (key == 'style.wordWrap') {
				updateObject = (game_object: any, value: any) => {
					game_object.setOption(parameters.key, value);
					this.change_visible_text_word_wrap_group(value);
				};
			} else
			if (key == 'style.dropShadow') {
				updateObject = (game_object: any, value: any) => {
					game_object.setOption(parameters.key, value);
					this.change_visible_text_shadow_group(value);
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
					this.selected_gameobjects
						.forEach((game_object) => updateObject(game_object, value) )
				},
			);
		}

		protected change_visible_text_word_wrap_group(value: boolean): void {
			if (value) this.text_word_wrap_view_group.classList.remove('disable');
			else this.text_word_wrap_view_group.classList.add('disable');
		}

		protected change_visible_text_shadow_group(value: boolean): void {
			if (value) this.text_shadow_view_group.classList.remove('disable');
			else this.text_shadow_view_group.classList.add('disable');
		}

		public updateAttributes(): void {
			if (this.selected_gameobjects.length == 0) {
				this.common_view_group.classList.add('disable');
				this.sprite_view_group.classList.add('disable');
				this.text_view_group.classList.add('disable');
				this.content_view.classList.remove('enable');
				this.clearInput();
			} else {
				this.content_view.classList.add('enable');
				this.common_view_group.classList.remove('disable');
				this.writeInput(this.selected_gameobjects[0]);
			}
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
			} else
			if (game_object instanceof GameObject.Text) {
				this.sprite_view_group.classList.remove('disable');
				this.text_view_group.classList.remove('disable');
				this.change_visible_text_word_wrap_group(game_object.getOption(['style','wordWrap']));
				this.change_visible_text_shadow_group(game_object.getOption(['style','dropShadow']));

				this.write_inputs_list(this.sprite_inputs, game_object);
				this.write_inputs_list(this.text_inputs, game_object);
			}

			this.write_inputs_list(this.common_inputs, game_object);
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
			}
		}

		public update(game_object: GameObject.AbstractObject, attr: string|string[]): void {
			let path;
			if (Array.isArray(attr)) {
				path = attr.reduce((_path: any, current: string) => {
					if (_path && _path[current] !== undefined) {
						return _path[current];
					} else return null;
				}, this.common_inputs);

				if (!path) {
					console.warn('Оption does not exist. Skipped.', attr, this.common_inputs);
					return null;
				}
			} else {
				if (this.common_inputs[attr]) {
					path = this.common_inputs[attr];
				} else {
					console.warn('Оption does not exist. Skipped.', attr, this);
					return null;
				}
			}

			path.value = game_object.getOption(attr);
		}

		public addNewFontFamily(font: string): void {
			this.fontFamilyList.push(font);
			this.text_inputs['style.fontFamily'].updateSelect(this.fontFamilyList);

			if (this.selected_gameobjects.length > 0) {
				this.text_inputs['style.fontFamily'].value = this.selected_gameobjects[0].getOption(['style','fontFamily']);
			}
		}

		public select(game_object: GameObject.AbstractObject): void {
			while(this.selected_gameobjects.length > 0) {
				let currentObject = this.selected_gameobjects.pop();
				currentObject.unselect();
			}

			this.add(game_object);
			this.updateAttributes();
		}

		public add(game_object: GameObject.AbstractObject): void {
			this.selected_gameobjects.push(game_object);
			game_object.select();
		}

		public getSelected(): GameObject.AbstractObject[] {
			return this.selected_gameobjects;
		}

		public unselect(game_object: GameObject.AbstractObject, update: boolean = true): void {
			let index = this.selected_gameobjects.indexOf(game_object);
			if (index > -1) this.selected_gameobjects.splice(index, 1);
			if (!game_object.destroyed) game_object.unselect();
			if (update) this.updateAttributes();
		}
	}
}
