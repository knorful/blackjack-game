window.addEventListener('DOMContentLoaded', function () {
  // Execute after page load

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
  replayBtn.style.display = "none";
  let message = document.getElementById("messages");

  // variables
  let deck;
  let dealerPoints;
  let playerPoints;
  let dealerNot17orMore = false;
  let playerStand = false;
  let dealerHand = [];
  let playerHand = [];

  const buildDeck = () => {
    let deck = [];
    let suits = ['diamonds', 'clubs', 'hearts', 'spades'];

    for (let i = 0; i < suits.length; i++) {
      let suit = suits[i];

      for (let j = 1; j <= 13; j++) {
        deck.push({ rank: j, suit });
      }
    }

    return deck;
  }

  //build deck on start
  deck = buildDeck();

  const dealCard = (player) => {

    let randIndex = Math.floor(Math.random() * deck.length);
    let getRandomCardFromDeck = deck.splice(randIndex, 1);
    let card = getCardImage(getRandomCardFromDeck[0]);

    switch (player) {
      case 'player':
        playerHand.push(getRandomCardFromDeck[0]);
        playerHandElement.appendChild(card);
        calculatePoints('player', playerHand);
        break;
      case 'dealer':
        dealerHand.push(getRandomCardFromDeck[0]);
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
        playerPoints = pointTally(playerHand);
        checkForBusts(playerPoints);
        playerPointDisplay.innerHTML = playerPoints;
        break;
      case 'dealer':
        dealerPoints = pointTally(dealerHand);
        dealerNot17orMore = dealerPoints >= 17;
        checkForBusts(dealerPoints);
        dealerPointDisplay.innerHTML = dealerPoints;
        break;

    }
  }

  const pointTally = (playerHand) => {

    let totalPoints;

    totalPoints = playerHand
      .map(card => card.rank)
      .reduce((prev, curr) => {
        if (prev > 10) prev = 10;
        if (curr > 10) curr = 10;
        return prev + curr;
      });

    return totalPoints;
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
    if (!playerStand) {
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
    playerHand = [];
    dealerHand = [];
    playerStand = false;
    dealerNot17orMore = true;
    totalPoints = 0;
    playerPoints = 0
    dealerPoints = 0;
    dealBtn.style.display = "inline";
    hitBtn.style.display = "inline";
    standBtn.style.display = "inline";

    deck = buildDeck();
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
