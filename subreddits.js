

var GuessReddit = {
  //ELEMENTS
  inputDiv: null,
  addButton: null,
  goButton: null,
  //LISTS
  inputs: [],

  init: function(){
    this.addButton = document.createElement('button');
    this.inputDiv = document.createElement('div');
    this.inputDiv.classList.add('inputDiv');
    this.goButton = document.createElement('button');
    this.addButton.innerHTML = "ADD";
    this.goButton.innerHTML = "GO";
    this.addButton.classList.add('main');
    this.goButton.classList.add('main');
    document.body.appendChild(this.addButton);
    document.body.appendChild(this.inputDiv);
    document.body.appendChild(this.goButton);
    this.addButton.onclick = this.addTextInput.bind(this);
    this.goButton.onclick = this.startGame.bind(this);
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
          JSON.parse(request.responseText).data.children.forEach(x=>this.titles.push(x.data.title));
          this.success();
        } else {
          this.error();
        }
      }
    }.bind(this);

    var text = "http://www.reddit.com/r/" + subreddit + "/.json?sort=new";

    request.open("GET", text);//"https://api.reddit.com/r/"+subreddit);
    request.setRequestHeader('Content-Type', 'text/plain');

    request.send();
  },

  startGame: function(){
    if(this.readyCheck()){
    } else {
      alert('Please enter at least 5 valid subreddits.');
    }
  },

  readyCheck: function(){
    if(this.inputs.length >= 5 && this.inputs.filter(x=>!x.valid).length == 0){
      return true;
    } else {
      return false;
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
