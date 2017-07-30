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

const findLetters = function(word, letter) {
  const indices = [];
  for (let i = 0; i < word.length; i++) {
    if (word.charAt(i) === letter) {
      indices.push(i);
    }
  }

  console.log('indices', word, letter, indices);
  return indices;
}

//mustache express things.
const mustacheInstance = mustacheExpress();
mustacheInstance.cache = null;

app.engine('mustache', mustacheInstance);
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended : true }));

// get mustache.index in views and render it to localhost.
app.get('/', function(req, res) {
  console.log('getting index');

  req.session.guesses = [];
  req.session.correctGuesses = [];
  req.session.guessesLeft = 2;
  req.session.randomWord = words[ Math.floor(words.length * Math.random()) ];
  // req.session.randomWord = 'foo';

  const letters = req.session.randomWord.split('');
  req.session.letters = [];
  for (let i = 0; i < letters.length; i++) {
    req.session.letters.push({
      markup: `<span style="text-decoration: underline">&nbsp;</span>`,
      letter: letters[i],
      guessed: false
    });
  }

  res.render('index', req.session);
});

app.post('/', function(req, res) {
  const guess = req.body.guess;
  req.session.guesses.push(guess);
  const indices = findLetters(req.session.randomWord, guess);

  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    req.session.letters[index].markup = `<span style="text-decoration:underline">${guess}</span>`;
    req.session.letters[index].guessed = true;
  }

  if (req.session.randomWord.includes(guess)) {
    req.session.correctGuesses.push(guess);
  } else {
    req.session.guessesLeft -= 1;
  }

  if (!req.session.guessesLeft) {
    for (let i = 0; i < req.session.letters.length; i++) {
      if (!req.session.letters[i].guessed) {
        req.session.letters[i].markup = `<span style="text-decoration:underline red;color:red">${req.session.letters[i].letter}</span>`;
      }
    }
  }

  res.render('index', req.session);
})

app.listen(5555, function() {
  console.log('listening on port 5555!');
});
