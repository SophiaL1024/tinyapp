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
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username,
    user: users[req.cookies.user_id]
  };
  res.render('urls_index', templateVars)
});
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies.username,
    user: users[req.cookies.user_id]
  };
  res.render('urls_new', templateVars);
});
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    //define shortURL by route parameters 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username,
    user: users[req.cookies.user_id]
  };
  res.render('urls_show', templateVars)
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
app.get('/register', (req, res) => {
  const templateVars = {
    username: req.cookies.username,
    user: users[req.cookies.user_id]
  };
  res.render('urls_register', templateVars)
})
//save input long URL and a random-generated shortusers:username URL to urlDatabase
//redirect to this long URL
app.post('/urls', (req, res) => {
  const newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = req.body.longURL;
  res.redirect(`/urls/${newShortUrl}`);
});

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
})
//handle a post request to login
//set a cookie to the value submitted in the request body via the login form
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies.username,
    user: users[req.cookie.user_id]
  };
  res.redirect('/urls');
  res.render("urls_index", templateVars);
})
//clear cookie and logout
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})
//store register information in users object
//set a user_id cookie 
app.post('/register', (req, res) => {
//adjust if the registration information is empty
  if (!req.body.email || !req.body.password) {
    res.status=404;
    res.send(res.statusCode);
  } else {
    const userId = generateRandomString();
    users[userId] = {
      id: userId,
      email: req.body.email,
      password: req.body.password
    };
    res.cookie('user_id', userId)
    res.redirect('/urls')
  }
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

