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

	export class Inspector {
		protected view_element: HTMLElement;
		protected selected_gameobjects: GameObject.AbstractObject[] = [];
		protected input_elements: Object;
		protected content_view: HTMLElement;

		protected input_name: Utils.EasyInput;
		protected input_visible: Utils.EasyInput;
		protected input_alpha: Utils.EasyInput;
		protected input_rotation: Utils.EasyInput;
		protected input_blend: HTMLElement;
		protected input_position_x: Utils.EasyInput;
		protected input_position_y: Utils.EasyInput;
		protected input_scale_x: Utils.EasyInput;
		protected input_scale_y: Utils.EasyInput;
		protected input_pivot_x: Utils.EasyInput;
		protected input_pivot_y: Utils.EasyInput;
		protected input_anchor: HTMLElement;
		protected input_anchor_x: Utils.EasyInput;
		protected input_anchor_y: Utils.EasyInput;

		constructor() {
			this.view_element = document.getElementById('inspector');
			this.content_view = this.findViewElement('.content');

			this.initInputs();
		}

		protected findViewElement(path: string): HTMLElement {
			return this.view_element.querySelector(path)
		}

		protected initInputs(): void {
			this.input_anchor = this.findViewElement('#object-attr-anchor');
			this.input_blend = this.findViewElement('#object-attr-blend');

			this.input_blend.querySelector('select').addEventListener('change', (event: Event) => {
				this.selected_gameobjects.forEach((game_object) => {
					let value: string = (event.target as HTMLSelectElement).value;
					(game_object as GameObject.Sprite).blend = (PIXI.BLEND_MODES as any)[value];
				})
			});

			this.input_name = new Utils.EasyInput(
				this.findViewElement('#object-attr-name') as HTMLInputElement,
				(value: string) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.name = value; })}
			);
			this.input_visible = new Utils.EasyInput(
				this.findViewElement('#object-attr-visible input') as HTMLInputElement,
				(value: boolean) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.visible = value; })}
			);
			this.input_alpha = new Utils.EasyInput(
				this.findViewElement('#object-attr-alpha input') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.alpha = value; })}
			);
			this.input_rotation = new Utils.EasyInput(
				this.findViewElement('#object-attr-rotation input') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.rotation = value; })}
			);
			this.input_position_x = new Utils.EasyInput(
				this.findViewElement('#object-attr-position .x-value') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.position.x = value; })}
			);
			this.input_position_y = new Utils.EasyInput(
				this.findViewElement('#object-attr-position .y-value') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.position.y = value; })}
			);
			this.input_scale_x = new Utils.EasyInput(
				this.findViewElement('#object-attr-scale .x-value') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.scale.x = value; })}
			);
			this.input_scale_y = new Utils.EasyInput(
				this.findViewElement('#object-attr-scale .y-value') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.scale.y = value; })}
			);
			this.input_pivot_x = new Utils.EasyInput(
				this.findViewElement('#object-attr-pivot .x-value') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.pivot.x = value; })}
			);
			this.input_pivot_y = new Utils.EasyInput(
				this.findViewElement('#object-attr-pivot .y-value') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{ game_object.pivot.y = value; })}
			);
			this.input_anchor_x = new Utils.EasyInput(
				this.findViewElement('#object-attr-anchor .x-value') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{
					if (game_object instanceof GameObject.Sprite) game_object.anchor.x = value;
				})}
			);
			this.input_anchor_y = new Utils.EasyInput(
				this.findViewElement('#object-attr-anchor .y-value') as HTMLInputElement,
				(value: number) => { this.selected_gameobjects.forEach((game_object)=>{
					if (game_object instanceof GameObject.Sprite) game_object.anchor.y = value;
				})}
			);

			this.clearInput();
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
			this.input_name.value = '';
			this.input_visible.value = false;
			this.input_alpha.value = '';
			this.input_rotation.value = '';
			this.input_blend.querySelector('select').selectedIndex = -1;

			this.input_position_x.value = '';
			this.input_position_y.value = '';
			this.input_scale_x.value = '';
			this.input_scale_y.value = '';
			this.input_pivot_x.value = '';
			this.input_pivot_y.value = '';
			this.input_anchor_x.value = '';
			this.input_anchor_y.value = '';
		}

		protected writeInput(game_object: GameObject.AbstractObject): void {
			if (game_object instanceof GameObject.Sprite) {
				this.input_blend.classList.remove('disable');
				this.input_blend.querySelector('select').value = EBlendMode[game_object.blend];

				this.input_anchor.classList.remove('disable');
				this.input_anchor_x.value = (game_object as GameObject.Sprite).anchor.x.toString();
				this.input_anchor_y.value = (game_object as GameObject.Sprite).anchor.y.toString();
			} else
			if (game_object instanceof GameObject.Container) {
				this.input_blend.classList.add('disable');
				this.input_anchor.classList.add('disable');
			}

			this.input_name.value = game_object.name;
			this.input_visible.value = game_object.visible;
			this.input_alpha.value = game_object.alpha.toString();
			this.input_rotation.value = game_object.rotation.toString();
			this.input_position_x.value = game_object.position.x.toString();
			this.input_position_y.value = game_object.position.y.toString();
			this.input_scale_x.value = game_object.scale.x.toString();
			this.input_scale_y.value = game_object.scale.y.toString();
			this.input_pivot_x.value = game_object.pivot.x.toString();
			this.input_pivot_y.value = game_object.pivot.y.toString();
		}
	}
}
