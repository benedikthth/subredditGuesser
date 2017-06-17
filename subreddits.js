

var GuessReddit = {
  //ELEMENTS
  suggestionNumber: 3,
  //main divs
  playerSelectionDiv: null, //choose players playing.
  mainInputDiv: null, //subreddit input
  gameDiv: null, // actual game representation
  //lesser divs
    //player selection
  playerListDiv: null,
  playersReadyButton: null,
    //subreddit divs
  inputDiv: null,
  addButton: null,
  goButton: null,
    //game divs
  titleDiv: null,
  suggestionDiv: null,

  //LISTS
  playerInputs: [],
  players: [],
  inputs: [],
  subredditTitlePairs: null,
  score : {},


  element: function(type){
    var e = document.createElement(type);/*
    e.show = function(){
      this.classList.remove('HIDDEN');
    }.bind(e);
    e.hide = function(){
      this.classList.add('HIDDEN')
    }.bind(e);
    e.remove(){
      body.removeChild(this);
    }.bind(e);
    e.*/
    e._target = null;
    e.show = function(target){

      var thisTargetIsNull = (this._target === null),
          targetIsUndefined = (!target);

      if(thisTargetIsNull && targetIsUndefined){
        // This.Target and target are missing
        this._target = document.body;
      } else if (thisTargetIsNull){
        // this target is null but target is not.
        this._target = target;
      }
      this._target.appendChild(this);
    }.bind(e);

    e.hide = function(){
      if(this._target !== null){
        if(this._target.contains(this)){
          this._target.removeChild(this);
        }
      } else {
        if(document.body.contains(this)){
          document.body.removeChild(this);
        }
      }
    }.bind(e);

    return e;
  },



  init: function(){

    if(!window.nEl){
      window.nEl = this.element;
    }
    /*Player input*/
    this.playerSelectionDiv = nEl('div');
    this.playerSelectionDiv.classList.add('mainDiv');
    this.playerListDiv = nEl('div');
    //this.addPlayerInput();
    this.addPlayerButton = nEl('button');
    this.addPlayerButton.onclick = this.addPlayerInput.bind(this);
    this.addPlayerButton.innerHTML = 'Add Player';/*
    this.playerSelectionDiv.appendChild(this.addPlayerButton);
    this.playerSelectionDiv.appendChild(this.playerListDiv);
    */
    this.addPlayerButton.show(this.playerSelectionDiv);
    this.playerListDiv.show(this.playerSelectionDiv);

    this.playersReadyButton = nEl('button');
    this.playersReadyButton.classList.add('main');
    this.playersReadyButton.innerHTML = 'Ready';

    this.playersReadyButton.onclick = function(){
      if(this.players.length !== 0){

        this.players.forEach( player => this.score[player] = 0 );

        this.playerSelectionDiv.hide();
        this.mainInputDiv.show();


      }
    }.bind(this);

    //this.playerSelectionDiv.appendChild(this.playersReadyButton);
    this.playersReadyButton.show(this.playerSelectionDiv);
    //document.body.appendChild(this.playerSelectionDiv);
    this.playerSelectionDiv.show(document.body);

    /*</player input>*/
    /*Subreddit input*/
    this.mainInputDiv = nEl('div');
    this.mainInputDiv.classList.add('mainDiv');
    this.addButton = nEl('button');//this.element('button');//document.createElement('button');
    this.inputDiv = nEl('div');//document.createElement('div');
    this.inputDiv.classList.add('mainDiv');
    this.goButton = nEl('button');
    this.addButton.innerHTML = "ADD";
    this.goButton.innerHTML = "GO";
    this.addButton.classList.add('main');
    this.goButton.classList.add('main');
    this.addButton.show(this.mainInputDiv);
    this.inputDiv.show(this.mainInputDiv);
    this.goButton.show(this.mainInputDiv);
    /*</subreddit input>*/
    this.addButton.onclick = this.addTextInput.bind(this);
    this.goButton.onclick = this.startGame.bind(this);
    /*<actual game> */
    this.gameDiv = nEl('div');
    this.gameDiv.classList.add('mainDiv');

    this.scoreDiv = nEl('div');
    this.scoreDiv.show(this.gameDiv);
    this.currentPlayerDiv = nEl('div');
    this.currentPlayerDiv.show(this.gameDiv);
    this.titleDiv = nEl('div');
    this.titleDiv.show(this.gameDiv)
    this.suggestionDiv = nEl('div');
    this.suggestionDiv.show(this.gameDiv);
    /*</actual game> */

    //show playerSelectionDiv. hide the rest.
    this.playerSelectionDiv.show();


  },

  addPlayerInput: function(){
    var input = document.createElement('input');
    this.playerInputs.push(input);
    var deleteInputButton = document.createElement('button');
    deleteInputButton.innerHTML = 'X';
    var inputRowElement = document.createElement('div');
    inputRowElement.classList.add('inputRow');
    input.onchange = function(){
      if(input.value !== "" && input.value !== null){
        this.players = [];
        this.playerInputs.forEach(x=>this.players.push(x.value));
        console.log(this.players);
      }
    }.bind(this);

    deleteInputButton.onclick = function(inp){
      var inputRow = inp.inputRow;
      console.log(inp);
      this.players.splice(this.players.indexOf(inp.value), 1);
      this.playerInputs.splice(this.playerInputs.indexOf(inp), 1);
      this.playerListDiv.removeChild(inputRow);
    }.bind(this, input);

    inputRowElement.appendChild(input);
    input.inputRow = inputRowElement;
    inputRowElement.appendChild(deleteInputButton);
    this.playerListDiv.appendChild(inputRowElement);

  },


  addTextInput: function(){
    var input = document.createElement('input');
    var inputRow = document.createElement('div');
    inputRow.classList.add('inputRow');
    var inputDelete = document.createElement('button');
    inputDelete.innerHTML = "X";
    inputRow.appendChild(input);
    inputRow.appendChild(inputDelete);

    inputDelete.onclick = function(inp){
      var div = inp.inputRow;

      this.inputs.splice(this.inputs.indexOf(inp), 1);

      this.inputDiv.removeChild(div);
    }.bind(this, input);

    input.inputRow = inputRow;
    input.deleteButton = inputDelete;

    input.titles = [];
    input.subreddit = "";
    input.lastInput = Date.now();

    //-----------
    input.onchange = function(){
        input.subreddit = input.value;
        this.getSubredditTitles.bind(input)();
    }.bind(this);
    //-------------------
    input.valid = false;

    input.success = function(){
      this.valid = true;
      this.setValid();
    }.bind(input);

    input.error = function(){
      this.valid = false;
      this.titles = [];
      this.setValid();
    }.bind(input);

    input.setValid = function(){
      if(this.valid){
        this.classList.remove('invalid');
        this.classList.add('valid');
      } else {
        this.classList.remove('valid');
        this.classList.add('invalid');
      }
    }.bind(input);
    this.inputs.push(input);
    this.inputDiv.appendChild(inputRow);
  },

  getSubredditTitles: function(){
    var subreddit = this.value;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if(request.readyState === 4){ // complete
        if(request.status === 200){ // all ist ok
          this.titles = [];
          JSON.parse(request.responseText).data.children.forEach(x=>this.titles.push(x.data.title));
          this.success();
        } else {
          this.error();
        }
      }
    }.bind(this);

    var text = "http://www.reddit.com/r/" + subreddit + ".json?limit=50";

    request.open("GET", text);//"https://api.reddit.com/r/"+subreddit);
    request.setRequestHeader('Content-Type', 'text/plain');

    request.send();
  },

  startGame: function(){
    if(this.readyCheck()){
      this.mainInputDiv.hide();
      this.subredditTitlePairs = [];
      this.inputs.forEach(x=> this.subredditTitlePairs.push( {name: x.subreddit, titles: x.titles}));
      this.gameDiv.show();
      this.gameLoop();
    } else {
      alert('Please enter at least 5 valid subreddits.');
    }
  },

  readyCheck: function(){
    if(this.inputs.length >= 3 && this.inputs.filter(x=>!x.valid).length == 0){
      return true;
    } else {
      return false;
    }

  },

  getQuestion: function(){

    if(this.subredditTitlePairs !== null){
      var i = Math.floor(Math.random() * this.subredditTitlePairs.length );
      var selected = this.subredditTitlePairs[i];
      var title = selected.titles[Math.floor(Math.random() * selected.titles.length)];
      var returnValue = {answer: selected.name, question: title};
      return returnValue;
    } else {
      //this.error('Subreddit pairs is not initialized');
    }
  },

  playerIndex: 0,
  nextPlayer: function(){
    if(this.players.length === 0){
      throw("exception: players somwhow is empty.");
      return null;
    }
    var player = this.players[this.playerIndex];
    this.playerIndex = (this.playerIndex + 1) % this.players.length;
    return player;
  },

  questionIndex: 0,


  gameLoop: async function(){


    var qaPair = this.getQuestion();

    var suggestions = this.getSuggestionList(qaPair.answer);

    var player = this.nextPlayer();

    this.displayScoreDiv();
    this.displayCurrentPlayerDiv(player);

    this.titleDiv.innerHTML = qaPair.question;

    await this.clear(this.suggestionDiv);
    suggestions.forEach(function(suggestion){
      var suggestionButton = document.createElement('button');
      suggestionButton.innerHTML = suggestion;
      suggestionButton.onclick = function(answer, value, _player){
        if(value === answer){
          this.score[player] += 1;
        }
        this.gameLoop();
      }.bind(this, qaPair.answer, suggestion, player);

      this.suggestionDiv.appendChild(suggestionButton);

    }.bind(this));

  },



  getSuggestionList: function(answer){

    var subreddits = [];
    this.subredditTitlePairs.forEach(x=>subreddits.push(x.name));
    subreddits = subreddits.filter(x=>x!==answer);
    var shuffledInitialArray = this.shuffle(subreddits);
    var returnvalue = [];
    for (var i = 0; i < this.suggestionNumber && shuffledInitialArray.length; i++) {
      returnvalue.push(shuffledInitialArray.pop());
    }
    returnvalue.push(answer);
    return this.shuffle(returnvalue);
  },

  shuffle: function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  },

  clear: function(elementNode){
    while(elementNode.hasChildNodes()){
      elementNode.removeChild(elementNode.lastChild);
    }
  },

  displayScoreDiv: function(){
    this.clear(this.scoreDiv)
    Object.keys(this.score).forEach( function(player){
      var container = document.createElement('div');
      container.classList.add('scoreContainer');
      container.innerHTML= "" + player + ": " + this.score[player];
      this.scoreDiv.appendChild(container);
    }.bind(this));
  },
  displayCurrentPlayerDiv(player){
    this.currentPlayerDiv.innerHTML = player;
  }

}

GuessReddit.init();


/*
var inputDiv = document.querySelector('#inputDiv');
var inputs = [];


function addTextInput(){
  var input = document.createElement('input');
  input.titles = [];
  input.onchange = getSubredditTitles.bind(input);

  input.valid = false;

  input.success = function(){
    this.valid = true;
    this.setValid();
    console.log(this.titles);
  }.bind(input);

  input.error = function(){
    this.valid = false;
    this.setValid();
  }.bind(input);

  input.setValid = function(){
    if(this.valid){
      this.classList.remove('invalid');
      this.classList.add('valid');
    } else {
      this.classList.remove('valid');
      this.classList.add('invalid');
    }
  }.bind(input);

  inputs.push(input);
  inputDiv.appendChild(input);

}

function checkReddits(){}

var subredditsToCheck = [];
var subreddits = [];


function start(){
  subreddits.forEach(x=>console.log(x));
}

function readyCheck(){
  if(subreddits.length === subredditsToCheck.length){
    start();
  }
}

function getSubredditTitles(ev){
  var subreddit = ev.currentTarget.value;
  var oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function(){
    if(oReq.readyState === 4){ // complete
      if(oReq.status === 200){
        console.log(oReq);
        JSON.parse(oReq.responseText).data.children.forEach(x=>this.titles.push(x.data.title));
        this.success();
      } else {
        this.error();
      }
    }
  }.bind(this);

  oReq.open("GET", "https://api.reddit.com/r/"+subreddit);
  oReq.setRequestHeader('Content-Type', 'text/plain');//'application/json');

  oReq.send();
}
*/
