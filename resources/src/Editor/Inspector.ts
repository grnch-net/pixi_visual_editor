/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../GameObject/AbstractObject.ts" />
/// <reference path="../GameObject/Sprite.ts" />
/// <reference path="../GameObject/Container.ts" />
/// <reference path="../Utils/EasyInput.ts" />

module Editor {

	let EBlendMode: string[] = [];
	for(let key in PIXI.BLEND_MODES) {
		let index = (PIXI.BLEND_MODES as any)[key];
		EBlendMode[index] = key;
	}

	interface IInspector {

	}

	export class Inspector implements IInspector {
		protected view_element: HTMLElement;
		protected selected_gameobjects: GameObject.AbstractObject[] = [];
		protected content_view: HTMLElement;

		protected inputs: any = {};
		protected defaultInputs = [
			{ key: 'name', label: false },
			// { key: 'visible', type: 'checkbox' },
			// { key: 'alpha', type: 'number', step: 0.1 },
			// { key: 'rotation', type: 'number' },
			// { key: 'position', type: 'point' },
			// { key: 'pivot', type: 'point' },
		];

		protected spriteInputs = [
			{ key: 'blendMode', type: 'select', label: 'Blend', values: PIXI.BLEND_MODES},
			{ key: 'anchor', type: 'point', step: 0.1 },
		];

		protected textInputs = [
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
			// this.inputs.anchor = this.findViewElement('#object-attr-anchor');
			// this.inputs.blend = this.findViewElement('#object-attr-blend');

			// this.inputs.blend.querySelector('select').addEventListener('change', (event: Event) => {
			// 	this.selected_gameobjects.forEach((game_object) => {
			// 		let value: string = (event.target as HTMLSelectElement).value;
			// 		(game_object as GameObject.Sprite).blend = (PIXI.BLEND_MODES as any)[value];
			// 	})
			// });
			let content_blocker = this.content_view.firstChild;

			this.defaultInputs.forEach((parameters: any) => {
				let easyInput: Utils.EasyInput = this.createEasyInput(parameters);
				this.inputs[parameters.key] = easyInput;
				this.content_view.insertBefore(easyInput.view_element, content_blocker)

				// if (typeof parameters.key == 'string') {
				// 	this.inputs[parameters.key] = easyInput;
				// } else {
				// 	if (!this.inputs[parameters.key[0]]) this.inputs[parameters.key[0]] = {};
				// 	this.inputs[parameters.key[0]][parameters.key[1]] = easyInput;
				// }
			});

			this.clearInput();
		}

		protected createEasyInput(parameters: any): Utils.EasyInput {
			let updateObject: Function;
			if (parameters.type == 'point') {
				updateObject = (game_object: any, values: any) => {
					// game_object[attr[0]][attr[1]] = value;
					game_object[parameters.key].set(values[0], values[1]);
				}
			} else {
				updateObject = (game_object: any, value: any) => {
					game_object[parameters.key] = value;
				}
			}

			return new Utils.EasyInput(
				{ class: ['attr'], ...parameters },
				(value: any) => { this.selected_gameobjects.forEach((game_object) => updateObject(game_object, value) )},
				// this.findViewElement(path) as HTMLInputElement,
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
			this.inputs.name.value = '';
			this.inputs.visible.value = false;
			this.inputs.alpha.value = '';
			this.inputs.rotation.value = '';
			this.inputs.blend.querySelector('select').selectedIndex = -1;

			this.inputs.position.x.value = '';
			this.inputs.position.y.value = '';
			this.inputs.scale.x.value = '';
			this.inputs.scale.y.value = '';
			this.inputs.pivot.x.value = '';
			this.inputs.pivot.y.value = '';
			this.inputs.anchor.x.value = '';
			this.inputs.anchor.y.value = '';
		}

		protected writeInput(game_object: GameObject.AbstractObject): void {
			if (game_object instanceof GameObject.Sprite) {
				this.inputs.blend.classList.remove('disable');
				this.inputs.blend.querySelector('select').value = EBlendMode[game_object.blend];

				this.inputs.anchor.classList.remove('disable');
				this.inputs.anchor.x.value = (game_object as GameObject.Sprite).anchor.x.toString();
				this.inputs.anchor.y.value = (game_object as GameObject.Sprite).anchor.y.toString();
			} else
			if (game_object instanceof GameObject.Container) {
				this.inputs.blend.classList.add('disable');
				this.inputs.anchor.classList.add('disable');
			}

			this.inputs.name.value = game_object.name;
			this.inputs.visible.value = game_object.visible;
			this.inputs.alpha.value = game_object.alpha.toString();
			this.inputs.rotation.value = game_object.rotation.toString();
			this.inputs.position.x.value = game_object.position.x.toString();
			this.inputs.position.y.value = game_object.position.y.toString();
			this.inputs.scale.x.value = game_object.scale.x.toString();
			this.inputs.scale.y.value = game_object.scale.y.toString();
			this.inputs.pivot.x.value = game_object.pivot.x.toString();
			this.inputs.pivot.y.value = game_object.pivot.y.toString();
		}

		public update(game_object: GameObject.AbstractObject, attr: string|string[]): void {
			console.warn('upadte', attr);
			if (typeof attr == 'string') {
				(this as any)[attr] = (game_object as any)[attr];
			} else {
				(this as any)[attr[0]][attr[1]] = (game_object as any)[attr[0]][attr[1]];
			}
		}
	}
}
