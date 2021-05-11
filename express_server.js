const PORT = 8080; 
const express = require("express");
//import body-parse to translate buffer into string
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
//Set ejs as the view engine
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//generrate a random short URL
const generateRandomString = function() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  let i = 0;
  while (i <= 6) {
    result = result + characters.charAt(Math.floor(Math.random() * characters.length));
    i++;
  }
  return result;
};
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars)
});
//
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
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//save input long URL and a random-generated short URL to urlDatabase
//redirect to this long URL
app.post('/urls', (req, res) => {
  const newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect(urlDatabase[newShortUrl]);
});

//when post from <form>, delete an entry in the database
app.post('/urls/:shortURL/delete',(req,res)=>{
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})
//when post update the longURL in the database
app.post('/urls/:shortURL',(req,res)=>{
  urlDatabase[req.params.shortURL]=req.body.longURL;
  res.redirect('/urls')
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

