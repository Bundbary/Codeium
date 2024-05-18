function createChessGame() {
	// function mouseDown(e) {
	// 		const rect = game.canvas.getBoundingClientRect();
	// 		const x = Math.floor((e.clientX - rect.left) * game.canvas.width / rect.width);
	// 		const y = Math.floor((e.clientY - rect.top) * game.canvas.height / rect.height);
	// 		const squareID = String.fromCharCode(97 + x/100) + String(8 - (y/100));
	// 		console.log(squareID);
	// }
    function drawChessBoard(game = {}) {
		function mouseDown(e) {
			const rect = game.canvas.getBoundingClientRect();
			const x = Math.floor((e.clientX - rect.left) * game.canvas.width / rect.width);
			const y = Math.floor((e.clientY - rect.top) * game.canvas.height / rect.height);
			const squareID = String.fromCharCode(97 + x/100) + String(Math.ceil(8 - (y/100)));
			console.log(squareID);
		}

        const canvas = document.createElement("canvas");
		canvas.addEventListener('mousedown',mouseDown)
        canvas.style.width = `70vw`;
        canvas.width = 800;
        canvas.height = 800;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        game.white = white;
        game.black = black;
        game.canvas = canvas;
        game.ctx = ctx;
        game.locations = getLocations(game);
        ctx.strokeStyle = black;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                ctx.fillStyle = (i + j) % 2 === 0 ? white : black;
                ctx.fillRect(j * 100, i * 100, 100, 100);
                ctx.fillStyle = "black";
                ctx.font = "15px Arial";
                ctx.fillText(
                    String.fromCharCode(97 + j) + (8 - i),
                    j * 100 + 10,
                    i * 100 + 90
                );
            }
        }
        drawPieces(game);
        return game;
    }
    const getLocations = (game) => {
        return (
            game.locations || [
				{squareID: "a1", color: "white", type: "rook"},
				{squareID: "b1", color: "white", type: "knight"},
				{squareID: "c1", color: "white", type: "bishop"},
				{squareID: "d1", color: "white", type: "queen"},
				{squareID: "e1", color: "white", type: "king"},
				{squareID: "f1", color: "white", type: "bishop"},
				{squareID: "g1", color: "white", type: "knight"},
				{squareID: "h1", color: "white", type: "rook"},
				{squareID: "a2", color: "white", type: "pawn"},
				{squareID: "b2", color: "white", type: "pawn"},
				{squareID: "c2", color: "white", type: "pawn"},
				{squareID: "d2", color: "white", type: "pawn"},
				{squareID: "e2", color: "white", type: "pawn"},
				{squareID: "f2", color: "white", type: "pawn"},
				{squareID: "g2", color: "white", type: "pawn"},
				{squareID: "h2", color: "white", type: "pawn"},
				{squareID: "a8", color: "black", type: "rook"},
				{squareID: "b8", color: "black", type: "knight"},
				{squareID: "c8", color: "black", type: "bishop"},
				{squareID: "d8", color: "black", type: "queen"},
				{squareID: "e8", color: "black", type: "king"},
				{squareID: "f8", color: "black", type: "bishop"},
				{squareID: "g8", color: "black", type: "knight"},
				{squareID: "h8", color: "black", type: "rook"},
				{squareID: "a7", color: "black", type: "pawn"},
				{squareID: "b7", color: "black", type: "pawn"},
				{squareID: "c7", color: "black", type: "pawn"},
				{squareID: "d7", color: "black", type: "pawn"},
				{squareID: "e7", color: "black", type: "pawn"},
				{squareID: "f7", color: "black", type: "pawn"},
				{squareID: "g7", color: "black", type: "pawn"},
				{squareID: "h7", color: "black", type: "pawn"},
            ]
        );
    };

    function drawPieces(game) {
		console.log(game.locations);
        for (let piece of game.locations) {
            const squareID = piece.squareID;
            const color = piece.color;
            const ctx = game.ctx;
            const canvas = game.canvas;
            const squareSize = canvas.width / 8;
            const x = (squareSize * (squareID.charCodeAt(0) - 97)-squareSize/4);
            const y = (squareSize * (7 - (Number(squareID.charCodeAt(1)) - 49))+squareSize/4);
            ctx.font = "60px Arial";
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            if (piece.type === "pawn") {
                ctx.strokeText(String.fromCharCode(9817), x + squareSize / 2 - 5, y + squareSize / 2 - 10);
            } else if (piece.type === "knight") {
                ctx.strokeText(String.fromCharCode(9816), x + squareSize / 2 - 7, y + squareSize / 2 - 7);
            } else if (piece.type === "bishop") {
                ctx.strokeText(String.fromCharCode(9815), x + squareSize / 2 - 7, y + squareSize / 2 - 7);
            } else if (piece.type === "rook") {
                ctx.strokeText(String.fromCharCode(9814), x + squareSize / 2 - 7, y + squareSize / 2 - 7);
            } else if (piece.type === "queen") {
                ctx.strokeText(String.fromCharCode(9813), x + squareSize / 2 - 7, y + squareSize / 2 - 7);
            } else if (piece.type === "king") {
                ctx.strokeText(String.fromCharCode(9812), x + squareSize / 2 - 7, y + squareSize / 2 - 7);
            }

        }
        return game;
    }

    const black = "rgb(120,120,120)";
    const white = "rgb(220,220,220)";
    const game = drawChessBoard();
    return game;
}

export { createChessGame };
