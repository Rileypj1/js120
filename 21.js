const readline = require("readline-sync");
const MAX_POINTS = 21;
const ACE_HIGH = 11;
const ACE_LOW = 1;
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
    return this.getPointTotal > MAX_POINTS
  }

  getPointTotal() {
   const faces = ['j','q','k']
   let allCardsToPoints = this.cards.map(card => {
    if (parseInt(card)) {
      return parseInt(card);
    } else if (faces.includes(card[0])) {
      return 10;
    } else return card;
   })
   allCardsToPoints = this.assignAcesPoints(allCardsToPoints);
   console.log(allCardsToPoints);
   return allCardsToPoints.reduce((acc, point) => point + acc);
  }
// need to account for situations with multiple aces that need to be assigned 1
// current approach will sometimes assign at least one ace an 11 since it's comparing the current total and the current ace
// in isolation from other aces in hand
  assignAcesPoints(arr) {
    let acesTotal = arr.filter((card) => typeof card === 'string').length;
    for (let i = 0; i < acesTotal; i += 1) {
      let currentTotal = arr.filter((card) => typeof card === 'number').reduce((acc, point) => point + acc);
      let aceIdx = arr.findIndex((card) => typeof card === 'string');
      if (currentTotal + ACE_HIGH < MAX_POINTS) {
        arr[aceIdx] = ACE_HIGH;
      } else {
        arr[aceIdx] = ACE_LOW;
      }
    }
    return arr;
  }

}

class Player extends Participant {
  constructor() {
    super();
  }

  hitOrStay() {
    let question = readline.question('\nAre you going to hit or stay (h or s)? ');
    while (!['h','s','hit','stay'].includes(question.trim())) {
      question = readline.question('Invalid response. Hit or stay (h or s)? ');
    }
    return question;
  }

  score() {

  }
  displayCards() {
    console.log('\nHere are your cards:\n==> ' + this.joinAnd(this.cards));
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

  displayCards() {
    console.log(`Dealer's cards are:\n==> ${this.cards[0]} (and hidden card(s)).`);
  }

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
    this.dealer.displayCards();
  }

  playerTurn() {
    // this while loop isn't breaking when it should -- take out 2nd condition and move within body
    while(!this.player.isBusted() && ['h','hit'].includes(this.player.hitOrStay())) {
      let nextCard = this.deck.deck.shift();
      this.player.cards.push(nextCard);
      this.showCards();
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
