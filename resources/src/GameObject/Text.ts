/// <reference path="./AbstractSprite.ts" />

module GameObject {
	let TEXT_TYPE_IMAGE = 'assets/textTypeIco.png';

	export let textStyle = {
		align: ['left', 'center', 'right'],
		fontWeight: [
			'normal', 'bold', 'bolder', 'lighter', '100', '200',
			'300', '400', '500', '600', '700', '800', '900'
		],
	};

	export class Text extends AbstractSprite {
		public scene_view_element: PIXI.Text;

		protected _text: string = '';
		protected _font_size: number = 26;
		protected _fill: string = '#000000';
		protected _align: string = textStyle.align[0];
		protected _font_weight: string = textStyle.fontWeight[0];
		protected _letter_spacing: number = 0;
		protected _padding: number = 0;
		protected _stroke_fill: string = '#000000';
		protected _stroke_thickness: number = 0;
		protected _word_wrap: boolean = false;
		protected _word_wrap_width: number = 100;

		protected _drop_shadow: boolean = false;
		protected _drop_shadow_alpha: number = 1;
		protected _drop_shadow_angle: number = Math.PI/6;
		protected _drop_shadow_blur: number = 0;
		protected _drop_shadow_color: string = '#000000';
		protected _drop_shadow_distance: number = 5;

		constructor(name?: string) {
			super({
				name: name || 'Text'
			});

		}

		protected createSceneElement() {
			this.scene_view_element = new PIXI.Text();
		}

		protected createHierarchyElement(attr?: any) {
			super.createHierarchyElement(attr);
			(this.typeElement as HTMLImageElement).src = TEXT_TYPE_IMAGE;
		}

		public get text(): string { return this._text; }
		public set text(value: string) {
			this._text = value;
			this.scene_view_element.text = value;
		}

		public get fontSize(): number { return this._font_size; }
		public set fontSize(value: number) {
			this._font_size = value;
			this.scene_view_element.style.fontSize = value;
		}

		public get fill(): string { return this._fill; }
		public set fill(value: string) {
			this._fill = value;
			this.scene_view_element.style.fill = value;
		}

		public get stroke(): string { return this._stroke_fill; }
		public set stroke(value: string) {
			this._stroke_fill = value;
			this.scene_view_element.style.stroke = value;
		}

		public get strokeThickness(): number { return this._stroke_thickness; }
		public set strokeThickness(value: number) {
			this._stroke_thickness = value;
			this.scene_view_element.style.strokeThickness = value;
		}



	}
}
