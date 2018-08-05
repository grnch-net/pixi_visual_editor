/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../GameObject/AbstractObject.ts" />
module Editor {

	interface INewSceneParameters {
		width: number;
		height: number;
		color: number;
	}

	export class Scene {
		public width: number = 1536;
		public height: number = 760;

		public application: PIXI.Application;

		protected area: PIXI.Container;
		public content: PIXI.Container;

		protected background: PIXI.Graphics;
		protected bg_color: number;

		protected _zoom: number = 0.5;

		constructor() {
			this.createApplication();
			this.addLogo();
			this.createArea();
		}

		protected createApplication(): void {
			this.application = new PIXI.Application({
				width: 2000,
				height: 2000,
				backgroundColor: 0x101010
			});
			document.getElementById('scene').appendChild(this.application.view);
		}

		 protected addLogo(): void {
			 let logo = document.querySelector('#logo') as HTMLImageElement;
 			logo.src = 'assets/logo.png';
 			logo.onload = () => {
 				let base = new PIXI.BaseTexture(logo);
 				let texture = new PIXI.Texture(base);
 				let sprite = new PIXI.Sprite(texture);
 				sprite.alpha = 0.2;
 				sprite.position.set(10, 35);
 				this.application.stage.addChildAt(sprite, 0);
 			}
		 }

		protected createArea(): void {
			this.area = new PIXI.Container();
			this.area.name = 'Area';
			this.area.scale.set(this._zoom);
			this.resizeScreen();
			this.application.stage.addChild(this.area);
		}

		protected resizeScreen(): void {
			let margin_top: number = (document.querySelector('.editor-block.top-block') as HTMLDivElement).offsetHeight;
			let margin_bottom: number = (document.querySelector('.editor-block.bottom-block') as HTMLDivElement).offsetHeight;
			let margin_right: number = (document.querySelector('.editor-block.right-block') as HTMLDivElement).offsetWidth;
			let area_width: number = window.innerWidth - margin_right;
			let area_height: number = window.innerHeight - margin_bottom - margin_top;

			this.area.position.set(
				area_width * this._zoom,
				area_height * this._zoom + margin_top
			);
		}

		public newScene({
			width,
			height,
			color
		}: INewSceneParameters): void {
			this.width = width;
			this.height = height;
			this.bg_color = color;

			this.background = this.createBackground();
			this.createContent();
		}

		protected createBackground(name: string = 'Background'): PIXI.Graphics {
			let graphic = new PIXI.Graphics();
			graphic.name = name;
			graphic.beginFill(this.bg_color);
			graphic.drawRect(0, 0, this.width, this.height);
			graphic.endFill();
			graphic.position.set(
				-this.width*0.5,
				-this.height*0.5
			);
			this.area.addChild(graphic);
			return graphic;
		}

		protected createContent(): void {
			this.content = new PIXI.Container();
			this.content.position.set(
				-this.width*0.5,
				-this.height*0.5
			);

			let mask = this.createBackground('ContentMask');
			this.content.mask = mask;

			this.area.addChild(this.content);
		}

		public add(game_object: GameObject.AbstractObject): void {
			this.content.addChild(game_object.sceneElement);
		}
	}
}
