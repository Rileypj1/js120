const readline = require("readline-sync");
class Card {
  constructor() {

  }
}

class Deck {
  constructor() {
    this.deck = this.makeDeck();
  }

  shuffle(deck) {
    for (let index = deck.length - 1; index > 0; index--) {
      let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
      [deck[index], deck[otherIndex]] = [deck[otherIndex], deck[index]]; // swap elements
    }
    return deck;
  }
  makeDeck() {
    let deck = [];
    const suits = ['hearts', 'spades', 'diamonds', 'clubs'];
    const faceCards = ['j', 'q', 'k', 'a']
    suits.forEach(suit => {
      for (let i = 2; i <= 10; i += 1) {
        deck.push(i + ' of ' + suit);
      }
      for (let face of faceCards) {
        deck.push(face + ' of ' + suit);
      }
    })
    return this.shuffle(deck);
  }
}

class Participant {
  constructor() {
    this.cards = []
    this.points = 0;
  }

  isBusted() {
    return this.points > 21
  }

  getPointTotal() {
    /*
    1. need to convert face cards (not ace) to points (each 10);
    2. need to check for aces
      if there is an ace
      get current point total aside from ace(s)
        get sum of aces = multiply 11 * # of aces
          if current point total + sum of aces < 21: set all aces to 11
          if 1 + 11 + current point total < 21: set first ace to 1, next to 11
          we will have to try every combination of # of aces # of aces that have 1 vs 11

    */
  }
}

class Player extends Participant {
  constructor() {
    super();
  }

  hitOrStay() {
    let question = readline.question('Are you going to hit or stay (h or s)? ');
    while (!['h','s','hit','stay'].includes(question.trim())) {
      question = readline.question('Invalid response. Hit or stay (h or s)? ');
    }
    return question;
  }

  score() {

  }

  displayCards() {
    let cards = this.getCards.bind(this);
    console.log('\nHere are your cards:\n==> ' + this.joinAnd(cards()));
  }

  getCards() {
    return this.cards;
  }

  joinAnd(arr, delimiter = ',', finalWord = 'and') {
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
}

class Dealer extends Participant {
  constructor() {
    super();
  }

  hit() {}

  stay() {}

  score() {}

  hide() {}

  reveal() {}

}

class TwentyOne {
  constructor() {
    this.deck = new Deck();
    this.player = new Player();
    this.dealer = new Dealer();
  }

  start() {
    console.clear();
    this.displayWelcomeMessage();
    this.dealCards();
    this.showCards();
    this.playerTurn();
    this.dealerTurn();
    this.displayResult();
    this.displayGoodbyeMessage();
  }

  dealCards() {
    for (let deal = 0; deal < 4; deal += 1) {
      let currentCard = this.deck.deck.shift();
      if (deal % 2 === 0) {
        this.player.cards.push(currentCard);
      } else {
        this.dealer.cards.push(currentCard);
      }
    }
  }
  showCards() {
    this.player.displayCards();
    console.log("");
    console.log(`Dealer's cards are:\n==> ${this.dealer.cards[0]} (and hidden card).`);
  }

  playerTurn() {
    while(!this.player.isBusted() && ['h','hit'].includes(this.player.hitOrStay())) {
      let nextCard = this.deck.deck.shift();
      this.player.cards.push(nextCard);
      this.player.displayCards()
    }
  }
  dealerTurn() {
    while(!this.dealer.isBusted()) {

    }
  }

  displayResult() {

  }

  displayWelcomeMessage() {
    console.log("Welcome to Twenty One! Let's shuffle and the deal the cards.");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing!");
  }
}

let game = new TwentyOne();
game.start();

