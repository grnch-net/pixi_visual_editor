/// <reference path="./lib.d.ts/pixi.d.ts" />
import { Editor } from './Editor';

console.info('%c DEV Version: 1 ', 'background: #232627; color: #bada55');
PIXI.utils.sayHello(PIXI.utils.isWebGLSupported()? 'WebGL' : 'canvas');

const SCENE_WIDTH: number = 1536;
const SCENE_HEIGHT: number = 760;

let window_width: number = window.innerWidth - 200;
let window_height: number = window.innerHeight - 161 - 22;

let app = new PIXI.Application({
	width: 2000,
	height: 2000,
	backgroundColor: 0x101010
});
document.getElementById('scene').appendChild(app.view);

let scene_container = new PIXI.Container();
scene_container.name = 'scene_container';
scene_container.position.set(window_width*0.5, window_height*0.5 +22);
scene_container.scale.set(0.5, 0.5);
app.stage.addChild(scene_container);


let scene_background = new PIXI.Graphics();
scene_background.name = 'scene_background';
scene_background.beginFill(0xFFFFFF);
scene_background.drawRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
scene_background.endFill();
scene_background.pivot.set(SCENE_WIDTH*0.5, SCENE_HEIGHT*0.5);
scene_container.addChild(scene_background);



let editor = new Editor();
