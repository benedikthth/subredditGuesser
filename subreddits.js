

var GuessReddit = {
  //ELEMENTS
  mainInputDiv: null,
  inputDiv: null,
  addButton: null,
  goButton: null,
  gameDiv: null,
  //LISTS
  inputs: [],
  subredditTitlePairs: null,


  element: function(type){
    var e = document.createElement(type);
    e.show = function(){
      this.style.display = "";
    }.bind(e);
    e.hide = function(){
      this.style.display = "none";
    }.bind(e);
    return e;
  },



  init: function(){

    if(!window.nEl){
      window.nEl = this.element;
    }

    this.mainInputDiv = nEl('div');
    this.addButton = nEl('button');//this.element('button');//document.createElement('button');
    this.inputDiv = nEl('div');//document.createElement('div');
    this.inputDiv.classList.add('inputDiv');
    this.goButton = document.createElement('button');
    this.addButton.innerHTML = "ADD";
    this.goButton.innerHTML = "GO";
    this.addButton.classList.add('main');
    this.goButton.classList.add('main');
    this.mainInputDiv.appendChild(this.addButton);
    this.mainInputDiv.appendChild(this.inputDiv);
    this.mainInputDiv.appendChild(this.goButton);

    document.body.appendChild(this.mainInputDiv);
    this.addButton.onclick = this.addTextInput.bind(this);
    this.goButton.onclick = this.startGame.bind(this);

    this.gameDiv = nEl('div');//this.element('div');//document.createElement('div');
    this.gameDiv.hide();


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
