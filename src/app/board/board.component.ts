import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
	//for normal activities
	squares: any;
	xIsNext: boolean;
	winner: string;
	singlePlayer: boolean;
	difficulty: 0 | 1 | 2;

	//for only single player
	firstMoove: boolean;
	positions: number[];
	failedPlane: boolean;

	constructor() { }

	ngOnInit(): void { }

	newGame(): void {
		this.squares = Array(9).fill(null);
		this.winner = null;
		this.xIsNext = true;
		this.singlePlayer = null;
		this.difficulty = 0;
	}

	get player() {
		return this.xIsNext ? 'X' : 'O';
	}

	setSinglePlayer() {
		this.singlePlayer = true;
		this.firstMoove = true;
	}

	setDifficulty() {
		if (this.difficulty <= 2) {
			this.difficulty++;
		}
		if (this.difficulty > 2) {
			this.difficulty = 0;
		}
	}

	makeMove(idx: number): void {
		if (!this.winner) {
			if (!this.squares[idx]) {
				this.squares.splice(idx, 1, this.player);
				this.xIsNext = !this.xIsNext;
			}

			this.winner = this.calculateWinner();

			if (this.singlePlayer && !this.winner) {
				this.simpleAI();
				this.winner = this.calculateWinner();
			}
		}
	}

	calculateWinner(): string {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],

			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],

			[0, 4, 8],
			[2, 4, 6],
		];
		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (this.squares[a] &&
				this.squares[a] == this.squares[b] &&
				this.squares[b] == this.squares[c]
			) {
				return this.squares[a];
			}
		}
		return null;
	}

	simpleAI(): void {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],

			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],

			[0, 4, 8],
			[2, 4, 6],
		];
		if (this.player === 'O') {
			let selected = false;

			for (let i = 0; i < lines.length; i++) {
				const [a, b, c] = lines[i];

				//case a & b filled
				if (this.squares[a] == 'O' &&
					this.squares[a] == this.squares[b]
				) {
					if (!this.squares[c]) {
						this.squares.splice(c, 1, this.player);
						this.xIsNext = !this.xIsNext;
						selected = true;
						break;
					}
				}

				//case b & c filled
				else if (this.squares[b] == 'O' &&
					this.squares[c] == this.squares[b]
				) {
					if (!this.squares[a]) {
						this.squares.splice(a, 1, this.player);
						this.xIsNext = !this.xIsNext;
						selected = true;
						break;
					}
				}
			}

			//case no row so dumb move
			if (this.difficulty === 0) {
				while (!selected) {
					let random = Math.floor(Math.random() * (8));
					if (!this.squares[random]) {
						this.squares.splice(random, 1, this.player);
						this.xIsNext = !this.xIsNext;
						selected = true;
						break;
					}
				}
			}

			if (this.difficulty === 1) {
				const hotPosition = [0, 2, 4, 6, 8];
				while (!selected) {
					// take center or one angle
					if (this.firstMoove) {
						for (let p of hotPosition) {
							if (!this.squares[p]) {
								this.squares.splice(p, 1, this.player);
								this.xIsNext = !this.xIsNext;
								selected = true;
								this.positions.push(p);
								this.firstMoove = false;
								break;
							}
						}
					}
					// search the near cell
					else if (!this.firstMoove && !this.failedPlane) {
						for (let p of this.positions) {
							if (!this.squares[p + 1]) {
								this.squares.splice(p, 1, this.player);
								this.xIsNext = !this.xIsNext;
								selected = true;
								this.positions.push(p);
								break;
							}
							if (!this.squares[p - 1]) {
								this.squares.splice(p, 1, this.player);
								this.xIsNext = !this.xIsNext;
								selected = true;
								this.positions.push(p);
								break;
							}
						}
					} else {
						// no fucking idea
						let random = Math.floor(Math.random() * (8));
						if (!this.squares[random]) {
							this.squares.splice(random, 1, this.player);
							this.xIsNext = !this.xIsNext;
							selected = true;
							break;
						}
					}
				}
			} if (this.difficulty === 2) {
				const hotPosition = [0, 2, 4, 6, 8];
				if (this.firstMoove) {
					for (let p of hotPosition) {
						if (!this.squares[p]) {
							this.squares.splice(p, 1, this.player);
							this.xIsNext = !this.xIsNext;
							selected = true;
							this.positions.push(p);
							this.firstMoove = false;
							break;
						}
					}
				} else if (!this.firstMoove) {
					for (let i = 0; i < lines.length; i++) {
						const [a, b, c] = lines[i];

						//case a & b filled
						if (this.squares[a] == 'X' &&
							this.squares[a] == this.squares[b]
						) {
							if (!this.squares[c]) {
								this.squares.splice(c, 1, this.player);
								this.xIsNext = !this.xIsNext;
								selected = true;
								break;
							}
						}
						//case b & c filled
						else if (this.squares[b] == 'X' &&
							this.squares[c] == this.squares[b]
						) {
							if (!this.squares[a]) {
								this.squares.splice(a, 1, this.player);
								this.xIsNext = !this.xIsNext;
								selected = true;
								break;
							}
						}
						//case a & c filled
						else if (this.squares[a] == 'X' &&
							this.squares[a] == this.squares[c]
						) {
							if (!this.squares[b]) {
								this.squares.splice(b, 1, this.player);
								this.xIsNext = !this.xIsNext;
								selected = true;
								break;
							}
						}
					}
					if (selected) return;
				} else {
					// no fucking idea
					while (!selected) {
						let random = Math.floor(Math.random() * (8));
						if (!this.squares[random]) {
							this.squares.splice(random, 1, this.player);
							this.xIsNext = !this.xIsNext;
							selected = true;
							break;
						}
					}
				}
			}
		}
	}
}
