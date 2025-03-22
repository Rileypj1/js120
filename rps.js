const readline = require('readline-sync');

/* eslint-disable max-lines-per-function */
function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    weightsPerChoice: {
      rock: 1,
      paper: 1,
      scissors: 1,
      spock: 1,
      lizard: 1
    },
    choose() {
      const choices = ['rock', 'paper', 'scissors','spock','lizard'];
      let selection = Math.floor(Math.random() * choices.length);
      this.move = choices[selection];
      this.pastMoves.push([this.move]);
    },
    calculateWeight(points) {
      const currentTotal = this.pastMoves.length;
      let percentage = (points / currentTotal);
      return percentage;
    },
    updateWeights(array) {
      Object.keys(array).forEach((choice, _) => {
        let winsFromPast = this.pastMoves.filter((arr, _) => {
          return arr[0] === choice && arr[1] === 1;
        }).map((arr) => arr[1]).length;

        let lossesFromPast = this.pastMoves.filter((arr, _) => {
          return arr[0] === choice && arr[1] === 0;
        }).map((arr) => arr[1]).length;

        let winWeight = this.calculateWeight(winsFromPast);
        let lossWeight = this.calculateWeight(lossesFromPast);
        array[choice] += winWeight;
        array[choice] -= lossWeight;
      });
    },
    makeWeightedSelection(array) {
      let finalChoice;
      if (array.length === 1) {
        finalChoice = array[0];
      } else {
        let selection = Math.floor(Math.random() * array.length);
        finalChoice = array[selection];
      }
      this.move = finalChoice;
      this.pastMoves.push([finalChoice]);
    },
    chooseWeighted() {
      this.updateWeights(this.weightsPerChoice);
      let maxWeight = Math.max(...Object.values(this.weightsPerChoice));
      let maxChoices = Object.keys(this.weightsPerChoice)
        .filter((choice, _) => {
          return this.weightsPerChoice[choice] === maxWeight;
        });
      this.makeWeightedSelection(maxChoices);
    },
    displayChoice() {
      console.log(`Computer chose ${this.move}`);
    }
  };
  return Object.assign(playerObject, computerObject);
}
/* eslint-disable max-lines-per-function */
function createHuman() {
  let playerObject = createPlayer();
  let humanObject =  {

    choose() {
      let choice;
      while (true) {
        choice = readline.question('Please choose rock, paper, scissors, spock, or lizard: ');
        if (['rock', 'paper', 'scissors','spock','lizard'].includes(choice)) break;
        console.log('Sorry, invalid choice');
      }
      this.move = choice;
      this.pastMoves.push([choice]);
    },

  };
  return Object.assign(playerObject, humanObject);
}

function createPlayer() {
  return {
    move: null,
    score: 0,
    pastMoves: [],

    displayPastMoves() {
      this.pastMoves.forEach((move, idx) => {
        console.log(`Move ${idx + 1}: ${move[0]}`);
      });
    },
    updatePastMoves(result) {
      this.pastMoves[this.pastMoves.length - 1].push(result);
    },
    resetPastMoves() {
      this.pastMoves = [];
    }
  };
}

function createRules() {
  const rules = {
    scissors: ['paper', 'lizard'],
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    spock: ['scissors', 'rock'],
    lizard: ['paper', 'spock'],

    compare(move1, move2) {
      if (this[move1].includes(move2)) {
        return 1;
      } else if (this[move2].includes(move1)) {
        return 2;
      } else return null;
    }
  };
  return rules;
}

function createScore(game) {
  let rules = createRules();
  let scoreObject =  {
    gameScore: 5,
    resetScore() {
      game.human.score = 0;
      game.computer.score = 0;
    },
    updatePlayers(winner, loser, tie = false) {
      if (tie) {
        winner.updatePastMoves(0);
        loser.updatePastMoves(0);
      } else {
        winner.score += 1;
        winner.updatePastMoves(1);
        loser.updatePastMoves(0);
      }
    },
    updateScore() {
      let result = rules.compare(game.human.move, game.computer.move);
      if (result === 1) {
        console.log('You win this round!');
        this.updatePlayers(game.human, game.computer);
      } else if (result === 2) {
        console.log('Computer wins this round!');
        this.updatePlayers(game.computer, game.human);
      } else {
        console.log('It\'s a tie!');
        this.updatePlayers(game.computer, game.human, true);
      }
    },
    displayGameWinner() {
      if (game.human.score === this.gameScore) {
        console.log('You won!');
      } else if (game.computer.score === this.gameScore) {
        console.log('Computer won!');
      }
    },
    displayCurrentScore() {
      console.log(`You have ${game.human.score} ${game.human.score === 1 ? 'point' : 'points'}.`);
      console.log(`Computer has ${game.computer.score} ${game.computer.score === 1 ? 'point' : 'points'}.`);
    },
  };
  return scoreObject;
}


const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  result: null,
  rounds: 1,
  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors, Spock, Lizard!');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors, Spock, Lizard. Goodbye!');
  },

  willPlayAnotherRound() {
    let question = '';
    question = '\nKeep playing? (y/n)';
    console.log(question);
    let result = readline.question();
    return result.toLowerCase() === 'y';
  },

  willPlayGameAgain() {
    let question = '';
    question = '\nWould you like to play again? (y/n)';
    console.log(question);
    let result = readline.question();
    return result.toLowerCase() === 'y';
  },

  playRound() {
    while (true) {
      this.human.choose();
      if (this.rounds >= 6) {
        this.computer.chooseWeighted();
      } else {
        this.computer.choose();
      }
      this.computer.displayChoice();
      this.score.updateScore();

      this.score.displayCurrentScore();
      console.log('Here are your past moves:');
      this.human.displayPastMoves();
      console.log('\nAnd here are the computer\'s:');
      this.computer.displayPastMoves();
      this.rounds += 1;
      if (this.human.score === 5 || this.computer.score === 5) break;
      if (!this.willPlayAnotherRound()) break;
    }
  },

  play() {
    this.score = createScore(this);
    this.rules = createRules();
    this.displayWelcomeMessage();
    while (true) {
      this.score.resetScore();
      this.playRound();
      if (this.human.score === 5) {
        console.log('You won best to 5!');
      } else if (this.computer.score === 5) {
        console.log('Computer won best to 5!');
      }
      if (!this.willPlayGameAgain()) {
        break;
      }
      this.human.resetPastMoves();
      this.computer.resetPastMoves();
      this.rounds = 1;
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();