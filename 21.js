class Card {
  constructor() {

  }
}

class Deck {
  constructor() {

  }

  deal() {

  }
}

class Participant {
  constructor() {

  }
}

class Player extends Participant {
  constructor() {

  }

  hit() {}

  stay() {

  }

  isBusted() {}

  score() {

  }
}

class Dealer extends Participant {
  constructor() {

  }

  hit() {}

  stay() {}

  isBusted() {

  }

  score() {}

  hide() {}

  reveal() {}

  deal() {}
}

class TwentyOne {
  constructor() {

  }

  start() {
    this.displayWelcomeMessage();
    this.dealCards();
    this.showCards();
    this.playerTurn();
    this.dealerTurn();
    this.displayResult();
    this.displayGoodbyeMessage();
  }

  dealCards() {

  }
  showCards() {

  }

  playerTurn() {

  }
  dealerTurn() {

  }

  displayResult() {

  }

  displayWelcomeMessage() {

  }

  displayGoodbyeMessage() {

  }
}

let game = new TwentyOne();
// game.start();