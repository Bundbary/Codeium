// WebSocket setup

let wslocation = 'ws://localhost:3000';
if(!document.URL.includes('localhost')){
	wslocation = 'wss://chameleon.sdiclarity.com:3000';	
	
}


const socket = new WebSocket(wslocation);
console.log("foo");








socket.onopen = function (event) {
	console.log('Connected to WebSocket server');


	socket.send(JSON.stringify({ getGames: true }));
};
// Handle incoming messages
socket.onmessage = (event) => {

	const message = JSON.parse(event.data);
	console.log(message);
	if (message.challenge) {
		updateChallengeList(message);


	}
	games = message.games;
};

socket.onerror = function (error) {
	document.body.innerHTML = '<h1>Server not available: 🍋🍋🍋</h1>';
	console.error('WebSocket error:', error);
};
// DOM elements
const userSection = document.getElementById('userSection');
const challengeSection = document.getElementById('challengeSection');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('loginButton');

const createChallengeButton = document.getElementById('createChallengeButton');
const challengeList = document.getElementById('challengeList');
let games;
let username = '';
let challenges = [];


const savedGames = document.getElementById('savedGames');

function createSavedGamesButtons(games) {
	savedGames.innerHTML = '';
	games.forEach(game => {

		const [player1, player2] = game.replace('.json', '').split('_vs_');
		if (player1 === username || player2 === username) {
			const button = document.createElement('button');
			button.textContent = game;
			button.addEventListener('click', () => {
				// window.open('chess.htm?challenge=' + encodeURIComponent(btoa(JSON.stringify(game))), '_self');
				alert('not done yet')
			});
			savedGames.appendChild(button);
		}
	});
}





// Save the username in localStorage


// Populate the username if it exists in localStorage
usernameInput.value = localStorage.getItem('username') || '';
// Handle login
loginButton.addEventListener('click', () => {
	username = usernameInput.value;
	if (username) {



		try {
			localStorage.setItem('username', username);
			socket.send(JSON.stringify({ username }));
			userSection.style.display = 'none';
			challengeSection.style.display = 'block';

			usernameHeader.textContent = `Logged in as ${username}`;

			createSavedGamesButtons(games);



		} catch (error) {
			console.error('Error saving username:', error);
			alert('No server available.')
		}
	}
});

function randomizePieces(array) {
	array = array || [
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
	function shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;;
	}
	const shuffled = shuffle(['rook', 'knight', 'bishop', 'queen', 'bishop', 'king', 'knight', 'rook']);
	const firstRow = array.filter(piece => piece.square.endsWith('1'));
	const lastRow = array.filter(piece => piece.square.endsWith('8'));
	for (let i = 0; i < shuffled.length; i++) {
		firstRow[i].name = shuffled[i];
		lastRow[i].name = shuffled[i];
	}
	return array;
}
// Handle create challenge
createChallengeButton.addEventListener('click', () => {

	let pieces = null;



	const gameType = document.getElementById('gameType').value;
	if (gameType === "billy-fischer-random") {
		pieces = randomizePieces();
	}

	const challenge = {
		creator: username,
		startingColor: document.getElementById('startingColor').value,
		gameType: document.getElementById('gameType').value,
		pieces: pieces
	};
	socket.send(JSON.stringify({ challenge }));





	createChallengeButton.remove();
});
// Update challenge list
function updateChallengeList(message) {
	challenges.push(message.challenge);
	challengeList.innerHTML = '';
	challenges.forEach(challenge => {
		const li = document.createElement('li');
		li.className = 'challenge-item';
		li.textContent = `${challenge.creator} plays ${challenge.startingColor}: ${challenge.gameType}`;



		if (challenge.type === 'accepted') {
			challenge.username = username;
			window.open('chess.htm?challenge=' + encodeURIComponent(btoa(JSON.stringify(challenge))), '_self');
		} else {

			li.addEventListener('click', () => {
				handleAcceptChallenge(challenge);
			});
			challengeList.appendChild(li);
			if (challenge.creator === username) {

				li.style.backgroundColor = 'pink';
			}
		}
	});
}

// Handle accepting a challenge
function handleAcceptChallenge(challenge) {
	console.log(challenge);
	challenge.username = username;
	if (challenge.creator === username) {
		alert('You cannot accept your own challenge.');
	} else {
		challenge.acceptor = username;
		challenge.type = 'accepted';
		socket.send(JSON.stringify({ challenge }));
		socket.onmessage = (event) => {
			const response = JSON.parse(event.data);
			if (response.challenge.type === "accepted") {
				window.open('chess.htm?challenge=' + encodeURIComponent(btoa(JSON.stringify(challenge))), '_self');
				socket.onmessage = null;
			}
		};

	}
}

// update all inputs with localStorage vals when the page loads
window.addEventListener('load', () => {
	const inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		const key = input.id;
		const value = localStorage.getItem(key);
		if (value) {
			input.value = value;
		}
	});
});
