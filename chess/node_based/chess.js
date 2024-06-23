//START THE SERVER HERE. (base) PS C:\Users\bpenn\ExpectancyLearning\CodeiumTest\node_server> node server.js

function chessGame(game) {
	function getWebSocket() {
		const socket = new WebSocket('ws://localhost:3000');
		socket.onopen = function (event) {
			console.log('Connected to WebSocket server');
		};

		socket.onmessage = function (event) {
			const message = JSON.parse(event.data);
			// Handle the incoming move
			handleIncomingMove(message);
		};

		socket.onclose = function (event) {
			console.log('Disconnected from WebSocket server');
		};

		socket.onerror = function (error) {
			document.body.innerHTML = '<h1>Server not available: 🍋🍋🍋</h1>';
			console.error('WebSocket error:', error);
		};
		function markEnpassant() {
			const nodes = document.getElementsByClassName("enpassant");
			while (nodes.length > 0) {
				nodes[0].classList.remove("enpassant");
			}
			const nodeSquare = document.getElementById(game.enemyEnpassantID);
			if (nodeSquare) {
				nodeSquare.classList.add("enpassant");
			}

		}

		function handleIncomingMove(move) {
			// Update the chess board with the incoming move
			// This function should update the UI based on the move received
			if (move.color === game.turn) {

				if (move.capturedEnpassant) {
					capturePiece(document.querySelector(`.lastmove`));
				}



				game.enemyEnpassantID = move.enpassantID;
				game.timerWhiteSeconds = move.timerWhiteSeconds;
				game.timerBlackSeconds = move.timerBlackSeconds;
				markEnpassant();
				// Apply the move received from WebSocket
				const fromSquare = document.getElementById(move.from);
				const toSquare = document.getElementById(move.to);

				movePieceWebSocket(fromSquare, toSquare);
			}
			game.kingInCheck = move.kingInCheck;
			game.squareInCheck = move.squareInCheck;


			const check = game.board.querySelectorAll(".check");
			check.forEach(square => {
				square.classList.remove("check");
			});


			if (game.squareInCheck) {
				const node = document.getElementById(game.squareInCheck);
				node.classList.add('check');

				// node.style.backgroundColor = 'red';
			}


			if (move.mate) {
				finishGame(move.mate);


			}


		}
		return socket;
	}



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
				square.append(squareID);
				square.id = squareID.textContent;

				if ((row + col) % 2 === 0) {
					square.classList.add("white");
					squareID.style.color = 'black';
				} else {
					square.classList.add("black");
					squareID.style.color = 'white';
				}

				board.append(square);
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
		return square.querySelector("[data-piece]");
	}
	/**
	 * Checks if a square is occupied by an opponent's piece.
	 * @param {HTMLElement} square - The square element.
	 * @param {string} color - The color of the current player's piece.
	 * @returns {boolean} True if the square is occupied by an opponent.
	 */
	function isSquareOccupiedByOpponent(square, color) {
		const piece = square.querySelector("[data-piece]");
		return piece && piece.dataset.color !== color ? piece : null;
	}

	/**
	 * Gets the legal squares for a given piece.
	 * @param {HTMLElement} piece - The piece element.
	 * @returns {Array<HTMLElement>} An array of legal square elements.
	 */
	function getLegalMoves(piece, includeEnpassant = false) {
		function addEnpassantSquares(squareID) {

			try {
				if (game.enemyEnpassantID) {
					const file = squareID.charAt(0);
					const rank = squareID.charAt(1);

					const leftFile = String.fromCharCode(file.charCodeAt(0) - 1);
					const leftSquareID = leftFile + rank;
					const rightFile = String.fromCharCode(file.charCodeAt(0) + 1);
					const rightSquareID = rightFile + rank;
					let squareToPush;




					if (game.enemyEnpassantID === leftSquareID) {
						if (game.turn === "black") {
							squareToPush = document.getElementById(leftFile + (Number(rank) - 1));
						} else {
							squareToPush = document.getElementById(leftFile + (Number(rank) + 1));
						}

					} else if (game.enemyEnpassantID === rightSquareID) {
						if (game.turn === "black") {
							squareToPush = document.getElementById(rightFile + (Number(rank) - 1));
						} else {
							squareToPush = document.getElementById(rightFile + (Number(rank) + 1));
						}
					}
					if (squareToPush) {
						legalSquares.push(squareToPush);
						document.querySelector(".enpassant").classList.add("enpassantInCheck");
					}

				}
			} catch (error) {
				debugger;
			}




		}
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
						const newRow = Number(newSquareID.charAt(1));
						const currentRow = Number(currentSquareID.charAt(1));

						if (includeEnpassant && Math.abs(newRow - currentRow) === 2 && currentSquareID.charAt(0) === newSquareID.charAt(0)) {
							game.enpassantID = newSquareID;

						}
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
			if (includeEnpassant) {
				addEnpassantSquares(currentSquareID);
			}



		} else {
			movePatterns[pieceType].forEach(move => {
				if (pieceType === 'king' || pieceType === 'knight') {
					// Handle king and knight moves without scaling
					const newSquareID = computeNewSquareID(currentSquareID, move);
					if (newSquareID) {
						const newSquare = document.getElementById(newSquareID);
						if (!isSquareOccupied(newSquare) || isSquareOccupiedByOpponent(newSquare, pieceColor)) {
							legalSquares.push(newSquare);
						}
					}
				} else {
					// Handle sliding pieces (rook, bishop, queen)
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
				}
			});

		}

		return legalSquares;
	}

	function checkForCheck() {



		const check = game.board.querySelectorAll(".check");
		check.forEach(square => {
			square.classList.remove("check");
		});
		game.squareInCheck = null;



		const allLegalMoves = [].concat(...getAllLegalMoves());
		for (let i = 0; i < allLegalMoves.length; i++) {
			const square = allLegalMoves[i];
			const king = square.querySelector("[data-piece='king']");
			if (king && king.dataset.color !== game.turn) {
				// king.style.backgroundColor = "red";

				king.classList.add('check');

				game.kingInCheck = king
				game.squareInCheck = king.parentNode.id;
				return king;
			}


		}


		return null;






	}

	function isCheckmate() {
		// First, check if the king is in check
		if (!checkForCheck()) {
			return false;
		}

		// Get all pieces of the opponent player
		const opponentColor = game.turn === 'white' ? 'black' : 'white';
		const opponentPieces = Array.from(game.board.querySelectorAll(`.piece[data-color="${opponentColor}"]`));

		// For each piece, check if it has any legal moves that can get the king out of check
		for (const piece of opponentPieces) {
			const legalMoves = getLegalMoves(piece);

			for (const moveSquare of legalMoves) {
				// Simulate the move
				const originalSquare = piece.parentNode;
				const capturedPiece = moveSquare.querySelector('.piece');

				if (capturedPiece) {
					moveSquare.removeChild(capturedPiece);
				}
				moveSquare.appendChild(piece);

				// Check if the king is still in check after this move
				const stillInCheck = checkForCheck();

				// Undo the move
				originalSquare.appendChild(piece);
				if (capturedPiece) {
					moveSquare.appendChild(capturedPiece);
				}

				// If this move gets the king out of check, it's not checkmate
				if (!stillInCheck) {
					return false;
				}
			}
		}

		// If we've checked all pieces and all moves, and none get the king out of check, it's checkmate

		return opponentColor;
	}
	function getAllLegalMoves() {
		const pieces = game.board.querySelectorAll(".piece");
		const allLegalMoves = [];

		pieces.forEach(piece => {
			const legalSquares = getLegalMoves(piece);
			allLegalMoves.push(...legalSquares);
		});

		return allLegalMoves;
	}




	/**
	 * Clears all highlights and selected classes from the board.
	 */
	function clearHighlights() {

		const classesToRemove = ["selected", "legalSquares", "lastmove", "enpassantInCheck"];

		classesToRemove.forEach(className => {
			const elements = game.board.querySelectorAll(`.${className}`);
			elements.forEach(element => {
				element.classList.remove(className);
			});
		});




		// const enpassantInCheck = game.board.querySelectorAll(".enpassantInCheck");
		// enpassantInCheck.forEach(square => {
		// 	square.classList.remove("enpassantInCheck");
		// });




		// const legalSquaresSquares = game.board.querySelectorAll(".legalSquares");
		// legalSquaresSquares.forEach(square => {
		// 	square.classList.remove("legalSquares");
		// 	square.removeEventListener("click", movePiece);
		// });

		// const selectedPieces = game.board.querySelectorAll(".selected");
		// selectedPieces.forEach(square => {
		// 	square.classList.remove("selected");
		// });

		// const lastMovedPieces = game.board.querySelectorAll(".lastmove");
		// lastMovedPieces.forEach(square => {
		// 	square.classList.remove("lastmove");
		// });
	}

	/**
	 * Moves a piece to a new square.
	 * @param {Event} e - The click event.
	 */
	function capturePiece(capturedPiece) {

		if (capturedPiece) {
			console.log(capturedPiece);
			capturedPiece.classList.remove("piece");
			capturedPiece.classList.add("captured");
			const removedContainer = capturedPiece.dataset.color === 'white' ? capturedWhitePieces : capturedBlackPieces;
			removedContainer.append(capturedPiece);
		} else {
			debugger;
		}
	}
	function movePiece(e) {
		let targetSquare = e.target;




		if (!targetSquare.classList.contains("square")) {
			targetSquare = targetSquare.parentNode;
		}


		let capturedPiece = targetSquare.querySelector(".piece");



		if (capturedPiece && targetSquare.classList.contains("selected")) {
			return;
		}




		const enpassantPiece = game.board.querySelector(".enpassantInCheck");
		if (enpassantPiece) {
			capturedPiece = enpassantPiece.querySelector(".piece");
			game.board.querySelector(".enpassant").classList.remove("enpassant");
			game.capturedEnpassant = enpassantPiece.id;
		}
		const selectedSquare = game.board.querySelector(".selected");
		clearHighlights();





		if (capturedPiece) {
			capturePiece(capturedPiece);
		}

		const movingPiece = selectedSquare.querySelector("[data-piece]");
		targetSquare.append(movingPiece);
		movingPiece.classList.add("lastmove");


		const mate = isCheckmate();
		if (mate) {
			finishGame(mate);
		}


		checkForCheck();
		// Send the move via WebSocket if user-controlled
		if (game.webSocket && game.webSocket.readyState === WebSocket.OPEN && game.turn !== webSocketColor) {
			let fileName = game.creator.name + '_vs_' + game.acceptor.name + '.json';
			fileName = fileName.replace(/[\\/:*?"<>|]/g, '');
			const dataToSend = {
				fileSave: {
					fileName: "chess_games/" + fileName,
					flag: 'append'
				},
				from: selectedSquare.id,
				to: targetSquare.id,
				color: game.turn,
				timerWhiteSeconds: game.timerWhiteSeconds,
				timerBlackSeconds: game.timerBlackSeconds,
				creator: game.creator,
				acceptor: game.acceptor,
				turn: game.turn,
				enpassantID: game.enpassantID,
				squareInCheck: game.squareInCheck,
				kingInCheck: game.kingInCheck,
				mate,
				capturedEnpassant: game.capturedEnpassant

			}
			game.webSocket.send(JSON.stringify(dataToSend));

		}


		swapMoves();
		timer.startTimer();



	}
	function finishGame(mate) {
		timer.stopTimer();
		document.querySelector(".board").classList.add("disabled");
		// You might want to end the game here or disable further moves
		if (game.kingInCheck) {
			console.log(game.kingInCheck);
			if (mate === 'white') {
				// alert(`Checkmate! Black wins!`);
				capturedBlackPieces.innerHTML = ("<div>winner</div>");
			} else {
				// alert(`Checkmate! White wins!`);

				capturedWhitePieces.innerHTML = ("<div>winner</div>");
			}
		}

		// You might want to end the game here or disable further moves

	}
	/**
	 * Moves a piece to a new square for WebSocket-controlled moves.
	 * @param {HTMLElement} fromSquare - The square the piece is moving from.
	 * @param {HTMLElement} toSquare - The square the piece is moving to.
	 */
	function movePieceWebSocket(fromSquare, toSquare) {
		//this function could be better combined with movePiece
		clearHighlights();
		const capturedPiece = toSquare.querySelector(".piece");
		if (capturedPiece) {
			capturedPiece.classList.remove("piece");
			capturedPiece.classList.add("captured");
			const removedContainer = capturedPiece.dataset.color === 'white' ? capturedWhitePieces : capturedBlackPieces;
			removedContainer.append(capturedPiece);
		}

		const movingPiece = fromSquare.querySelector("[data-piece]");
		toSquare.append(movingPiece);
		movingPiece.classList.add("lastmove");
		swapMoves();
		timer.startTimer();
	}

	function setWhiteBlack() {

		if (game.turn === 'white') {
			capturedWhitePieces.prepend(divTurnIcon);
			capturedWhitePieces.classList.add('selected');
			capturedBlackPieces.classList.remove('selected');

		} else {
			capturedBlackPieces.prepend(divTurnIcon);
			capturedBlackPieces.classList.add('selected');
			capturedWhitePieces.classList.remove('selected');

		}
	}
	function swapMoves() {

		// Update the turn
		game.turn = game.turn === 'white' ? 'black' : 'white';
		setWhiteBlack();
	}

	function isUserTurn(pieceColor) {
		return game.turn === pieceColor && pieceColor === userColor;
	}
	function selectPiece(e) {
		game.enpassantID = null;



		const piece = e.target;





		const square = piece.parentNode;

		// Check if it's the current player's turn and controlled by the user
		if (!isUserTurn(piece.dataset.color)) {
			return;
		}
		clearHighlights();

		if (square.classList.contains("selected")) {
			square.classList.remove("selected");
		} else {
			square.classList.add("selected");
			const legalSquares = getLegalMoves(piece, true);


			legalSquares.forEach(square => {
				square.classList.add("legalSquares");
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
		let pieces = game.pieces;




		pieces.forEach(piece => {
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
			square.append(pieceDiv);
		});
		setWhiteBlack();
		if (game.creator.name === game.username) {
			game.currentUser = game.creator;
		} else if (game.acceptor.name === game.username) {
			game.currentUser = game.acceptor;
		}
		// alert('this is wrong. username is the same for both players currently.')


		// Determines which player is controlled by the user and which by WebSocket

		if ("black" === game.currentUser.color) {
			// if (webSocketColor !== game.currentUser.color) {
			flipBoard();

			// Determines which player is controlled by the user and which by WebSocket
			userColor = 'black';
			webSocketColor = 'white';

		}


	}

	function flipBoard() {
		const board = document.getElementById("gameContainer");
		capturedWhitePieces.classList.toggle("flipped");
		capturedBlackPieces.classList.toggle("flipped");
		board.classList.toggle("flipped");


		// Get all the squares on the board
		const squares = document.querySelectorAll("#board .square");
		// Loop through each square and toggle the "flipped" class
		squares.forEach(square => {
			square.classList.toggle("flipped");
		});
	}
	function getGameFromURL() {
		const urlParams = new URLSearchParams(window.location.search);
		let challenge = urlParams.get('challenge');

		if (challenge) {
			challenge = atob(decodeURIComponent(challenge));
			game = JSON.parse(challenge);
			return game;
		}
		return {};
	}
	if (!game) {
		game = getGameFromURL();
	}
	game.turn = game.turn || 'white';
	if (!game.pieces) {
		game.pieces = [
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
			{ square: 'a7', name: 'pawn', color: 'black' },
			{ square: 'b7', name: 'pawn', color: 'black' },
			{ square: 'c7', name: 'pawn', color: 'black' },
			{ square: 'd7', name: 'pawn', color: 'black' },
			{ square: 'e7', name: 'pawn', color: 'black' },
			{ square: 'f7', name: 'pawn', color: 'black' },
			{ square: 'g7', name: 'pawn', color: 'black' },
			{ square: 'h7', name: 'pawn', color: 'black' },
			{ square: 'a8', name: 'rook', color: 'black' },
			{ square: 'b8', name: 'knight', color: 'black' },
			{ square: 'c8', name: 'bishop', color: 'black' },
			{ square: 'd8', name: 'queen', color: 'black' },
			{ square: 'e8', name: 'king', color: 'black' },
			{ square: 'f8', name: 'bishop', color: 'black' },
			{ square: 'g8', name: 'knight', color: 'black' },
			{ square: 'h8', name: 'rook', color: 'black' }
		];

	}
	// game.randomizePieces=game.randomizePieces||randomizePieces(game.pieces);

	document.getElementById("flipBoard").addEventListener("click", flipBoard);
	// Set up the game container
	const gameContainer = document.getElementById("gameContainer");
	gameContainer.innerHTML = "";

	// Create and append the containers for removed pieces
	const capturedWhitePieces = document.createElement("div");
	capturedWhitePieces.id = "capturedWhitePieces";
	capturedWhitePieces.classList.add("captured-pieces-container");

	const capturedBlackPieces = document.createElement("div");
	capturedBlackPieces.id = "capturedBlackPieces";
	capturedBlackPieces.classList.add("captured-pieces-container");


	capturedBlackPieces.textContent = "black";
	capturedWhitePieces.textContent = "white";

	if (game.creator) {
		const startingColor = game.startingColor === 'random' ? Math.random() < 0.5 ? 'white' : 'black' : game.startingColor;
		game.creator = {
			name: game.creator,
			color: startingColor
		};
		game.acceptor = {
			name: game.acceptor,
			color: startingColor === 'white' ? 'black' : 'white'
		};

		if (game.creator.color == 'black') {
			capturedWhitePieces.textContent = game.acceptor.name;
			capturedBlackPieces.textContent = game.creator.name;

		} else {
			capturedWhitePieces.textContent = game.creator.name;
			capturedBlackPieces.textContent = game.acceptor.name;
		}
	}

	const divTurnIcon = document.createElement("div");
	divTurnIcon.id = "turnIcon";
	divTurnIcon.classList.add("turnIcon");
	divTurnIcon.textContent = "★";


	// Create and append the chessboard
	game.board = createBoard();

	gameContainer.append(capturedBlackPieces);
	gameContainer.append(game.board);
	gameContainer.append(capturedWhitePieces);


	capturedWhitePieces.prepend(divTurnIcon);

	function initializeTimers() {
		function updateTimerDisplay(timer, timerSeconds) {
			let seconds = timerSeconds % 60;
			let minutes = Math.floor(timerSeconds / 60);
			timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}
		const timerWhite = document.createElement("div");
		timerWhite.id = "timerWhite";
		timerWhite.classList.add("timer");
		capturedWhitePieces.prepend(timerWhite);

		const timerBlack = document.createElement("div");
		timerBlack.id = "timerBlack";
		timerBlack.classList.add("timer");
		capturedBlackPieces.prepend(timerBlack);

		let timerInterval;

		let timerWhiteSeconds = 600; // 10 minutes in seconds
		let timerBlackSeconds = 600; // 10 minutes in seconds
		let bonusSeconds = 12;


		function stopTimer() {
			clearInterval(timerInterval);
		}

		let nChessInterval = null;

		function startTimer() {
			function updateTimer() {
				// console.log('timerWhiteSeconds', timerWhiteSeconds, 'timerBlackSeconds', timerBlackSeconds);
				if (game.turn === "white") {
					timerWhiteSeconds--;
					if (timerWhiteSeconds < 0) {
						clearInterval(nChessInterval);
						alert('cleared white timer');
					} else {
						updateTimerDisplay(timerWhite, timerWhiteSeconds);
					}
				} else {
					timerBlackSeconds--;
					if (timerBlackSeconds < 0) {
						clearInterval(nChessInterval);
						alert('cleared black timer');
					} else {
						updateTimerDisplay(timerBlack, timerBlackSeconds);
					}
				}
			}

			if (!nChessInterval) {
				nChessInterval = setInterval(updateTimer, 1000);
			}
		}
		updateTimerDisplay(timerWhite, timerWhiteSeconds);
		updateTimerDisplay(timerBlack, timerBlackSeconds);
		return { startTimer, stopTimer }

	}

	let timer = initializeTimers();

	game.webSocket = getWebSocket();
	let nChessInterval = null;
	// Initialize the pieces on the board

	let userColor = 'white';
	let webSocketColor = 'black';
	initializePieces(game);
	// Reposition the removed pieces containers
	return game;
}

export default { chessGame };