
function chessGame(game) {
	function createSquares() {
		const boardDiv = document.createElement("div");
		boardDiv.id = "board";
		boardDiv.classList.add("board");
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const square = document.createElement("div");
				square.classList.add("square");
				const label = document.createElement("span");
				label.textContent = `${String.fromCharCode(97 + j)}${8 - i}`;

				label.classList.add("label");
				square.appendChild(label);
				square.id = label.textContent;
				if ((i + j) % 2 === 0) {
					square.classList.add("white");
					label.style.color = 'black';
				} else {
					square.classList.add("black");
					label.style.color = 'white';
				}

				boardDiv.appendChild(square);
			}
		}
		return boardDiv
	}
	function getNewSquare(sSquareOld, aSquareNew) {
		let row = sSquareOld.charCodeAt(0) + aSquareNew[0];
		let col = sSquareOld.charCodeAt(1) + aSquareNew[1];
		const sSquareNew = String.fromCharCode(row) + String.fromCharCode(col);
		return sSquareNew;
	}


	function getLegalSquares(nodePiece) {
		const legalSquares = [];
		const nodeSquare = nodePiece.parentNode;
		const colorPiece = nodePiece.dataset.color;
		const pieceName = nodePiece.dataset.piece;
		const nodeSquareId = nodeSquare.id;
		const nodeSquareColor = nodeSquare.classList.contains("white") ? "white" : "black";
		if (pieceName === "pawn") {
			let aStraightMoves = [];
			let aDiagMoves = [];
			if (colorPiece === "white") {
				aStraightMoves = [[0, 1], [0, 2]];
				aDiagMoves = [[-1, 1], [1, 1]];
			} else if (colorPiece === "black") {
				aStraightMoves = [[0, -1], [0, -2]];
				aDiagMoves = [[-1, -1], [1, -1]];
			}
			for (let aMove of aStraightMoves) {
				const sIDNew = getNewSquare(nodeSquareId, aMove);
				const nodeSquareNew = document.getElementById(sIDNew);
				const pieceNew = nodeSquareNew.querySelector("[data-piece]");
				//if there is a piece in front of the pawn it's not legal.
				if (!pieceNew) {
					legalSquares.push(nodeSquareNew);
				}
			}
			for (let aMove of aStraightMoves) {
				const sIDNew = getNewSquare(nodeSquareId, aMove);
				const nodeSquareNew = document.getElementById(sIDNew);
				const pieceNew = nodeSquareNew.querySelector("[data-piece]");
				if (pieceNew) {
					const colorNew = pieceNew.dataset.color;
					if (colorNew !== colorPiece) {
						legalSquares.push(nodeSquareNew);
					}
				}
			}

		} else if (pieceName === "rook") {

		} else if (pieceName === "knight") {

		} else if (pieceName === "bishop") {

		} else if (pieceName === "queen") {

		} else if (pieceName === "king") {

		}






		return legalSquares


	}
	function clickPiece(e) {
		const highlightedSquares = game.board.querySelectorAll(".highlighted");
		for (let square of highlightedSquares) {
			square.classList.remove("highlighted");
		}

		const piece = e.target;
		const square = piece.parentNode;

		if (square.classList.contains("selected")) {
			square.classList.remove("selected");
		} else {
			const selectedPieces = game.board.querySelectorAll(".selected");
			for (let square of selectedPieces) {
				square.classList.remove("selected");
			}
			square.classList.add("selected");
			const a = getLegalSquares(piece);
			for (let squareNew of a) {
				squareNew.classList.add("highlighted");
			}
		}
	}

	function addPieces(game) {
		game.pieces.forEach(piece => {
			const square = document.getElementById(piece.square);
			const pieceDiv = document.createElement("div");
			pieceDiv.classList.add("piece");
			const pieceChar = {
				pawn: piece.color === 'white' ? '♙' : '♟',
				rook: piece.color === 'white' ? '♖' : '♜',
				knight: piece.color === 'white' ? '♘' : '♞',
				bishop: piece.color === 'white' ? '♗' : '♝',
				queen: piece.color === 'white' ? '♕' : '♛',
				king: piece.color === 'white' ? '♔' : '♚'
			}[piece.name];
			// pieceDiv.createAttribute("data-piece", piece.name);
			pieceDiv.dataset.piece = piece.name;
			pieceDiv.dataset.color = piece.color;



			pieceDiv.textContent = pieceChar;
			square.appendChild(pieceDiv);
			pieceDiv.addEventListener("click", clickPiece);
		})
	}
	if (!game) {
		game = {
			pieces: [
				{ square: 'a1', name: 'rook', color: 'white' },
				{ square: 'b1', name: 'knight', color: 'white' },
				{ square: 'c1', name: 'bishop', color: 'white' },
				{ square: 'd1', name: 'queen', color: 'white' },
				{ square: 'e1', name: 'king', color: 'white' },
				{ square: 'f1', name: 'bishop', color: 'white' },
				{ square: 'g1', name: 'knight', color: 'white' },
				{ square: 'h1', name: 'rook', color: 'white' },
				{ square: 'a2', name: 'pawn', color: 'white' },
				{ square: 'b2', name: 'pawn', color: 'white' },
				{ square: 'c2', name: 'pawn', color: 'white' },
				{ square: 'd2', name: 'pawn', color: 'white' },
				{ square: 'e2', name: 'pawn', color: 'white' },
				{ square: 'f2', name: 'pawn', color: 'white' },
				{ square: 'g2', name: 'pawn', color: 'white' },
				{ square: 'h2', name: 'pawn', color: 'white' },
				{ square: 'a8', name: 'rook', color: 'black' },
				{ square: 'b8', name: 'knight', color: 'black' },
				{ square: 'c8', name: 'bishop', color: 'black' },
				{ square: 'd8', name: 'queen', color: 'black' },
				{ square: 'e8', name: 'king', color: 'black' },
				{ square: 'f8', name: 'bishop', color: 'black' },
				{ square: 'g8', name: 'knight', color: 'black' },
				{ square: 'h8', name: 'rook', color: 'black' },
				{ square: 'a7', name: 'pawn', color: 'black' },
				{ square: 'b7', name: 'pawn', color: 'black' },
				{ square: 'c7', name: 'pawn', color: 'black' },
				{ square: 'd7', name: 'pawn', color: 'black' },
				{ square: 'e7', name: 'pawn', color: 'black' },
				{ square: 'f7', name: 'pawn', color: 'black' },
				{ square: 'g7', name: 'pawn', color: 'black' },
				{ square: 'h7', name: 'pawn', color: 'black' }
			]
		}
	}

	game.board = createSquares();
	setTimeout(() => {
		addPieces(game);

	}, 100);

	return game.board;
}

export default { chessGame };