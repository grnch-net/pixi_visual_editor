/// <reference path="../lib.d.ts/pixi.d.ts" />
/// <reference path="../GameObject/Abs.ts" />
/// <reference path="../GameObject/scene-content.ts" />
/// <reference path="../Utils/easy_input/ctrl.ts" />
module Editor {

	interface INewSceneParameters {
		width: number;
		height: number;
		color: number;
	}

	export class Scene {
		protected view_element: HTMLElement;

		public width: number = 1536;
		public height: number = 760;

		public application: PIXI.Application;

		protected area: PIXI.Container;
		public content: GameObject.SceneContent;

		protected background: PIXI.Graphics;
		protected bg_color: number;

		protected _zoom: number = 50;
		protected input_zoom: Utils.EasyInput;

		constructor(
			public editor: Editor.Ctrl
		) {
			this.view_element = document.getElementById('scene');
			this.createApplication();
			this.addLogo();
			this.createArea();
			this.initZoomPanel();
			this.addOnResizeEvent();
			this.addTouchEvent();
		}

		 public get zoom(): number { return this._zoom; }
		 public set zoom(value: number) {
			if (!this.content) return;
			this._zoom = value;
			this.area.scale.set(value/100);
		}

		protected createApplication(): void {
			this.application = new PIXI.Application({
				width: 2000,
				height: 2000,
				backgroundColor: 0x101010
			});
			this.view_element.appendChild(this.application.view);
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
			this.area.scale.set(this._zoom/100);
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
				area_width * (this._zoom/100),
				area_height * (this._zoom/100) + margin_top
			);
		}

		protected initZoomPanel(): void {
			let view_zoom = document.querySelector('#scene-zoom');
			this.input_zoom = Utils.easyInput(
				{},
				(value: number) => { this.zoom = value; },
				view_zoom.querySelector('input'),
			);
			view_zoom.querySelector('.plus').addEventListener('click', () => {
				if (!this.content) return;
				this.zoom += 10;
				this.input_zoom.value = this._zoom;
			});
			view_zoom.querySelector('.minus').addEventListener('click', () => {
				if (!this.content) return;
				this.zoom -= 10;
				this.input_zoom.value = this._zoom;
			});
		}

		protected addOnResizeEvent(): void {
			window.addEventListener('resize', this.resizeScreen.bind(this));
		}

		protected addTouchEvent(): void {
			this.view_element
			.addEventListener('mouseup', (event: MouseEvent) => {
				this.editor.eventCtrl.drop(
					event,
					EventTargetType.SCENE,
					this.dropTouchEvent.bind(this)
				);
			});
		}

		protected dropTouchEvent(type: EventTargetType, args: any): void {
			if (type == EventTargetType.ASSETS) {
				if (args instanceof AssetObject.Image) this.editor.hierarchy.createSprite(args);
			}
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

			this.input_zoom.value = this._zoom;
			this.input_zoom.readonly = false;
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
			this.content = new GameObject.SceneContent();
			let content_view = this.content.scene_view_element;
			content_view.position.set(
				-this.width*0.5,
				-this.height*0.5
			);

			let mask = this.createBackground('ContentMask');
			content_view.mask = mask;

			this.area.addChild(content_view);

			this.content.updateHierarchyElement(this.editor.hierarchy.view_list);
		}

	}
}
