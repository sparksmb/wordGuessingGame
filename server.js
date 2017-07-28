const fs = require('file-system');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const express = require('express');
const mustacheExpress = require('mustache-express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
app.use(expressValidator());

app.use(session({
  secret: 'You Lost the Game.',
  resave: false,
  saveUninitialized: true
}));

//mustache express things.
const mustacheInstance = mustacheExpress();
mustacheInstance.cache = null;
app.engine('mustache', mustacheInstance);
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({extended : true}));


let lettersGuessed = '';
let guessesLeft = 0;
let holderForCorrectLetters = '';

function generation(req, res){
  let randomValue = words[Math.floor(words.length * Math.random())];

  req.session.lettersGuessed = lettersGuessed;
  req.session.guessesLeft = guessesLeft;
  req.session.randomValue = randomValue;
  req.session.holderForCorrectLetters = holderForCorrectLetters
  console.log("word right now:", randomValue);

  res.render('index', items = {
    lettersGuessed: req.session.lettersGuessed,
    guessesLeft: req.session.guessesLeft,
    randomValue: req.session.randomValue,
    holderForCorrectLetters = req.session.holderForCorrectLetters
  });
}
// get mustache.index in views and render it to localhost.
app.get('/', function(req, res){
  console.log('getting index');
  res.render('index');
  console.log('starting generation function')
  // generation(req, res);
});

app.post('/', function(req, res){

  let guess = req.body.guess;

  if (guess == randomValue) {
    lettersGuessed.push(guess)
    holderForCorrectLetters += guess;
    guessesLeft -= 1;
  }
  else {
    guessesLeft -= 1;
  } if (guessesLeft = 0;){
    holderForCorrectLetters = randomValue;
    lettersGuessed.clear;
    lettersGuessed = "You ran out of time!";
  }
})



app.listen(5555, function(){
  console.log('listening on port 5555!');
});
