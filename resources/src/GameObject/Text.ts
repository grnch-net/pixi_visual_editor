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
		protected _break_words: boolean = false;
		protected _word_wrap_width: number = 100;

		protected _drop_shadow: boolean = false;
		protected _drop_shadow_alpha: number = 1;
		protected _drop_shadow_angle: number = 30;
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

		public get align(): string { return this._align; }
		public set align(value: string) {
			this._align = value;
			this.scene_view_element.style.align = value;
		}

		public get fontWeight(): string { return this._font_weight; }
		public set fontWeight(value: string) {
			this._font_weight = value;
			this.scene_view_element.style.fontWeight = value;
		}

		public get letterSpacing(): number { return this._letter_spacing; }
		public set letterSpacing(value: number) {
			this._letter_spacing = value;
			this.scene_view_element.style.letterSpacing = value;
		}

		public get padding(): number { return this._padding; }
		public set padding(value: number) {
			this._padding = value;
			this.scene_view_element.style.padding = value;
		}

		public get wordWrap(): boolean { return this._word_wrap; }
		public set wordWrap(value: boolean) {
			this._word_wrap = value;
			this.scene_view_element.style.wordWrap = value;
		}

		public get breakWords(): boolean { return this._break_words; }
		public set breakWords(value: boolean) {
			this._break_words = value;
			this.scene_view_element.style.breakWords = value;
		}

		public get wordWrapWidth(): number { return this._word_wrap_width; }
		public set wordWrapWidth(value: number) {
			this._word_wrap_width = value;
			this.scene_view_element.style.wordWrapWidth = value;
		}

		public get dropShadow(): boolean { return this._drop_shadow; }
		public set dropShadow(value: boolean) {
			this._drop_shadow = value;
			this.scene_view_element.style.dropShadow = value;
		}

		public get dropShadowAlpha(): number { return this._drop_shadow_alpha; }
		public set dropShadowAlpha(value: number) {
			this._drop_shadow_alpha = value;
			this.scene_view_element.style.dropShadowAlpha = value;
		}

		public get dropShadowAngle(): number { return this._drop_shadow_angle; }
		public set dropShadowAngle(value: number) {
			this._drop_shadow_angle = value;
			this.scene_view_element.style.dropShadowAngle = value * Math.PI / 180;
		}

		public get dropShadowBlur(): number { return this._drop_shadow_blur; }
		public set dropShadowBlur(value: number) {
			this._drop_shadow_blur = value;
			this.scene_view_element.style.dropShadowBlur = value;
		}

		public get dropShadowColor(): string { return this._drop_shadow_color; }
		public set dropShadowColor(value: string) {
			this._drop_shadow_color = value;
			this.scene_view_element.style.dropShadowColor = value;
		}

		public get dropShadowDistance(): number { return this._drop_shadow_distance; }
		public set dropShadowDistance(value: number) {
			this._drop_shadow_distance = value;
			this.scene_view_element.style.dropShadowDistance = value;
		}


	}
}
