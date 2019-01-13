module Utils {
	export abstract class EasyInput {
		public view_element?: HTMLElement;

		constructor() {}

		public get value(): any { return; }
		public set value(value: any) {}

		public get readonly(): boolean { return; }
		public set readonly(value: boolean) {}

		public select() {}
		public unselect() {}
	}
}
