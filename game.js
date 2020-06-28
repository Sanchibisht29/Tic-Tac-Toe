var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();
function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}


function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

// function bestSpot() {
// 	console.log( typeof(minimax(origBoard, aiPlayer).index));
// 	return minimax(origBoard, aiPlayer).index;
// }
function bestSpot() {
	let bestScore=-Infinity;
	var move;
	let i;
	for( i=0;i<9;i++){
		let s;
		if(typeof(origBoard[i])=='number'){
        origBoard[i]=aiPlayer;
		 s=minimax(origBoard,false);
		origBoard[i]=i;
		if(s>bestScore){
			 move=i;
			 bestScore=s;
		}
		}
	}
	return move;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

// function minimax(newBoard, player) {
// 	var availSpots = emptySquares();

// 	if (checkWin(newBoard, huPlayer)) {
// 		return {score: -10};
// 	} else if (checkWin(newBoard, aiPlayer)) {
// 		return {score: 10};
// 	} else if (availSpots.length === 0) {
// 		return {score: 0};
// 	}
// 	var moves = [];
// 	for (var i = 0; i < availSpots.length; i++) {
// 		var move = {};
// 		move.index = newBoard[availSpots[i]];
// 		newBoard[availSpots[i]] = player;

// 		if (player == aiPlayer) {
// 			var result = minimax(newBoard, huPlayer);
// 			move.score = result.score;
// 		} else {
// 			var result = minimax(newBoard, aiPlayer);
// 			move.score = result.score;
// 		}

// 		newBoard[availSpots[i]] = move.index;

// 		moves.push(move);
// 	}

// 	var bestMove;
// 	if(player === aiPlayer) {
// 		var bestScore = -10000;
// 		for(var i = 0; i < moves.length; i++) {
// 			if (moves[i].score > bestScore) {
// 				bestScore = moves[i].score;
// 				bestMove = i;
// 			}
// 		}
// 	} else {
// 		var bestScore = 10000;
// 		for(var i = 0; i < moves.length; i++) {
// 			if (moves[i].score < bestScore) {
// 				bestScore = moves[i].score;
// 				bestMove = i;
// 			}
// 		}
// 	}

// 	return moves[bestMove];
// }

function minimax(newBoard, max) {
	// console.log(winner(newBoard, huPlayer));
	if (checkWin(newBoard,huPlayer)) {
		return -10;
	} else if (checkWin(newBoard, aiPlayer)) {
		return 10;
	} else {
		let i,ans=true;
		for( i=0;i<9;i++){
			if(newBoard[i]==i){
			ans=false;
			}
		}
		if(ans){
		return 0;
		}
	}
	if(max){
		let bestScore=-Infinity;
	for(var i=0;i<9;i++){
	if(typeof(newBoard[i])=='number'){
		newBoard[i]=aiPlayer;
		let s=minimax(newBoard,false);
		bestScore=Math.max(bestScore,s);
		newBoard[i]=i;
	}
	}
	return bestScore;
}
else{
	let bestScore=Infinity;
	for(var i=0;i<9;i++){
	if(typeof(newBoard[i])=='number'){
		newBoard[i]=huPlayer;
		let s=minimax(newBoard,true);
		bestScore=Math.min(bestScore,s);
		newBoard[i]=i;
	}
	}
	return bestScore;
}
}