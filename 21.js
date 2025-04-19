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
    return this.getPointTotal() > MAX_POINTS
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
   return allCardsToPoints.reduce((acc, point) => point + acc);
  }
  assignAcesPoints(arr) {
    let acesTotal = arr.filter((card) => typeof card === 'string').length;
    for (let i = 0; i < acesTotal; i += 1) {
      let currentTotal = arr.filter((card) => typeof card === 'number').reduce((acc, point) => point + acc);
      let aceIdx = arr.findIndex((card) => typeof card === 'string');
      if (currentTotal + ACE_HIGH <= MAX_POINTS) {
        arr[aceIdx] = ACE_HIGH;
      } else {
        arr[aceIdx] = ACE_LOW;
      }
    }
    return arr;
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

}

class Dealer extends Participant {
  constructor() {
    super();
    this.maxHitPoints = 17;
  }

  hitOrStay() {
    let currentPoints = this.getPointTotal();
    if (currentPoints < this.maxHitPoints) {
      return 'h'
    } else {
      return 's'
    }
  }

  score() {}

  hide() {}

  displayCards() {
    console.log(`Dealer's cards are:\n==> ${this.cards[0]} (and hidden card(s)).`);
  }

  displayAllCards() {
    console.log(`Dealer's cards are:\n==> ${this.joinAnd(this.cards)}.`);
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
    let playerTurn = this.playerTurn();
    playerTurn === 'busted' ? null : this.dealerTurn();
    this.updateFinalPoints();
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
    while(!this.player.isBusted()) {
      let hitOrStay = this.player.hitOrStay();
      if (['s','stay'].includes(hitOrStay)) {
        break;
      }
      let nextCard = this.deck.deck.shift();
      this.player.cards.push(nextCard);
      this.player.points = this.player.getPointTotal();
      this.showCards();
    }
    if (this.player.isBusted()) {
      console.log(`\nBusted! You have ${this.player.points} and went over ${MAX_POINTS}.`);
      return 'busted';
    } else {
      console.log(`You chose to stay. Dealer's turn!`);
      return 'stayed';
    }
    
  }
  updateFinalPoints() {
    this.player.points = this.player.getPointTotal();
    this.dealer.points = this.dealer.getPointTotal();
  }
  dealerTurn() {
    while(!this.dealer.isBusted()) {
      this.dealer.displayAllCards();
      let hitOrStay = this.dealer.hitOrStay();
      if (['s','stay'].includes(hitOrStay)) {
        break;
      }
      console.log('Dealer chose hit!')
      let nextCard = this.deck.deck.shift();
      this.dealer.cards.push(nextCard);
      this.dealer.points = this.dealer.getPointTotal();
    }
    if (this.dealer.isBusted()) {
      console.log(`Busted! Dealer has ${this.dealer.points} and went over ${MAX_POINTS}.`);
      return 'busted';
    } else {
      console.log(`Dealer chose to stay.`);
      return 'stayed';
    }
  }

  displayResult() {
    this.player.displayCards();
    this.dealer.displayAllCards();
    function displayWinner(player) {
      console.log('*'.repeat(5)  + ` ${player} won! ` + '*'.repeat(5));
    }
    console.log("");
    console.log(this.player.points);
    console.log(this.dealer.points);
    if (this.dealer.isBusted()) {
      displayWinner('You');
    } else if (this.player.isBusted()) {
      displayWinner('Dealer');
    } else if (this.player.points > this.dealer.points) {
      displayWinner('You');
    } else if (this.dealer.points > this.player.points) {
      displayWinner('Dealer');
    } else {

      console.log('It\'s a tie!');
    }
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
