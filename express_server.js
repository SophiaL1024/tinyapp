const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
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
  const templateVars = { 
    username: req.cookies['username'],
    urls: urlDatabase };
  res.render('urls_index', templateVars)
});
//
app.get('/urls/new', (req, res) => {
  const templateVars = { 
    username: req.cookies['username']
  };
  res.render('urls_new',templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    //define shortURL by route parameters 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies['username']
  };
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
  res.redirect(`/urls/${newShortUrl}`);
});

//when post from <form>, delete an entry in the database
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})
//when post, update the longURL in the database
app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls')
})
//handle a post request to login
//set a cookie to the value submitted in the request body via the login form
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  const templateVars = {
    username: req.cookies['username'],
    urls: urlDatabase
  };
  res.redirect('/urls')
  res.render("urls_index", templateVars);
})
//clear cookie and logoutusername: req.cookies['username']
app.post('/logout',(req,res)=>{
  res.clearCookie('username');
  res.redirect('/urls')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

