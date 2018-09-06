/// <reference path="abstract-easy-input.ts" />
/// <reference path="text-easy-input.ts" />
/// <reference path="number-easy-input.ts" />
/// <reference path="textarea-easy-input.ts" />
/// <reference path="checkbox-easy-input.ts" />
/// <reference path="point-easy-input.ts" />
/// <reference path="select-easy-input.ts" />
/// <reference path="color-easy-input.ts" />
/// <reference path="gradient-easy-input.ts" />
module Utils {
	import TextEasyInput = EasyInputModule.TextEasyInput;
	import NumberEasyInput = EasyInputModule.NumberEasyInput;
	import TextareaEasyInput = EasyInputModule.TextareaEasyInput;
	import CheckboxEasyInput = EasyInputModule.CheckboxEasyInput;
	import PointEasyInput = EasyInputModule.PointEasyInput;
	import SelectEasyInput = EasyInputModule.SelectEasyInput;
	import ColorEasyInput = EasyInputModule.ColorEasyInput;
	import GradientEasyInput = EasyInputModule.GradientEasyInput;

	interface IInitParameters {
		key?: string;
		label?: boolean|string;
		type?: string;
		step?: number;
		min?: number;
		max?: number;
		values?: any;
		parent?: HTMLElement;
		class?: string[];
		placeholder?: string;
		rows?: string;
	}

	export function easyInput(
		parameters: IInitParameters,
		change_callback: Function,
		view_element?: HTMLElement
	): EasyInput {
		let type = parameters.type || 'text';

		if (type == 'text') { return new TextEasyInput(parameters, change_callback, view_element); } else
		if (type == 'number') { return new NumberEasyInput(parameters, change_callback, view_element); } else
		if (type == 'textarea') { return new TextareaEasyInput(parameters, change_callback, view_element); } else
		if (type == 'checkbox') { return new CheckboxEasyInput(parameters, change_callback, view_element); } else
		if (type == 'point') { return new PointEasyInput(parameters, change_callback, view_element); } else
		if (type == 'select') { return new SelectEasyInput(parameters, change_callback, view_element); } else
		if (type == 'color') { return new ColorEasyInput(parameters, change_callback, view_element); } else
		if (type == 'gradient') { return new GradientEasyInput(parameters, change_callback, view_element); }
		else { console.warn('Invalid type.', parameters); }
	}
}
