// Set up variables

let flippedCards = [];
let movesArray = [];
let timerArray = [];
let time = 0;
let startingMoves = 20;
let cardsList = [];
let stopWatch;
let matchingCardsList = [];
let movesRemaining;

let cards = [
    'fa-diamond', 'fa-diamond',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-anchor', 'fa-anchor',
    'fa-bolt', 'fa-bolt',
    'fa-cube', 'fa-cube',
    'fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-bomb', 'fa-bomb',
];

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Fill deck of with cards

function fillDeckHTML(cards) {
    const ul = document.getElementById('deck');
    cards.forEach(card => {
        ul.append(createDeckHTML(card));
    });
}

// Create HTML for each card

function createDeckHTML(card) {
    const li = document.createElement('li');
    li.className = 'card';
    li.addEventListener('click', function () {
        li.classList.add('open', 'show');
        flippedCards.push(li);
        timerArray.push(li);
        checkListLength(flippedCards);
        checkTimerArrayLength(timerArray);
    });
    const i = document.createElement('i');
    i.className = card;
    i.classList.add('fa');
    li.append(i);
    cardsList.push(li);
    return li;
}

// Initialise game on load

function initGame() {
    shuffle(cards);
    document.getElementById('timer').innerHTML = `0s`;
    fillDeckHTML(cards);
    createDeckHTML(cards);
    document.getElementById('restart').addEventListener('click', restart);
}

// Start timer once the first move has taken place

function checkTimerArrayLength(timerArray) {
    if (timerArray.length === 1) {
        stopWatch = setInterval(startTimer, 1500);
    } else {
        return;
    }
}

// Check how many cards have been flipped

function checkListLength(flippedCardsList) {
    if (flippedCardsList.length === 2) {
        checkMatch(flippedCardsList);
        flippedCards = [];
    } else {
        return;
    }
}

// Check if flipped cards match

function checkMatch(flippedCardsList) {

    if (flippedCardsList[0].firstChild.classList.value === flippedCardsList[1].firstChild.classList.value) {
        cardsMatch(flippedCardsList);
        matchingCardsList.push(flippedCardsList[0], flippedCardsList[1]);
        checkListLengthMatchingCards(matchingCardsList);
    } else {
        flippedCardsList[0].classList.add('shake');
        flippedCardsList[1].classList.add('shake');
        hideCards(flippedCardsList);
        movesArray.push(flippedCardsList[0], flippedCardsList[1]);

        if (movesArray.length <= 20) {
            calcMovesRemaining();
            calcStarRating();
        }
        if (movesArray.length === 20) {
            gameOver();
        }
    }
}

// Calculate number of moves remaining

function calcMovesRemaining() {
    movesRemaining = ((startingMoves - movesArray.length) / 2);
    let moves = document.getElementById('moves');
    moves.innerHTML = `${movesRemaining}`;
}

// Calculate star rating

function calcStarRating() {
    if (movesRemaining % 2 === 0) {
        let list = document.getElementById('stars');
        list.removeChild(list.firstElementChild);
    } else {
        return;
    }
}

// If the game is over stop timer and display modal

function gameOver() {
    stopTimer();
    const gameOverRestart = document.getElementById('game-over-restart');
    gameOverRestart.addEventListener('click', function () {
        restart();
    });
    const titleText = document.getElementById('title');
    titleText.innerHTML = 'Game Over... ';
    const gameOverModal = document.getElementById('game-over-modal');
    gameOverModal.style.display = 'flex';
}

// Check the length of the matching cards array. If 16 then the player is a winner. Stop the timer and display modal

function checkListLengthMatchingCards(matchingCardsList) {
    if (matchingCardsList.length === 16) {
        stopTimer();
        const winnerRestart = document.getElementById('winner-restart');
        winnerRestart.addEventListener('click', function () {
            restart();
        });
        const movesUsed = (movesArray.length / 2);
        const starRating = (movesRemaining / 2);
        const stars = Math.round(starRating);
        const stats = document.getElementById('stats');
        stats.innerHTML = `You won in a time of ${time}s with a star rating of ${stars}. 
        You used ${movesUsed} out of 10 moves`;
        const winnerModal = document.getElementById('winner-modal');
        winnerModal.style.display = 'flex';
    } else {
        return;
    }
}

// Hide cards if there is no match

function hideCards(flippedCardsList) {
    setTimeout(function () {
        flippedCardsList[0].classList.remove('open', 'show', 'shake');
        flippedCardsList[1].classList.remove('open', 'show', 'shake');
    }, 2500);
}

// If cards match add a pulse animation

function cardsMatch(flippedCardsList) {
    flippedCardsList[0].classList.add('match', 'pulse');
    flippedCardsList[1].classList.add('match', 'pulse');
}

// Start timer

function startTimer() {
    time++;
    document.getElementById('timer').innerHTML = `${time}s`;
}

// Stop timer

function stopTimer() {
    clearInterval(stopWatch);
}

// Restart game

function restart() {
    window.location.reload();
    time = 0;
}

// Initialise game

initGame();
