"use strict"

class Card{
    constructor(suit,value){
        this.suit = suit;
        this.value = value;
    }

}
let player = {
    area: document.getElementById('playerArea'),
    scoreDisplay: document.getElementById('playerScore'),
    score: 0,
    cards: [],
    hasAce: false,
    reduced: false
};

let dealer = {
    area: document.getElementById('dealerArea'),
    scoreDisplay: document.getElementById('dealerScore'),
    score: 0,
    cards: [],
    hasAce: false,
    reduced: false
};

let deck;
let suits = ["clubs","hearts","spades","diamonds"];
let gameRunning=false;

let result = document.getElementById('result');
let newGame = document.getElementById('newGame');
let hitMe = document.getElementById('hitMe');
let stay = document.getElementById('stay');
let playerName = document.getElementById('playerName');
let input=playerName.querySelector('input');

function createDeck(){

    let deck=[];
    for(let suit of suits) deck.push(new Card(suit,'ace'));
    for(let i=2;i<11;i++){
        for(let suit of suits) deck.push(new Card(suit,i.toString()));
    }
    let vals = ['jack','queen','king'];
    for(let val of vals) for(let suit of suits) deck.push(new Card(suit,val));
    shuffleDeck(deck);
    return deck;
}

function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
      let swapInd = Math.trunc(Math.random() * deck.length);
      let tmp = deck[swapInd];
      deck[swapInd] = deck[i];
      deck[i] = tmp;
    }
  }

function startGame(){
    if(gameRunning){
        let check=confirm('Are you sure you want to start a new game?');
        if(!check) return;
    }
    hitMe.disabled=false;
    stay.disabled=false;
    gameRunning = true;
    deck = createDeck();
    updateTable();

    if(player.score==21){
        parseCard(dealer.cards[1], dealer);
        updateArea(dealer, dealer.cards[1]);
        updateScore();
        if(dealer.score==21) endGame('T');
        else endGame('W');
    }
}

function updateScore(){
    player.scoreDisplay.innerText = player.score;
    dealer.scoreDisplay.innerText = dealer.score;
}

function updateArea(who, card){
    let cur = who.area.innerText;
    who.area.innerText = `${cur} ${displayCard(card)}`;
}

function hitMeFunc(){
    dealCard(player);
    
    if(player.score>21 && player.hasAce && !player.reduced){
        player.score-=10;
        player.reduced = true;
    }
    updateArea(player,player.cards[player.cards.length-1]);
    updateScore();
    if(player.score==21) dealerTurn();
    else if(player.score>21) endGame('L');
}

function dealerTurn(){
    hitMe.disabled=true;
    stay.disabled=true;
    updateArea(dealer,dealer.cards[1]);
    parseCard(dealer.cards[1],dealer);
    updateScore();
    while(dealer.score < 17){
        dealCard(dealer);
        
        if(dealer.score>21 && dealer.hasAce && !dealer.reduced){
            dealer.score-=10;
            dealer.reduced = true;
        }

        updateArea(dealer,dealer.cards[dealer.cards.length-1]);
        updateScore();
    }

    if(dealer.score==21 && player.score==21) endGame('T');
    else if(dealer.score==21) endGame('L');
    else if(dealer.score>21) endGame('W');
    else {
        if(21-dealer.score < 21-player.score) endGame('L');
        else if(21-dealer.score > 21-player.score) endGame('W');
        else endGame('T');
    }
}



function updateTable(){
    dealer.score=0;
    player.score=0;
    player.hasAce=false;
    dealer.hasAce=false;
    player.reduced = false;
    dealer.reduced = false;
    player.cards=[];
    dealer.cards=[];
    dealCards();
    result.innerText='';
    dealer.area.innerText = "Dealer cards:\n";
    updateArea(dealer,dealer.cards[0]);
    player.area.innerText = "Your cards:\n";
    updateArea(player,player.cards[0]);
    updateArea(player,player.cards[1]);
    updateScore();
}




function dealCards(){
    
    dealCard(player);
    dealCard(dealer);
    dealCard(player);
    dealer.cards.push(deck.pop());
}

function parseCard(el, who){
    switch(el.value){
        case 'jack':
        case 'queen':
        case 'king':
        who.score+=10;
        break;
        case 'ace':
        if(who.score+11>21) who.score+=1;
        else who.score+=11;
        who.hasAce = true;
        break;
        default:
        who.score+=parseInt(el.value);
        break;
    }
    
}

function displayCard(card){return `${card.value} of ${card.suit}`}

function dealCard(who){
    let newCard = deck.pop();
    who.cards.push(newCard);
    parseCard(newCard,who);
}

function endGame(param){
    if(param=='W'){
        result.innerText='YOU WIN!';
    }
    else if(param=='L'){
        result.innerText='DEALER WINS!';
    }
    else {
        result.innerText='TIE GAME!';
    }

    gameRunning=false;
    hitMe.disabled=true;
    stay.disabled=true;
}

function changeName(){
    this.className = 'edit';
    input.setSelectionRange(0,input.value.length);
}

function saveChanges(){
    if(input.value.trim().length==0) input.value = "Player";
    this.previousElementSibling.innerHTML = this.value;
    this.parentNode.className = '';

}

function keyPress(event){
    if(event.which==13) {
        if(input.value.trim().length==0) input.value = "Player";
        saveChanges.call(this);

    }
}


newGame.addEventListener('click',startGame);
hitMe.addEventListener('click',hitMeFunc);
stay.addEventListener('click',dealerTurn);
playerName.addEventListener('click',changeName);
input.addEventListener('blur',saveChanges);
input.addEventListener('keypress', keyPress);