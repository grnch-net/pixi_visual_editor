module GameObject {
	export class Point {

		constructor(
			public _x: number = 0,
			public _y: number = 0,
			public update: Function
		) {}

		get x(): number { return this._x; }
		set x(value: number) { this._x = value; this.update(this._x, this._y); }

		get y(): number { return this._y; }
		set y(value: number) { this._y = value; this.update(this._x, this._y); }

		public set(
			x: number,
			y: number
		): void {
			this._x = x;
			this._y = y;
			this.update(this._x, this._y);
		};
	}
}
