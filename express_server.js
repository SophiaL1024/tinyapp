const PORT = 8080;
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const { getUserByEmail } = require('./helpers');
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'myCookieSession',
  keys: ['it is my key', 'you should not peep']
}))
app.use(methodOverride('_method'));
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
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
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
  if (!req.session.user_id) {
    const templateVars = {
      user: users[req.session.user_id],
      message: "Please log in first."
    }
    res.render('urls_index', templateVars);
  } else {
    const templateVars = {
      urls: urlsForUser(req.session.user_id),
      user: users[req.session.user_id],
      message: ''
    };
    res.render('urls_index', templateVars);
  }
});
app.get('/urls/new', (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    const templateVars = {
      user: users[req.session.user_id]
    };
    res.render('urls_new', templateVars);
  }
});
app.get('/urls/:shortURL', (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    const templateVars = {
      //define shortURL by route parameters 
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.user_id]
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
    user: users[req.session.user_id]
  };
  res.render('urls_register', templateVars);
})
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render('urls_login', templateVars);
})

//save input long URL and a random-generated shortURL to urlDatabase
//redirect to this long URL
app.post('/urls', (req, res) => {
  const newShortUrl = generateRandomString();
  urlDatabase[newShortUrl] = {};
  urlDatabase[newShortUrl].longURL = req.body.longURL;
  //add user_id to the urlDatabase 
  urlDatabase[newShortUrl].ID = req.session.user_id;
  res.redirect(`/urls/${newShortUrl}`);
});

app.put('/urls/:shortURL', (req, res) => {
  if (req.session.user_id) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.sendStatus(403);
  }
})
app.delete('/urls/:shortURL/delete', (req, res) => {
  if (req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.sendStatus(403);
  }
})
//handle a post request to login
//set a cookie to the value submitted in the request body via the login form
app.post('/login', (req, res) => {
  if (!getUserByEmail(req.body.email, users)) {
    return res.status(403).send('Sorry, I don\'t recognize this email');
  }
  //check if the request password equal to the password in users database
  bcrypt.compare(req.body.password, getUserByEmail(req.body.email, users, users).password)
    .then((resolve) => {
      if (resolve) {
        //encrypted cookie
        req.session.user_id = getUserByEmail(req.body.email, users).id;
        res.redirect('/urls');
      } else {
        return res.status(403).send('Email or password is incorrect');
      }
    });
});

//store register information in users object
//set a user_id cookie 
app.post('/register', (req, res) => {
  //judge if the registration information is valide
  if (!req.body.email || !req.body.password) {
    return res.status(404).send('Email or password should not be empty');
  } else if (getUserByEmail(req.body.email, users)) {
    return res.status(400).send('Sorry, this email has been registered');
  }
  const userId = generateRandomString();
  //use bcrypt to store password
  const email = req.body.email;
  const password = req.body.password;
  bcrypt.genSalt(10)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      users[userId] = {
        id: userId,
        email: email,
        password: hash
      };
      //encrypt cookie
      req.session.user_id = userId;
      res.redirect('/urls');
    });

});
//clear cookie and logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

