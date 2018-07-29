
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

		protected input_name: HTMLElement;
		protected input_visible: HTMLElement;
		protected input_alpha: HTMLElement;
		protected input_rotation: HTMLElement;
		protected input_blend: HTMLElement;
		protected input_position: HTMLElement;
		protected input_scale: HTMLElement;
		protected input_pivot: HTMLElement;
		protected input_anchor: HTMLElement;

		constructor() {
			this.view_element = document.getElementById('inspector');
			this.content_view = this.findViewElement('.content');

			this.initInputs();
		}

		protected findViewElement(path: string): HTMLElement {
			return this.view_element.querySelector(path)
		}

		protected initInputs(): void {
			this.input_name = this.findViewElement('#object-attr-name');
			this.input_visible = this.findViewElement('#object-attr-visible');
			this.input_alpha = this.findViewElement('#object-attr-alpha');
			this.input_rotation = this.findViewElement('#object-attr-rotation');
			this.input_blend = this.findViewElement('#object-attr-blend');
			this.input_position = this.findViewElement('#object-attr-position');
			this.input_scale = this.findViewElement('#object-attr-scale');
			this.input_pivot = this.findViewElement('#object-attr-pivot');
			this.input_anchor = this.findViewElement('#object-attr-anchor');

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

		protected clearInput(): void {
			(this.input_name as HTMLInputElement).value = '';

			this.input_visible.querySelector('input').checked = false;

			this.input_alpha.querySelector('input').value = '';
			this.input_rotation.querySelector('input').value = '';

			this.input_blend.querySelector('select').selectedIndex = -1;

			(this.input_position.querySelector('.x-value') as HTMLInputElement).value = '';
			(this.input_position.querySelector('.y-value') as HTMLInputElement).value = '';
			(this.input_scale.querySelector('.x-value') as HTMLInputElement).value = '';
			(this.input_scale.querySelector('.y-value') as HTMLInputElement).value = '';
			(this.input_pivot.querySelector('.x-value') as HTMLInputElement).value = '';
			(this.input_pivot.querySelector('.y-value') as HTMLInputElement).value = '';
			(this.input_anchor.querySelector('.x-value') as HTMLInputElement).value = '';
			(this.input_anchor.querySelector('.y-value') as HTMLInputElement).value = '';
		}

		protected writeInput(game_object: GameObject.AbstractObject): void {
			(window as any).a = game_object;
			if (game_object instanceof GameObject.Sprite) {
				this.input_blend.classList.remove('disable');
				this.input_blend.querySelector('select').value = EBlendMode[game_object.blend];

				this.input_anchor.classList.remove('disable');
				(this.input_anchor.querySelector('.x-value') as HTMLInputElement).value = (game_object as GameObject.Sprite).anchor.x.toString();
				(this.input_anchor.querySelector('.y-value') as HTMLInputElement).value = (game_object as GameObject.Sprite).anchor.y.toString();
			} else
			if (game_object instanceof GameObject.Container) {
				this.input_blend.classList.add('disable');
				this.input_anchor.classList.add('disable');
			}

			(this.input_name as HTMLInputElement).value = game_object.name;
			this.input_visible.querySelector('input').checked = game_object.visible;
			this.input_alpha.querySelector('input').value = game_object.alpha.toString();
			this.input_rotation.querySelector('input').value = game_object.rotation.toString();
			(this.input_position.querySelector('.x-value') as HTMLInputElement).value = game_object.position.x.toString();
			(this.input_position.querySelector('.y-value') as HTMLInputElement).value = game_object.position.y.toString();
			(this.input_scale.querySelector('.x-value') as HTMLInputElement).value = game_object.scale.x.toString();
			(this.input_scale.querySelector('.y-value') as HTMLInputElement).value = game_object.scale.y.toString();
			(this.input_pivot.querySelector('.x-value') as HTMLInputElement).value = game_object.pivot.x.toString();
			(this.input_pivot.querySelector('.y-value') as HTMLInputElement).value = game_object.pivot.y.toString();
		}
	}
}
