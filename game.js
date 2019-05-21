var board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const container = document.querySelector(".container");
const cells = document.querySelectorAll(".cell");
const playComp = document.querySelector("#playComp");
const humanPlayer = "O";
const AiPlayer = "X";
const WinningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7],  [2, 5, 8],  [0, 4, 8],  [2, 4, 6] ];
const endgame =  document.querySelector(".endgame");
const color = {
  win: "blue",
  lose: "red",
  equability: "green"
}
var gameWon;
start();

playComp.addEventListener("click", start);


function start() {
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  endgame.style.display = "none";
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = "";
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }

}


function turnClick(event) {
  if(typeof(board[event.target.id]) === "number") {
    // if empty spot player turn then computer turn
    turn(event.target.id, humanPlayer);   
    if(!equability()) turn(bestSpot(), AiPlayer);
  }
}

function turn(id, player) {

  board[id] = player;
  document.getElementById(id).innerText = player;

  let gameWon = checkWinner(board, player);
  if(gameWon) gameOver(gameWon);

}

function checkWinner(board, player) {
  // 1-Find where the player has played
  let plays = board.reduce((previous, currentValue, currentIndex) => {
    if (currentValue === player) {
      // The concat() method is used to merge two or more arrays.
      return previous.concat(currentIndex);
    } else {
      return previous;
    }
  }, []);

  let gameWon = null;


  // 2- Checking if the player has played one of the Winning combos.

  // FOR variable OF array (JAVASCRIPT) ≡	FOR variable IN array (PYTHON)
  // ARRAY.entries() returns two values: the index and the element
  for(let [index, winCombo] of WinningCombos.entries()) {

    if(winCombo.every(element => plays.indexOf(element) > -1)){
      gameWon = {
        theWinningCombo: index,
        Winner: player 
      };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  // highlight the winning combo
  for(let index of WinningCombos[gameWon.theWinningCombo]){
    document.getElementById(index).style.backgroundColor =
      gameWon.Winner == humanPlayer ? color.win : color.lose;
  }

  // Disable clicking
  for(let i = 0; i < cells.length; i++ ){
    cells[i].removeEventListener('click', turnClick, false); 
  }

  // declaring the winner
  if(gameWon.Winner == humanPlayer){
    declareWinner("Ты выиграл");
  }
  else if(gameWon.Winner == AiPlayer){
    declareWinner("Ты проиграл");
  }
  
}

function emptyCells() {
  return board.filter(cell => typeof(cell) === 'number');
}

function bestSpot() {
  return minimax(board, AiPlayer).index;
}

function equability(){
  // if All  the cells had been played
  if(emptyCells().length === 0 && gameWon == null){
    for(let i = 0; i < board.length; i++){
      cells[i].style.backgroundColor = color.equability;
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner('Ничья');
    return true;
  }
  return false;
}

 function declareWinner(who){
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerHTML = who;

} 

// MINMAX ALGORITHM
function minimax(newBoard, player) {

  // 1-go through available spots on the board
  var availSpots = emptyCells();
  
  // 2-return a value if a terminal state is found (+10, 0, -10)
	if (checkWinner(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWinner(newBoard, AiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
  var moves = [];
  
  // 3-call the minimax function on each available spot (recursion)
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == AiPlayer) {
			var result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, AiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

    moves.push(move);
    console.log(moves);
	}

  var bestMove;

  // 4-evaluate returning values from function calls
	if(player === AiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
  }
  
  //5-and return the best value 
	return moves[bestMove];
}
