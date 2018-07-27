/// <reference path="./lib.d.ts/pixi.d.ts" />
/// <reference path="./Editor/EditorModule.ts" />

PIXI.utils.sayHello(PIXI.utils.isWebGLSupported()? 'WebGL' : 'canvas');
console.info('%c DEV Version: 1 ', 'background: #232627; color: #bada55');

new Editor.EditorModule();
