var firstCardClicked = null;
var secondCardClicked = null;
var currentClickedState = 'first';
var pictureCard = ["adama", "apollo", "chiefgalon", "fargo", "gaius",
  "kara", "laura", "sharon", "six"
];
var pictureCardConcat = pictureCard.concat(pictureCard);
var timer = {};

$(document).ready( initializeGame );

function initializeGame(){
  startGameClickHandler();
  resetGameClickHandler();
  stopGameClickHandler();
  initializeClickHandlers();
  typeWriter();
}

//click handlers:
function clickHandlerFlipCard() {
  $(".border-image-container").click(function (e) {
    e.stopPropagation();
    cardClicked($(this));
  });
}

function initializeClickHandlers() {
  clickHandlerFlipCard();
  resetGameClickHandler();
  stopGameClickHandler();
  yesButton();
  noButton();
  addAboutMeEventHandlers();
}

function addAboutMeEventHandlers(){
  $("#about-me-pic").click(toggleAboutMeParagraph)
  $('#about-me-pic').click(flipAboutMePic);

}

function startGameClickHandler() {
  $('.start-game').click(startGame);
}


function resetGameClickHandler() {
  $('#reset-game').click(resetGame);
}


function stopGameClickHandler() {
  $('#stop-game').click(stopGame);
}



//card effects
function showAllCards() {
  $(".border-image-container").addClass("active");
}

function hideAllCards() {
  $(".border-image-container").removeClass("active");
}

function lockCard(card) {
  $(card).addClass('lockCard');
}

function lockAllCards() {
  $('.border-image-container').addClass('lockCard');
}

function unlockCard(card) {
  $(card).removeClass('lockCard');
}

function unlockAllCards() {
  $('.border-image-container').removeClass('lockCard');
}

//start-stop-restart 
function startGame() {
  removeGenerateCards();
  pictureCardConcat = shuffleCards(pictureCardConcat);
  generateMultipleCards();
  initializeClickHandlers();
  lockAllCards();
  showAllCards();
  setTimeout(function () {
    hideAllCards();
    unlockAllCards();
  }, 2000);
  startTimer();
  resetScore();
  $('#splashscreen').removeClass('active');
  $('.card-game-section').addClass('active');
  $('.header').addClass('active');
  $('#winning-alert').removeClass('active');
  $('#losing-alert').removeClass('active');
}

function stopGame() {
  lockAllCards();
  stopTimer();
}

function resetGame() {
  startGame();
}

//card actions
function cardClicked(element) {
  flipCard(element);
  if (firstCardClicked === null) {
    firstCardClicked = element;
    lockCard(firstCardClicked);
    return;
  } else {
    secondCardHasBeenClicked(element);
  }
  displayStatsScores();
}

function flipCard(clickedCard) {
  animateToFlipCards(clickedCard);
  var cardIsActive = $(clickedCard).hasClass("active");
  if (cardIsActive) {
    $(clickedCard).removeClass("active");
  } else {
    $(clickedCard).addClass("active");
  }
}

function secondCardHasBeenClicked(element) {
  var firstCardClickedTemp = null;
  var secondCardClickedTemp = null;
  secondCardClicked = element;
  var checkFirstCard = $(firstCardClicked).attr('data-picture');
  var checkSecondCard = $(secondCardClicked).attr('data-picture');
  var cardMatch = false;
  lockAllCards();
  lockCard(secondCardClicked);
  if (checkFirstCard === checkSecondCard) {
    cardsMatched();
    resetStoredCardsToNull();
    winningCondition();
    displayStats["correct-scores"]++;
    unlockAllCards();
  } else {
    firstCardClickedTemp = firstCardClicked;
    secondCardClickedTemp = secondCardClicked;
    resetStoredCardsToNull();
    setTimeout(function () {
      flipCard(firstCardClickedTemp);
      flipCard(secondCardClickedTemp);
      unlockCard(firstCardClickedTemp);
      unlockCard(secondCardClickedTemp);
      unlockAllCards();
    }, 500);
    displayStats["incorrect-scores"]++;
  }
}

function resetStoredCardsToNull() {
  secondCardClicked = null;
  firstCardClicked = null;
}


function randomNumber(value) {
  return Math.floor(Math.random() * 100) % value;
}

function shuffleCards(tempArray, intensity = 100) {
  for (var i = 0; i < intensity; i++) {
    var currentPictureCard1 = randomNumber(tempArray.length - 1);
    var currentPictureCard2 = randomNumber(tempArray.length - 1);
    var tempNum = tempArray[currentPictureCard1];
    tempArray[currentPictureCard1] = tempArray[currentPictureCard2];
    tempArray[currentPictureCard2] = tempNum;
  }
  return tempArray;
}

function generateCard(picture) {
  return `<div class="col-sm-2">
  <div class="border-image-container" data-picture="${picture}">
               <div class="image-container">
                  <img class="front-of-pic card-face-front" src="images/${picture}.jpg"> 
                  <div class="back-of-picframe-image card-face-back"></div>       
        </div>  
</div>
</div>`
};

function generateMultipleCards() {
  var counter = 1;
  var cards = "";
  var cardRows = "";
  for (var i = 0; i < pictureCardConcat.length; i++) {
    var currentPictureCard = pictureCardConcat[i];
    cards += generateCard(currentPictureCard);
    if (counter % 6 == 0) {
      cards = `<div class="row"> ${cards} </div>`;
      cardRows += cards;
      cards = "";
    }
    counter++;

  }
  $('#game-area').html(cardRows);
  animateToFlipCards();
}

function removeGenerateCards() {
  $('#game-area').html('');
}

function cardsMatched() {
  firstCardClicked.addClass('cardMatched');
  secondCardClicked.addClass('cardMatched');
}

function hasWonGame() {
  var pictureCardLength = pictureCardConcat.length;
  return $('.cardMatched').length === pictureCardLength;
}

function animateToFlipCards(card){
   $(card).toggleClass('animateFlipCard');
}

//display stats
var displayStats = {
  "correct-scores": 0,
  "incorrect-scores": 0,
}

function displayStatsScores() {
  var correct = displayStats["correct-scores"];
  var incorrect = displayStats["incorrect-scores"];
  $('#correct-display').text(correct);
  $('#incorrect-display').text(incorrect);
}

function resetScore() {
  displayStats["correct-scores"] = 0;
  displayStats["incorrect-scores"] = 0;
  displayStatsScores();

}

// timer
function startTimer() {
  var sec = 60;
  clearInterval(timer);
  timer = setInterval(function () {
    $('.timer').text(sec);
    sec--;
    if (sec === 0) {
      stopTimer();
      lockAllCards();
      losingCondition();
    }
  }, 1000);
}

function stopTimer() {
  $('.timer').text('00');
  clearInterval(timer);
}

//winning and losing condition
function winningCondition() {
  if (hasWonGame()) {
    $('.modal').addClass('active');
    $('.modal-win-text').addClass('active');
    $('.modal-lose-text').removeClass('active');
    stopTimer();
  }
}

function losingCondition() {
  $('.modal').addClass('active');
  $('.modal-lose-text').addClass('active');
  $('.modal-win-text').removeClass('active');
  lockAllCards();
}


//splash page effect
var counterLetter= 0;
function typeWriter() {
  var text = "Battlestar Galactica";
  var speed = 210;
  if (counterLetter < text.length) {
    var newChar=$('.header').text()+(text.charAt(counterLetter));
    $('.header').text(newChar);
    counterLetter++;
    setTimeout(typeWriter,speed);
  }
}


//game modal
function closeModal(){
  $('.modal').removeClass('active');
}

function yesButton(){
  closeModal();
  $('.yes-btn').click(startGame);
}

function noButton(){
  closeModal();
  $('.no-btn').click(closeModal);
}

//about-me effects

$('#about-me-pic').click(toggleAboutMeParagraph);
$('#about-me-pic').click(flipAboutMePic);

function toggleAboutMeParagraph(){
  $('#about-me-container').slideToggle( "slow" );
}

function flipAboutMePic(){
  $('#about-me-pic').toggleClass('animateAboutMeFlipCard');

  //soundtrack
