module Utils {
	export interface IEasyHTML {
		readonly svgns: string;
		readonly xlink: string;
		readonly svgTags: string[];

		createElement(parameters?: IHTMLElementConfig): HTMLElement;
		setAttribute(element: HTMLElement, attr?: { [key: string]: string | number }): void;
	}

	export interface IHTMLElementConfig {
		type?: string,
		parent?: HTMLElement,
		innerHTML?: string,
		attr?: {
			[key: string]: string | number;
		},
	}
}
