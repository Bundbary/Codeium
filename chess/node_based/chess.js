function chessGame(game) {
	/**
	 * Creates the chessboard with labeled squares.
	 * @returns {HTMLElement} The chessboard element.
	 */
	function createBoard() {
		const board = document.createElement("div");
		board.id = "board";
		board.classList.add("board");

		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 8; col++) {
				const square = document.createElement("div");
				square.classList.add("square");

				const squareID = document.createElement("span");
				squareID.textContent = `${String.fromCharCode(97 + col)}${8 - row}`;
				squareID.classList.add("squareID");
				square.appendChild(squareID);
				square.id = squareID.textContent;

				if ((row + col) % 2 === 0) {
					square.classList.add("white");
					squareID.style.color = 'black';
				} else {
					square.classList.add("black");
					squareID.style.color = 'white';
				}

				board.appendChild(square);
			}
		}

		return board;
	}

	/**
	 * Computes the new square ID based on a move vector.
	 * @param {string} currentSquare - The current square ID (e.g., "e2").
	 * @param {Array<number>} move - The move vector [fileOffset, rankOffset].
	 * @returns {string|null} The new square ID or null if out of bounds.
	 */
	function computeNewSquareID(currentSquare, move) {
		const file = currentSquare.charCodeAt(0); // 'a' is 97
		const rank = parseInt(currentSquare[1], 10);

		const newFile = String.fromCharCode(file + move[0]);
		const newRank = rank + move[1];

		if (newFile >= 'a' && newFile <= 'h' && newRank >= 1 && newRank <= 8) {
			return newFile + newRank;
		}
		return null;
	}

	/**
	 * Checks if a square is occupied by any piece.
	 * @param {HTMLElement} square - The square element.
	 * @returns {boolean} True if the square is occupied.
	 */
	function isSquareOccupied(square) {
		return square.querySelector("[data-piece]") !== null;
	}

	/**
	 * Checks if a square is occupied by an opponent's piece.
	 * @param {HTMLElement} square - The square element.
	 * @param {string} color - The color of the current player's piece.
	 * @returns {boolean} True if the square is occupied by an opponent.
	 */
	function isSquareOccupiedByOpponent(square, color) {
		const piece = square.querySelector("[data-piece]");
		return piece && piece.dataset.color !== color;
	}

	/**
	 * Gets the legal squares for a given piece.
	 * @param {HTMLElement} piece - The piece element.
	 * @returns {Array<HTMLElement>} An array of legal square elements.
	 */
	function getLegalMoves(piece) {
		const legalSquares = [];
		const currentSquare = piece.parentNode;
		const pieceColor = piece.dataset.color;
		const pieceType = piece.dataset.piece;
		const currentSquareID = currentSquare.id;

		const movePatterns = {
			pawn: pieceColor === 'white'
				? { straight: [[0, 1], [0, 2]], diagonal: [[-1, 1], [1, 1]] }
				: { straight: [[0, -1], [0, -2]], diagonal: [[-1, -1], [1, -1]] },
			rook: [[1, 0], [-1, 0], [0, 1], [0, -1]],
			knight: [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]],
			bishop: [[1, 1], [1, -1], [-1, 1], [-1, -1]],
			queen: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]],
			king: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]
		};

		// Determine legal moves for the piece
		if (pieceType === 'pawn') {
			const { straight, diagonal } = movePatterns.pawn;
			if (currentSquareID.charAt(1) !== '2' && currentSquareID.charAt(1) !== '7') {
				straight.pop();
			}

			straight.forEach(move => {
				const newSquareID = computeNewSquareID(currentSquareID, move);
				if (newSquareID) {
					const newSquare = document.getElementById(newSquareID);
					if (!isSquareOccupied(newSquare)) {
						legalSquares.push(newSquare);
					}
				}
			});

			diagonal.forEach(move => {
				const newSquareID = computeNewSquareID(currentSquareID, move);
				if (newSquareID) {
					const newSquare = document.getElementById(newSquareID);
					if (newSquare && isSquareOccupiedByOpponent(newSquare, pieceColor)) {
						legalSquares.push(newSquare);
					}
				}
			});
		} else {
			movePatterns[pieceType].forEach(move => {
				for (let i = 1; i < 8; i++) {
					const scaledMove = [move[0] * i, move[1] * i];
					const newSquareID = computeNewSquareID(currentSquareID, scaledMove);
					if (!newSquareID) break;
					const newSquare = document.getElementById(newSquareID);
					if (isSquareOccupied(newSquare)) {
						if (isSquareOccupiedByOpponent(newSquare, pieceColor)) {
							legalSquares.push(newSquare);
						}
						break;
					}
					legalSquares.push(newSquare);
				}
			});
		}

		return legalSquares;
	}

	/**
	 * Clears all highlights and selected classes from the board.
	 */
	function clearHighlights() {
		const highlightedSquares = game.board.querySelectorAll(".highlighted");
		highlightedSquares.forEach(square => {
			square.classList.remove("highlighted");
			square.removeEventListener("click", movePiece);
		});

		const selectedPieces = game.board.querySelectorAll(".selected");
		selectedPieces.forEach(square => {
			square.classList.remove("selected");
		});

		const lastMovedPieces = game.board.querySelectorAll(".lastmove");
		lastMovedPieces.forEach(square => {
			square.classList.remove("lastmove");
		});
	}

	/**
	 * Moves a piece to a new square.
	 * @param {Event} e - The click event.
	 */
	function movePiece(e) {
		let targetSquare = e.target;
		if (!targetSquare.classList.contains("square")) {
			targetSquare = targetSquare.parentNode;
		}

		const selectedSquare = game.board.querySelector(".selected");
		clearHighlights();

		const capturedPiece = targetSquare.querySelector(".piece");
		if (capturedPiece) {
			capturedPiece.classList.remove("piece");
			capturedPiece.classList.add("captured");
			const removedContainer = capturedPiece.dataset.color === 'white' ? removedWhitePieces : removedBlackPieces;
			removedContainer.appendChild(capturedPiece);
		}

		const movingPiece = selectedSquare.querySelector("[data-piece]");
		targetSquare.appendChild(movingPiece);
		movingPiece.classList.add("lastmove");
		swapMoves();

	}
	function swapMoves() {

		// Update the turn
		game.turn = game.turn === 'white' ? 'black' : 'white';

		if (game.turn === 'white') {
			removedWhitePieces.append(divTurnIcon);

		} else if (game.turn === 'black') {
			removedBlackPieces.append(divTurnIcon);

		}
	}

	/**
	 * Handles the click event on a piece to show legal moves.
	 * @param {Event} e - The click event.
	 */
	function selectPiece(e) {
		const piece = e.target;
		const square = piece.parentNode;

		// Check if it's the current player's turn
		if (game.turn !== piece.dataset.color) {
			return;
		}
		clearHighlights();

		if (square.classList.contains("selected")) {
			square.classList.remove("selected");
		} else {
			square.classList.add("selected");
			const legalSquares = getLegalMoves(piece);
			legalSquares.forEach(square => {
				square.classList.add("highlighted");
				square.addEventListener("click", movePiece);
			});
		}
	}

	/**
	 * Adds pieces to the board based on the game state.
	 * @param {Object} game - The game state object.
	 */
	/**
 * Adds pieces to the board based on the game state.
 * @param {Object} game - The game state object.
 */
	function initializePieces(game) {
		game.pieces.forEach(piece => {
			const square = document.getElementById(piece.square);
			const pieceDiv = document.createElement("div");
			pieceDiv.classList.add("piece");
			pieceDiv.dataset.piece = piece.name;
			pieceDiv.dataset.color = piece.color;

			const pieceSymbols = {
				king: { white: "♔", black: "♚" },
				queen: { white: "♕", black: "♛" },
				rook: { white: "♖", black: "♜" },
				bishop: { white: "♗", black: "♝" },
				knight: { white: "♘", black: "♞" },
				pawn: { white: "♙", black: "♟" }
			};

			pieceDiv.textContent = pieceSymbols[piece.name][piece.color];
			pieceDiv.addEventListener("click", selectPiece);
			square.appendChild(pieceDiv);
		});
	}


	function flipBoard() {
		const board = document.getElementById("gameContainer");
		removedWhitePieces.classList.toggle("flipped");
		removedBlackPieces.classList.toggle("flipped");
		board.classList.toggle("flipped");
		

		// Get all the squares on the board
		const squares = document.querySelectorAll("#board .square");
		// Loop through each square and toggle the "flipped" class
		squares.forEach(square => {
			square.classList.toggle("flipped");
		});

	}
	function placeNodes() {
		
	}
	document.getElementById("flipBoard").addEventListener("click", flipBoard);
	// Set up the game container
	const gameContainer = document.getElementById("gameContainer");
	gameContainer.innerHTML = "";

	// Create and append the containers for removed pieces
	const removedWhitePieces = document.createElement("div");
	removedWhitePieces.id = "removedWhitePieces";
	removedWhitePieces.classList.add("removed-pieces-container");

	const removedBlackPieces = document.createElement("div");
	removedBlackPieces.id = "removedBlackPieces";
	removedBlackPieces.classList.add("removed-pieces-container");

	
	removedBlackPieces.textContent = "Black Pieces";
	removedWhitePieces.textContent = "White Pieces";



	const divTurnIcon = document.createElement("div");
	divTurnIcon.id = "turnIcon";
	divTurnIcon.classList.add("turnIcon");
	divTurnIcon.textContent = "☺";


	// Create and append the chessboard
	game.board = createBoard();

	gameContainer.append(removedBlackPieces);
	gameContainer.append(game.board);
	gameContainer.append(removedWhitePieces);

	placeNodes


	removedWhitePieces.append(divTurnIcon);

	// Initialize the pieces on the board

	initializePieces(game);
	// Reposition the removed pieces containers
	return game;
}

export default { chessGame };