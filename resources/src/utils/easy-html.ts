module Utils {

	export interface IEasyHTML {
		readonly svgns: string;
		readonly xlink: string;
		readonly svgTags: string[];

		createElement(parameters?: IHTMLElementConfig): HTMLElement;
		setAttribute(element: HTMLElement, attr?: { [key: string]: string | number }): void;
		insertAfter(elem: HTMLElement, refElem: HTMLElement): HTMLElement;
	}

	export interface IHTMLElementConfig {
		type?: string,
		parent?: HTMLElement,
		innerHTML?: string,
		attr?: {
			[key: string]: string | number;
		},
		event?: {
			[key: string]: EventListener;
		}
	}

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

	    createElement: function (
			parameters: Utils.IHTMLElementConfig = {}
		): HTMLElement {
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

					if (key == 'href') {
						htmlElement.setAttributeNS( this.xlink, 'href', <string>attr['href'] );
					} else {
						htmlElement.setAttribute( key, <string>attr[key] );
					}

				}

	        }

			if (parameters.event) {
				for (let type in parameters.event) {
					htmlElement.addEventListener(type, parameters.event[type]);
				}
			}

	        return htmlElement;
	    },

		setAttribute: function (
			element: HTMLElement,
			attr: any
		): void {
			for(let key in attr) {
				element.setAttributeNS( null, key, <string>attr[key] );
			}
		},

		insertAfter: function (
			elem: HTMLElement,
			refElem: HTMLElement
		): HTMLElement {
		    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
		}
	};
}
