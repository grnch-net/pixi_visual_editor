/// <reference path="Abs.ts" />

module Editor.AssetObject {
	interface IConstructorInitParameters {
		name: string;
		link: string;
	}

	export class Script extends Abs {
		protected script: any;
		protected image_text: HTMLElement;

		constructor({
			name,
			link,
		}: IConstructorInitParameters) {
			super({name});
			this.initScript(link);
		}

		protected create_view_image_element(
			attr?: any
		): void {
			this.view_image = Utils.easyHTML.createElement({
				parent: this.view_element,
				attr: { class: 'asset-button script-type' },
			});

			this.image_text = Utils.easyHTML.createElement({
				parent: this.view_image,
				attr: { class: '' },
				innerHTML: 'S'
			});
		}

		protected initScript(
			link: string
		): void {
			let callback: Function = () => {
				this.isLoad = true;
				if (this.onLoadCallback) this.onLoadCallback();
			};

			this.script = this.affixScriptToHead(link, callback);
		}

		protected loadError(
			oError: any
		): void {
			throw new URIError("The script " + oError.target.src + " didn't load correctly.");
		}

		protected affixScriptToHead(
			url: string,
			onloadFunction: any
		): HTMLScriptElement {
			let newScript: HTMLScriptElement = document.createElement("script");
			newScript.onerror = this.loadError.bind(this);
			if (onloadFunction) {
				newScript.onload = onloadFunction;
			}
			document.head.appendChild(newScript);
			newScript.src = url;

			return newScript;
		}
	}
}
