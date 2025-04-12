const readline = require("readline-sync");
function Square(marker) {
  this.marker = marker || Square.UNUSED_SQUARE;
}

Square.UNUSED_SQUARE = " ";
Square.HUMAN_MARKER = "X";
Square.COMPUTER_MARKER = "O";

Square.prototype.toString = function() {
  return this.marker;
};

Square.prototype.setMarker = function(marker) {
  this.marker = marker;
};

Square.prototype.isUnused = function() {
  return this.marker === Square.UNUSED_SQUARE;
};

Square.prototype.getMarker = function() {
  return this.marker;
};

function Board() {
  this.squares = {}
  for (let i = 1; i <= 9; i += 1) {
    this.squares[i] = new Square();
  }
}

Board.prototype.display = function() {
  console.log("");
  console.log("     |     |");
  console.log(` ${this.squares[1]}   |  ${this.squares[2]}  | ${this.squares[3]}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(` ${this.squares[4]}   |  ${this.squares[5]}  | ${this.squares[6]}`);
  console.log("     |     |");
  console.log("-----+-----+-----");
  console.log("     |     |");
  console.log(` ${this.squares[7]}   |  ${this.squares[8]}  | ${this.squares[9]}`);
  console.log("     |     |");
  console.log("");
}

Board.prototype.displayWithClear = function() {
  console.clear();
  console.log("");
  this.display();
}

Board.prototype.markSquareAt = function(key, marker) {
  this.squares[key].setMarker(marker);
}

Board.prototype.unusedSquares = function() {
  let keys = Object.keys(this.squares);
  return keys.filter((square) => this.squares[square].isUnused());
}

Board.prototype.isFull = function() {
  let unusedSquares = this.unusedSquares();
  return unusedSquares.length === 0;
}

Board.prototype.countMarkersFor = function(player, keys) {
  let markers = keys.filter(key => {
    return this.squares[key].getMarker() === player.marker;
  });

  return markers.length;
}

function Player(marker) {
  this.marker = marker;
  this.score = 0;
}

function Human() {
  Player.call(this, Square.HUMAN_MARKER);
}
Human.prototype = Object.create(Player.prototype);
Human.prototype.constructor = Human;

function Computer() {
  Player.call(this, Square.COMPUTER_MARKER);
}
Computer.prototype = Object.create(Player.prototype);
Computer.prototype.constructor = Computer;


function TTTGame() {
  this.board = new Board();
  this.human = new Human();
  this.computer = new Computer();

  this.POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];
}

TTTGame.prototype.play = function() {
  console.clear();
  let playAgain;
  this.displayWelcomeMessage();
  let matchWinner = 0;
  while(true) {
    this.board.display();
    while (true) {

      this.humanMoves();
      if (this.gameOver()) break;
      

      this.computerMoves();
      if (this.gameOver()) break;

      this.board.displayWithClear();
    }
    this.updateScore();
    if (this.matchOver()) {
      matchWinner = this.matchWinner();
      break;
    }
    this.displayResults();
    playAgain = this.playAgain();
    if (!playAgain) {
      this.displayGoodbyeMessage();
      break;
    }
    if (!playAgain) break;
    this.resetBoard();
    console.clear();
  

  }
  this.displayMatchWinner(matchWinner);
}

TTTGame.prototype.playAgain = function() {
  let question = readline.question("Would you like to play again? (y/n) ");
  while (!['y','n'].includes(question.toLowerCase())) {
    question = readline.question("Invalid response. please choose y/n. ");
  }
  return question === 'y';
}

TTTGame.prototype.resetBoard = function() {
  this.board = new Board();
}

TTTGame.prototype.displayWelcomeMessage = function() {
  console.log('Welcome to Tic Tac Toe!');
}

TTTGame.prototype.displayGoodbyeMessage = function() {
  console.log('Thanks for playing Tic Tac Toe. Goodbye!');
}

TTTGame.prototype.displayResults = function() {
  if (this.isWinner(this.human)) {
    console.log('You won! Congratulations!');
  } else if (this.isWinner(this.computer)) {
    console.log('M3GAN won and you lost!');
  } else {
    console.log('A tie game. How boring.');
  }
  this.displayScores();
}
// move update score out of display results and run it before checking if match is over
TTTGame.prototype.updateScore = function() {
  if (this.isWinner(this.human)) {
    this.human.score += 1;
  } else if (this.isWinner(this.computer)) {
    this.computer.score += 1;
  }
}

TTTGame.prototype.displayScores = function() {
  console.log(`You currently have: ${this.human.score} points.`)
  console.log(`Computer currently has: ${this.computer.score} points.`)
}

TTTGame.prototype.humanMoves = function() {
  let choice;

  while (true) {
    let validChoices = this.board.unusedSquares();
    choice = readline.question(`Choose a square (${TTTGame.joinOr(validChoices)}): `);

    if (validChoices.includes(choice)) break;

    console.log("Sorry that's not a valid choice.");
    console.log("");
  }
  console.log(this.human.marker);
  this.board.markSquareAt(choice, this.human.marker);
}

TTTGame.joinOr = function(arr, delimiter = ',', finalWord = 'or') {
    let str = '';
    arr.forEach((num, idx) => {
      if (idx === arr.length - 2) {
        str += num + ' ' + finalWord + ' ';
      } else if (idx === arr.length - 1) {
        str += num;
      }
      else {
        str += num + delimiter + ' ';
      }
    })
    return str;
  }


TTTGame.prototype.computerMoves = function() {
  let choice;
  let currentPlayer = this.computer
  let counter = 1;
  while (!choice && counter <= 2) {
    let winningRowIdx = this.findRowAboutToWin(currentPlayer);
    if (winningRowIdx >= 0) {
      let emptySpaceFromWinningRow = this.findWinningSquare(this.POSSIBLE_WINNING_ROWS[winningRowIdx])
      if (emptySpaceFromWinningRow) {
        choice = emptySpaceFromWinningRow;
      }
    }
    currentPlayer = this.human
    counter += 1;
  }

  if (!choice) {
    choice = this.pickCenter() || this.randomChoice(choice);
  }

  this.board.markSquareAt(choice, this.computer.marker);
}

TTTGame.prototype.gameOver = function() {
  return this.board.isFull() || this.someoneWon();
}

TTTGame.prototype.matchOver = function() {
  return this.human.score === 3 || this.computer.score === 3;
}

TTTGame.prototype.pickCenter = function() {
  const center = "5"
  if (this.board.squares[center].isUnused()) {
    return center
  } else return null
}

TTTGame.prototype.randomChoice = function(choice) {
  let validChoices = this.board.unusedSquares();
  do {
    choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));
  return choice;
}

TTTGame.prototype.isWinner = function(player) {
  return this.POSSIBLE_WINNING_ROWS.some(row => {
    return this.board.countMarkersFor(player, row) === 3
  });
}

TTTGame.prototype.matchWinner = function() {
  const winningScore = 3;
  switch (winningScore) {
    case this.human.score:
      return 1;
    case this.computer.score:
      return 2;
    default:
      return 0;
  }
}

TTTGame.prototype.displayMatchWinner = function(winner) {
  let final = winner === 1 ? 'You' : 'Computer'
  console.log(`${final} won 3 games! Thanks for playing best of 3.`);
}

TTTGame.prototype.findRowAboutToWin = function(player) {
  return this.POSSIBLE_WINNING_ROWS.findIndex(row => {
      return (this.board.countMarkersFor(player, row) === 2) && 
            (this.findWinningSquare(row) !== undefined)
  });
}

TTTGame.prototype.findWinningSquare = function(row) {
  let emptySpace = row.find((space) => this.board.squares[space].isUnused());
  return emptySpace;
}

TTTGame.prototype.someoneWon = function() {
  return this.isWinner(this.human) || this.isWinner(this.computer);
}

let game = new TTTGame(new Board(), new Human(), new Computer());
game.play();



