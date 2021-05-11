const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
//import body-parse to translate buffer into string
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//Set ejs as the view engine
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  let i = 0;
  while (i <= 6) {
    result =result+characters.charAt(Math.floor(Math.random()*characters.length));
    i++;
  }
  return result;
};
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars)
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new')
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    //define shortURL by route parameters 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  }
    res.render('urls_show', templateVars)
});

app.post('/urls', (req, res) => {
  // console.log(req.body);
  urlDatabase[generateRandomString()]=req.body.longURL;
  res.send('ok');
  console.log(urlDatabase);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
