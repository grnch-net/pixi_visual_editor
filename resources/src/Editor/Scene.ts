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
		protected content: PIXI.Container;

		protected background: PIXI.Graphics;
		protected bg_color: number;

		protected _zoom: number = 0.5;

		constructor() {
			this.createApplication();
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

		protected createArea(): void {
			this.area = new PIXI.Container();
			this.area.name = 'area';
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

			this.createBackground();
			this.createContent();
		}

		protected createBackground(): void {
			this.background = new PIXI.Graphics();
			this.background.name = 'background';
			this.background.beginFill(this.bg_color);
			this.background.drawRect(0, 0, this.width, this.height);
			this.background.endFill();
			this.background.position.set(
				-this.width*0.5,
				-this.height*0.5
			);
			this.area.addChild(this.background);
		}

		protected createContent(): void {
			this.content = new PIXI.Container();
			this.content.position.set(
				-this.width*0.5,
				-this.height*0.5
			);
			this.area.addChild(this.content);
		}

		public add(game_object: GameObject.AbstractObject): void {
			this.content.addChild(game_object.sceneElement);
		}
	}
}
