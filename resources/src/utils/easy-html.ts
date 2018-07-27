/// <reference path="./i-easy-html.ts" />

module Utils {

	export let easyHTML: Utils.IEasyHTML = {
		svgns: 'http://www.w3.org/2000/svg',
		xlink: 'http://www.w3.org/1999/xlink',
		svgTags: [
			'svg',
			'use',
			'defs',
			'g',
			'path',
			'circle',
			'rect',
			'text',
			'filter',
			'image',
			'lineargradient',
			'radialgradient',
			'stop',
			'filter',
			'fegaussianblur',
			'foreignobject'
		],

	    createElement: function (parameters: Utils.IHTMLElementConfig = {}): HTMLElement {
	        let htmlElement: HTMLElement;

	        if (!parameters.type) {
	            htmlElement = document.createElement('div');
	        } else {
				let _type: string = parameters.type.toLowerCase();

				if (this.svgTags.includes(_type))
					htmlElement = document.createElementNS(this.svgns, parameters.type);
				else
					htmlElement = document.createElement(parameters.type);
	        }

			if (parameters.parent) {
				parameters.parent.appendChild(htmlElement);
			}

			if (parameters.innerHTML) {
				htmlElement.innerHTML = parameters.innerHTML;
			}

			let attr = parameters.attr;
			if (attr) {
				for(let key in attr) {
					if (attr[key] === undefined) continue;

					switch (key) {
						case 'href':
							htmlElement.setAttributeNS( this.xlink, 'href', <string>attr['href'] );
							break;
						default:
							htmlElement.setAttribute( key, <string>attr[key] );
					}

				}

	        }

	        return htmlElement;
	    },

		setAttribute: function (element: HTMLElement, attr: any): void {
			for(let key in attr) {
				element.setAttributeNS( null, key, <string>attr[key] );
			}
		}
	};
}
