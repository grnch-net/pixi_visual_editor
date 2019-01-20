/// <reference path="./AbsSprite.ts" />

module GameObject {
	import AssetImage = Editor.AssetObject.Image;

	let TEXT_TYPE_IMAGE = 'assets/textTypeIco.png';

	export let textStyle = {
		align: ['left', 'center', 'right'],
		fontFamily: ['Arial'],
		fontStyle: ['normal', 'italic', 'oblique'],
		fontWeight: [
			'normal', 'bold', 'bolder', 'lighter', '100', '200',
			'300', '400', '500', '600', '700', '800', '900'
		],
		lineJoin: ['miter', 'round', 'bevel'],
	};

	export let textOptions = [
		{ key: 'text', type: 'textarea', label: false, placeholder: 'Text', rows: 2 },
		{ key: ['style', 'fontSize'], type: 'number', label: 'Font size:', min: 0 },
		{ key: ['style', 'fontFamily'], label: 'Font family:', type: 'select', values: textStyle.fontFamily},
		{ key: ['style', 'align'], type: 'select', values: textStyle.align},
		{ key: ['style', 'fontStyle'], type: 'select', label: 'Font style:', values: textStyle.fontStyle},
		{ key: ['style', 'fontWeight'], type: 'select', label: 'Font weight:', values: textStyle.fontWeight},
		{ key: ['style', 'leading'], type: 'number' },
		{ key: ['style', 'letterSpacing'], type: 'number', label: 'Letter spacing:' },
		{ key: ['style', 'padding'], type: 'number' },
		{ key: ['style', 'miterLimit'], label: 'Miter limit:', type: 'number' },
		{ key: ['style', 'lineJoin'], type: 'select', label: 'Line join:', values: textStyle.lineJoin},
		{ key: ['style', 'fill'], type: 'gradient' },
		{ key: ['style', 'fillGradientType'], type: 'select', label: 'Gradient type:', values: PIXI.TEXT_GRADIENT},
		{ key: ['style', 'stroke'], type: 'color' },
		{ key: ['style', 'strokeThickness'], type: 'number', label: 'Stroke width:' },
		{ key: ['style', 'wordWrap'], type: 'checkbox', label: 'Word wrap', subgroup: true },
		{ key: ['style', 'wordWrapWidth'], type: 'number', label: 'Width:', parent: 'style.wordWrap' },
		{ key: ['style', 'breakWords'], type: 'checkbox', label: 'Break words', parent: 'style.wordWrap' },
		{ key: ['style', 'dropShadow'], type: 'checkbox', label: 'Shadow', subgroup: true },
		{ key: ['style', 'dropShadowAlpha'], type: 'number', label: 'Alpha:', step: 0.1, min: 0, max: 1, parent: 'style.dropShadow' },
		{ key: ['style', 'dropShadowAngle'], type: 'number', label: 'Angle:', parent: 'style.dropShadow' },
		{ key: ['style', 'dropShadowBlur'], type: 'number', label: 'Blur:', parent: 'style.dropShadow' },
		{ key: ['style', 'dropShadowColor'], type: 'color', label: 'Color:', parent: 'style.dropShadow' },
		{ key: ['style', 'dropShadowDistance'], type: 'number', label: 'Distance:', parent: 'style.dropShadow' },
	];

	export class Text extends AbsSprite {
		public scene_view_element: PIXI.Text;

		constructor(name?: string) {
			super({
				name: name || 'Text'
			});

			this.style.scene_view_element = this.scene_view_element;
		}

		get texture(): any {
			return null;
		}

		set texture(value: any) {
			// TODO: need to remove texture option for textObject
			// if (!value.texture.trim) {
			// 	value.texture.trim = value.texture.orig;
			// }
			//
			// this.asset_image = value;
			// this.scene_view_element.texture = value.texture;
		}

		protected create_scene_elememnt() {
			this.scene_view_element = new PIXI.Text();
		}

		protected create_hierarchy_element(attr?: any) {
			super.create_hierarchy_element(attr);
			(this.typeElement as HTMLImageElement).src = TEXT_TYPE_IMAGE;
		}

		public style: any = {
			get dropShadowAngle(): number {
				let rad = this.scene_view_element.style.dropShadowAngle * 180 / Math.PI;
				return Math.round(rad * 1000) / 1000;
			},
			set dropShadowAngle(value: number) {
				this.scene_view_element.style.dropShadowAngle = value * Math.PI / 180;
			},

			get fontSize(): number {
				if (this.scene_view_element.style.fontSize == 0.01)
					return 0;
				else
					return this.scene_view_element.style.fontSize;
			},
			set fontSize(value: number) {
				if (!value) value = 0.01;
				this.scene_view_element.style.fontSize = value;
			}
		}
	}
}
