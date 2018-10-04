/// <reference path="./AbstractSprite.ts" />

module GameObject {
	let TEXT_TYPE_IMAGE = 'assets/textTypeIco.png';

	export let textStyle = {
		align: ['left', 'center', 'right'],
		fontStyle: ['normal', 'italic', 'oblique'],
		fontWeight: [
			'normal', 'bold', 'bolder', 'lighter', '100', '200',
			'300', '400', '500', '600', '700', '800', '900'
		],
		lineJoin: ['miter', 'round', 'bevel'],
	};

	export class Text extends AbstractSprite {
		public scene_view_element: PIXI.Text;

		constructor(name?: string) {
			super({
				name: name || 'Text'
			});

			this.style.scene_view_element = this.scene_view_element;
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
				return this.scene_view_element.style.dropShadowAngle * 180 / Math.PI;
			},
			set dropShadowAngle(value: number) {
				this.scene_view_element.style.dropShadowAngle = value * Math.PI / 180;
			}
		}


	}
}
