function chessLobby(game) {
	//START THE SERVER HERE. c:\Users\bpenn\ExpectancyLearning\CodeiumTest\node_server\server.js
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
			console.error('WebSocket error:', error);
		};

		function sendMove(move) {
			socket.send(JSON.stringify(move));
		}

		function handleIncomingMove(move) {
			// Update the chess board with the incoming move
			// This function should update the UI based on the move received
			console.log('Move received:', move);
			// Example: updateBoard(move);
		}
		return socket;
	}


	const socket = getWebSocket();

	return {
		socket

	};


}

export default { chessLobby };