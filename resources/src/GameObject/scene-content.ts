/// <reference path="./Container.ts" />

module GameObject {

	export class SceneContent extends Container {
		protected create_hierarchy_element(attr?: any) {}
		protected create_view_elements(): void {}
		protected init_visible_event(): void {}

		public set name(value: string) {}

		public updateHierarchyElement(value: HTMLElement) {
			this.hierarchy_view_group_element = value;
		}
	}
}
