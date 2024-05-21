
function chessGame(game) {
	function createSquares() {
		const boardDiv = document.createElement("div");
		boardDiv.id = "board";
		boardDiv.classList.add("board");
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const square = document.createElement("div");
				square.classList.add("square");
				const labelSquareID = document.createElement("span");
				labelSquareID.textContent = `${String.fromCharCode(97 + j)}${8 - i}`;

				labelSquareID.classList.add("labelSquareID");
				square.appendChild(labelSquareID);
				square.id = labelSquareID.textContent;
				if ((i + j) % 2 === 0) {
					square.classList.add("white");
					labelSquareID.style.color = 'black';
				} else {
					square.classList.add("black");
					labelSquareID.style.color = 'white';
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


	function getNewSquare(id, move) {
		// Assuming id is in the form of "e2", "d4", etc.
		const file = id.charCodeAt(0); // 'a' is 97, 'b' is 98, etc.
		const rank = parseInt(id[1], 10);
		const newFile = String.fromCharCode(file + move[0]);
		const newRank = rank + move[1];
		if (newFile >= 'a' && newFile <= 'h' && newRank >= 1 && newRank <= 8) {
			return newFile + newRank;
		}
		return null;
	}

	function isSquareOccupied(nodeSquare) {
		return nodeSquare.querySelector("[data-piece]");
	}

	function isSquareOccupiedByOpponent(nodeSquare, color) {
		const piece = nodeSquare.querySelector("[data-piece]");
		return piece && piece.dataset.color !== color;
	}

	function getLegalSquares(nodePiece) {
		const legalSquares = [];
		const nodeSquare = nodePiece.parentNode;
		const colorPiece = nodePiece.dataset.color;
		const pieceName = nodePiece.dataset.piece;
		const nodeSquareId = nodeSquare.id;

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
			if (nodeSquareId.charAt(1) !== '2' && nodeSquareId.charAt(1) !== '7') {
				aStraightMoves.pop();
			}
			for (let aMove of aStraightMoves) {
				const sIDNew = getNewSquare(nodeSquareId, aMove);
				if (!sIDNew) continue;
				const nodeSquareNew = document.getElementById(sIDNew);
				if (!isSquareOccupied(nodeSquareNew)) {
					legalSquares.push(nodeSquareNew);
				}
			}
			for (let aMove of aDiagMoves) {
				const sIDNew = getNewSquare(nodeSquareId, aMove);
				if (!sIDNew) continue;
				const nodeSquareNew = document.getElementById(sIDNew);
				if (nodeSquareNew && isSquareOccupiedByOpponent(nodeSquareNew, colorPiece)) {
					legalSquares.push(nodeSquareNew);
				}
			}

		} else if (pieceName === "rook") {
			const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
			directions.forEach(direction => {
				for (let i = 1; i < 8; i++) {
					const sIDNew = getNewSquare(nodeSquareId, [direction[0] * i, direction[1] * i]);
					if (!sIDNew) break;
					const nodeSquareNew = document.getElementById(sIDNew);
					if (isSquareOccupied(nodeSquareNew)) {
						if (isSquareOccupiedByOpponent(nodeSquareNew, colorPiece)) {
							legalSquares.push(nodeSquareNew);
						}
						break;
					}
					legalSquares.push(nodeSquareNew);
				}
			});

		} else if (pieceName === "knight") {
			const moves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
			moves.forEach(move => {
				const sIDNew = getNewSquare(nodeSquareId, move);
				if (!sIDNew) return;
				const nodeSquareNew = document.getElementById(sIDNew);
				if (!isSquareOccupied(nodeSquareNew) || isSquareOccupiedByOpponent(nodeSquareNew, colorPiece)) {
					legalSquares.push(nodeSquareNew);
				}
			});

		} else if (pieceName === "bishop") {
			const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
			directions.forEach(direction => {
				for (let i = 1; i < 8; i++) {
					const sIDNew = getNewSquare(nodeSquareId, [direction[0] * i, direction[1] * i]);
					if (!sIDNew) break;
					const nodeSquareNew = document.getElementById(sIDNew);
					if (isSquareOccupied(nodeSquareNew)) {
						if (isSquareOccupiedByOpponent(nodeSquareNew, colorPiece)) {
							legalSquares.push(nodeSquareNew);
						}
						break;
					}
					legalSquares.push(nodeSquareNew);
				}
			});

		} else if (pieceName === "queen") {
			const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
			directions.forEach(direction => {
				for (let i = 1; i < 8; i++) {
					const sIDNew = getNewSquare(nodeSquareId, [direction[0] * i, direction[1] * i]);
					if (!sIDNew) break;
					const nodeSquareNew = document.getElementById(sIDNew);
					if (isSquareOccupied(nodeSquareNew)) {
						if (isSquareOccupiedByOpponent(nodeSquareNew, colorPiece)) {
							legalSquares.push(nodeSquareNew);
						}
						break;
					}
					legalSquares.push(nodeSquareNew);
				}
			});

		} else if (pieceName === "king") {
			const moves = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
			moves.forEach(move => {
				const sIDNew = getNewSquare(nodeSquareId, move);
				if (!sIDNew) return;
				const nodeSquareNew = document.getElementById(sIDNew);
				if (!isSquareOccupied(nodeSquareNew) || isSquareOccupiedByOpponent(nodeSquareNew, colorPiece)) {
					legalSquares.push(nodeSquareNew);
				}
			});
		}

		return legalSquares;
	}

	function clearAllHighlights() {

		const legalSquaresSquares = game.board.querySelectorAll(".legalSquares");
		for (let square of legalSquaresSquares) {
			square.classList.remove("legalSquares");
			square.removeEventListener("click", movePiece);
		}

		const selectedPieces = game.board.querySelectorAll(".selected");
		for (let square of selectedPieces) {
			square.classList.remove("selected");
		}
		const lastMoved = game.board.querySelectorAll(".lastmove");
		for (let square of lastMoved) {
			square.classList.remove("lastmove");
		}
	}

	function movePiece(e) {

		let squareNew = e.target;
		if(!squareNew.classList.contains("square")){
			squareNew=squareNew.parentNode;
		}	



		const squareOld = game.board.querySelector(`.selected`);
		clearAllHighlights();
		const pieceToKill = squareNew.querySelector(".piece");
		if (pieceToKill) {
			pieceToKill.classList.remove("piece");
			pieceToKill.classList.add("captured");


			 removedPieces.append(pieceToKill);
		}
		const pieceToMove = squareOld.querySelector("[data-piece]");
		squareNew.append(pieceToMove);




		pieceToMove.classList.add("lastmove");
		
		// Update the turn
		game.turn = game.turn === 'white' ? 'black' : 'white';

	}

	function clickPiece(e) {
		const piece = e.target;
		const square = piece.parentNode;

		// Check if it's the current player's turn
		if (game.turn !== piece.dataset.color) {
			return;
		}
		clearAllHighlights();

		if (square.classList.contains("selected")) {
			square.classList.remove("selected");
		} else {
			square.classList.add("selected");
			const a = getLegalSquares(piece);
			for (let squareNew of a) {
				squareNew.classList.add("legalSquares");
				squareNew.addEventListener("click", movePiece);
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

	function flipBoard() {
		const board = document.getElementById("board");
		board.classList.toggle("flipped");

		// Get all the squares on the board
		const squares = document.querySelectorAll("#board .square");

		// Loop through each square and toggle the "flipped" class
		squares.forEach(square => {
			square.classList.toggle("flipped");
		});
	}
	document.getElementById("flipBoard").addEventListener("click", flipBoard);
debugger;
	if (!game) {
		game = {
			turn: 'white',
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




		const removedPiecesDiv = document.createElement("div");
		removedPiecesDiv.id = "removedPieces";
	setTimeout(() => {
		addPieces(game);
		
		game.board.after(removedPiecesDiv);
		

	}, 100);

	return game.board;
}

export default { chessGame };