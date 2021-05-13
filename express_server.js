const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    ID: "userRandomID",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    ID: "user2RandomID"
  }
};
//generate a random short URL
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
//look up given email in the users database
const lookUpEmail = function(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return false;
}
const urlsForUser = function(id) {
  const userDataBase = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].ID === id) {
      userDataBase[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return userDataBase;
}
app.get('/urls', (req, res) => {
  //if user has not logged in,
  if (!req.cookies['user_id']) {
    const templateVars = {
      user: users[req.cookies.user_id],
      message: "Please log in first."
    }
    res.render('urls_index', templateVars);
  } else {
    const templateVars = {
      urls: urlsForUser(req.cookies['user_id']),
      user: users[req.cookies.user_id],
      message:''
    };
    res.render('urls_index', templateVars);
  }
});
app.get('/urls/new', (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect('/login');
  } else {
    const templateVars = {
      user: users[req.cookies.user_id]
    };
    res.render('urls_new', templateVars);
  }
});
app.get('/urls/:shortURL', (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect('/login');
  } else {
    const templateVars = {
      //define shortURL by route parameters 
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.cookies.user_id]
    };
    res.render('urls_show', templateVars)
  }
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render('urls_register', templateVars);
})
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render('urls_login', templateVars);
})
//clear cookie and logout
app.get('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})
//save input long URL and a random-generated shortURL to urlDatabase
//redirect to this long URL
app.post('/urls', (req, res) => {
  const newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = {};
  urlDatabase[newShortUrl].longURL = req.body.longURL;
  //add user_id to the urlDatabase 
  urlDatabase[newShortUrl].userID = req.cookies['user_id'];
  res.redirect(`/urls/${newShortUrl}`);
});

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect('/urls');
})
//handle a post request to login
//set a cookie to the value submitted in the request body via the login form
app.post('/login', (req, res) => {
  if (!lookUpEmail(req.body.email)) {
    res.sendStatus(403);
  } else if (lookUpEmail(req.body.email).password !== req.body.password) {
    res.sendStatus(403);
  } else {
    res.cookie('user_id', lookUpEmail(req.body.email).id);
    res.redirect('/urls');
  }
})

//store register information in users object
//set a user_id cookie 
app.post('/register', (req, res) => {
  //adjust if the registration information is valide
  if (!req.body.email || !req.body.password) {
    res.sendStatus(404);
  } else if (lookUpEmail(req.body.email)) {
    res.sendStatus(400);
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

