module Editor {

	export class EditorWindow {
		public view_element: HTMLElement;
		protected callback: Function;

		constructor(
			element: HTMLElement,
			callback: Function
		) {
			this.view_element = element;
			this.callback = callback;

			let close_button = this.view_element.querySelector('.close-button');
			close_button.addEventListener('click', () => {
				this.view_element.classList.remove('show');
			});

			let done_button = this.view_element.querySelector('.done-button');
			done_button.addEventListener('click', () => this.done());
		}

		public show(): void {
			this.view_element.classList.add('show');
		}

		protected done(): void {
			if (this.callback) this.callback();
			this.view_element.classList.remove('show');
		}

		public onDone(callback: Function): void {}

	}
}
