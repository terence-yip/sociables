var startButton = document.getElementById("start-button");
var playerEntry = document.getElementById("player-entry");
var editablePlayerList = document.getElementById("editable-player-list");
var lastMonitoredRow =  editablePlayerList.lastElementChild.firstElementChild;
var mainContainer = document.getElementById("main");
var nextButton = document.getElementById("navigate-right");
var prevButton = document.getElementById("navigate-left");
var currentPageIndex = 0;
var numberOfPlayers = 0;
var numberOfCards = 0;
var mainContent = document.getElementById("main-content");
var players = {};
var cardRules = {};
var tooltip = document.getElementById("tooltip");
cardRules["Girls Drink"] = "All ladies take a drink.";
cardRules["Guys Drink"] = "All guys take a drink.";
cardRules["Sociables"] = "Everyone takes drink!";
cardRules["Take Two"] = "%player% takes two drinks.";
cardRules["Assign Three"] = "%player% assigns three drinks. Multiple drinks can be assigned to a single player, assigned to multple players, or a combination of the two.";
cardRules["Sevens"] = "Players take turns counting up. For every multiple of seven or number with a seven digit (ex. 14, 17, 21, 27), say \"f*** u\" instead of the number and reverse the direction. The person to botch the count takes a drink. %player% starts the game at one. Proceed in a clockwise direction.";
cardRules["Categories"] = "Players take turns naming an item that falls under the selected category (ex. Category: NHL Teams - Item: Calgary Flames). The player that fails to name an item or repeats a previously named item takes a drink. %player% picks a category and names the first item. Proceed in a clockwise direction."
cardRules["Story Time"] = "Players take turns making up a story one word at a time. Players will need to say the entire story before adding a word to the story. %player% starts the story with a single word. Proceed in a clockwise direction.";
cardRules["Rule Card"] = "%player% makes a rule that all players must abide by. Rules will remain until the end of the game or until another rule card negates a previously declared rule.";
cardRules["Rock Paper Scissors"] = "%player% picks another player to challenge to a best out of 3 game of rock, paper, scissors. Whoever loses drinks 3.";
cardRules["Rhyme Time"] = "Players take turns saying a word that rhymes with the first word. The player that cannot think of a rhyming word or repeats a word that has already been said drinks. %player% picks the first word. Proceed in a clockwise direction.";
cardRules["Never Have I Ever"] = "%player% says something they have never done. Players that have done it take a drink.";
cardRules["Pick a Mate"] = "%player% picks a mate. The mate drinks every time %player% drinks until the next Pick a Mate card is drawn.";
cardRules["Red or Black"] = "Players take turns guessing whether the next color is red or black and then pressing the button. If guessed right, continue on to the next person. If guessed wrong, drinks and guess again. Repeat for two rounds.";

// Random cards ie. do pushups, situps, dares, etc.
// Thumb card
// Box head
// Mini hand game
// Best out of 3
// Higher or Lower
// Kings cup
// Phone in bucket

 function startGame() {
  playerEntry.className = "closed";
  mainContainer.className = "visible";
  createCards();
  updateButtonVisibility();
}

nextButton.addEventListener("click", function() {
  currentPageIndex++;
  updateCurrentPage();
});

prevButton.addEventListener("click", function() {
  currentPageIndex--;
  updateCurrentPage();
});

function updateButtonVisibility() {
  if(currentPageIndex > 0) {
    prevButton.className = "visible";
  } else {
    prevButton.className = "hidden";
  }
  
  if(currentPageIndex < numberOfCards - 1) {
    nextButton.className = "visible";
  } else {
    nextButton.className = "hidden";
  }
}

function updateCurrentPage() {
  var currentPagePercent = currentPageIndex * 100;
  mainContent.style.transform = "translateX(-" + currentPagePercent + "%)";
  updateButtonVisibility();
}

function updateMonitoredRow() {
  lastMonitoredRow.removeEventListener("input", createPlayerInput);
  lastMonitoredRow = editablePlayerList.lastElementChild.firstElementChild;
  lastMonitoredRow.addEventListener("input", createPlayerInput);
}

function createPlayerInput() {
  if(lastMonitoredRow.value != "") {
    var newRow = editablePlayerList.lastElementChild.cloneNode(true);
    var rowInput = newRow.firstElementChild;
    rowInput.value = "";
    var playerNumber = editablePlayerList.children.length + 1;
    rowInput.placeholder="Player " + playerNumber;
    rowInput.style.animation="enlarge 0.3s";
    editablePlayerList.appendChild(newRow);
    updateMonitoredRow();
    watchRowForPlayerNameChanges(playerNumber, rowInput);
  }
}

function watchRowForPlayerNameChanges(playerNumber, rowInput) {
    rowInput.addEventListener("input", function() {
      var playerName = rowInput.value;
      if(playerName != "") {
        players[playerNumber] = playerName;
      } else {
        delete players[playerNumber];
      }
      updateStartButtonAvailability();
    });  
}

function updateStartButtonAvailability() {
  if(Object.keys(players).length > 1) {
    startButton.disabled = false;
  } else {
    startButton.disabled = true;
  }
}

function createCards() {
  var playerIndex = 1;
  var cardRulesLength = Object.keys(cardRules).length;
  numberOfCards = cardRulesLength * 4;
  var cardDeck = [];
  for(var title in cardRules) {
    for(var i = 0; i < 4; i++) {
      cardDeck.push(title);
    }
  }
  cardDeck = shuffle(cardDeck);
  for(var i = 0; i < cardDeck.length; i++) {
    var player = players[playerIndex];
    var title = cardDeck[i];
    var content = cardRules[title];
    createCard(player, title, content);
    playerIndex++;
    if(playerIndex > Object.keys(players).length) {
      playerIndex = 1;
    }    
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function createCard(playerName, title, content) {
  content = content.replaceAll("%player%", playerName);
  numberOfPlayers++;
  var player = document.createElement("div");
  player.className = "page";
  player.innerHTML = "<h1>" + playerName + "'s Turn</h1>";
  var card = document.createElement("div");
  card.className="card";
  card.innerHTML = "<div class=\"back\"></div><div class=\"front\"><h2>" + title + "</h2><p><i class=\"material-icons info\">&#xe88e;</i></p></div>";
  card.addEventListener("click", function(){
    card.style.transform="rotateY(180deg)";
  });
  mainContent.appendChild(player);
  player.appendChild(card);
  if(title=="Red or Black") {
    addRedOrBlack(card);
  }
  openTooltipOnClickingInfo(card, content);
}

function openTooltipOnClickingInfo(card, content) {
  var button = card.getElementsByClassName("info")[0];
  button.addEventListener("click", function(e){
    e.stopPropagation();
    moveTooltip(button, content);
  });
}

function moveTooltip(button, content) {
    tooltip.innerHTML = content;
    var infoLocation = getLocation(button);
    tooltip.style.top = infoLocation.top + "px";
    tooltip.style.left = 50 + "%";
    tooltip.className = "visible";
}

function getLocation(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

function addRedOrBlack(card){
    var cardFront = card.getElementsByClassName("front")[0];
    cardFront.innerHTML += "<div class=\"red-or-black\">Click me</div>";
    var button = card.getElementsByClassName("red-or-black")[0];
    button.addEventListener("click", function(){
      var isRed = Math.round(Math.random());
      if(isRed) {
        button.className = "red";
      } else {   
        button.className = "black";
      }
      runRedOrBlackAnimation(button);
    });  
}

function runRedOrBlackAnimation(redOrBlack){  
  clearInterval(redOrBlack);
  redOrBlack.style.animation = "";
  redOrBlack.offsetWidth;
  redOrBlack.style.animation = "rotate 1.5s";
}

function setupReplaceAllFunctionality() {
  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);};
}

function setupTooltipVisibility() {
    tooltip.addEventListener("click", function(e){
      e.stopPropagation();
    });
    document.addEventListener("click", function (){
      tooltip.className="hidden";
    });
}

updateMonitoredRow();
updateButtonVisibility();
setupReplaceAllFunctionality();
setupTooltipVisibility();

watchRowForPlayerNameChanges(1, editablePlayerList.children[0].firstElementChild);
watchRowForPlayerNameChanges(2, editablePlayerList.children[1].firstElementChild);
updateStartButtonAvailability();

// players[1]="Terry";
// players[2]="Gina";
// startGame();
