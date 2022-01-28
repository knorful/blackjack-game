window.addEventListener('DOMContentLoaded', function () {
  // Execute after page load

  class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
  }
  
  Card.prototype.getImageUrl = () => {
    return `images/${this.rank}_of_${this.suit}.png`;
  }
  
  class Hand {
  
    constructor() {
        this.handOfCards = []
    }
  
    addCard(card) { this.handOfCards.push(card);}
    getPoints() {
        let total = this.handOfCards
            .map(card =>{ 
              return card.rank
            })
            .reduce((prev, curr) => {
                console.log("before", prev, curr)
                if (curr > 10) curr = 10;
                console.log("after", prev, curr)
                return prev + curr;
            })
  
        return total;
    }
  
  
  }
  
  class Deck {
  
    constructor() {
        this.deck = [];
    }
  
    buildDeck() {
        let suits = ['diamonds', 'clubs', 'hearts', 'spades'];
  
        for (let i = 0; i < suits.length; i++) {
          let suit = suits[i];
  
          for (let j = 1; j <= 13; j++) {
            this.deck.push(new Card(j, suit));
          }
        }
  
    }
  
    draw() {
        if (this.deck.length === 0 ) this.buildDeck();
        let card = this.getRandomCard()[0];
        return card;
    
    }
  
    getRandomCard() {
        let randIdx = Math.floor(Math.random() * this.deck.length);
        let randCard = this.deck.splice(randIdx, 1);
        return randCard;
    }
  
    numCardsLeft() {
        return this.deck.length;
    }
  
  }

  // Buttons
  let dealBtn = document.getElementById("deal-button");
  let hitBtn = document.getElementById("hit-button");
  let standBtn = document.getElementById("stand-button");
  let replayBtn = document.getElementById("replay-button");

  // DOM elements
  let dealerHandElement = document.getElementById("dealer-hand");
  let playerHandElement = document.getElementById("player-hand");
  let dealerPointDisplay = document.getElementById("dealer-points");
  let playerPointDisplay = document.getElementById("player-points");
  let message = document.getElementById("messages");
  
  // variables
  let deck;
  let dealerPoints;
  let playerPoints;
  let dealerNot17orMore = false;
  let playerStand = false;
  let dealerHand = new Hand();
  let playerHand = new Hand();
  
  // hide replay button
  replayBtn.style.display = "none";

  //build deck on start
  deck = new Deck();
  deck.buildDeck();

  const dealCard = (player) => {

    // let randIndex = Math.floor(Math.random() * deck.length);
    let getRandomCardFromDeck = deck.draw();
    let card = getCardImage(getRandomCardFromDeck);

    switch (player) {
      case 'player':
        playerHand.addCard(getRandomCardFromDeck);
        playerHandElement.appendChild(card);
        calculatePoints('player', playerHand);
        break;
      case 'dealer':
        dealerHand.addCard(getRandomCardFromDeck);
        dealerHandElement.appendChild(card);
        calculatePoints('dealer', dealerHand);
        break;
      default:
        return 'invalid';
    }
  }

  const checkForBusts = (points) => {
    if (points > 21) {
      message.innerHTML = "You have busted!"
    }
  }

  const getCardImage = (cardObj) => {

    let card = document.createElement("img");
    let rank = cardObj.rank;

    switch (rank) {
      case 1:
        rank = 'ace';
        break;
      case 11:
        rank = 'jack';
        break;
      case 12:
        rank = 'queen';
        break;
      case 13:
        rank = 'king';
        break;
    }

    card.setAttribute("src", `../images/${rank}_of_${cardObj.suit}.png`);
    return card;
  }

  const calculatePoints = (player, playerHand) => {

    switch (player) {
      case 'player':
        playerPoints = playerHand.getPoints();
        checkForBusts(playerPoints);
        playerPointDisplay.innerHTML = playerPoints;
        break;
      case 'dealer':
        dealerPoints = dealerHand.getPoints();
        dealerNot17orMore = dealerPoints >= 17;
        checkForBusts(dealerPoints);
        dealerPointDisplay.innerHTML = dealerPoints;
        break;

    }
  }

  const determineWinner = () => {
    if (playerPoints > dealerPoints) {
      message.innerHTML = "Player Wins!"
    } else if (playerPoints < dealerPoints) {
      message.innerHTML = "Dealer Wins!"
    } else {
      message.innerHTML = "Tie?"
    }

    gameOver = true;
  }

  dealBtn.addEventListener("click", () => {
    if (!playerStand) {
      dealCard('player');
      dealCard('dealer');
      dealCard('player');
      dealCard('dealer');
    }
  });

  hitBtn.addEventListener("click", () => {
    if (!playerStand ) {
      dealCard('player');
    }
  });

  standBtn.addEventListener("click", () => {
    playerStand = true;

    dealBtn.style.display = "none";
    hitBtn.style.display = "none";
    standBtn.style.display = "none";
    replayBtn.style.display = "inline";
    replayBtn.style.margin = "0 auto";

    while (!dealerNot17orMore) {
      dealCard("dealer");
    }

    determineWinner();
  })

  replayBtn.addEventListener("click", () => {
    playerHand = new Hand();
    dealerHand = new Hand();
    playerStand = false;
    dealerNot17orMore = true;
    totalPoints = 0;
    playerPoints = 0
    dealerPoints = 0;
    dealBtn.style.display = "inline";
    hitBtn.style.display = "inline";
    standBtn.style.display = "inline";

    let newBuild = new Deck();
    removeAllChildNodes(dealerHandElement);
    removeAllChildNodes(playerHandElement);
    dealerPointDisplay.innerHTML = "";
    playerPointDisplay.innerHTML = "";
    message.innerHTML = "";
  });

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

})
