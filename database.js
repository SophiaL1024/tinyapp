
const bcrypt = require('bcrypt');

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    ID: "userRandomID",
    visitTime: [],
    visitorId: [],
    visitorCookie: []
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    ID: "user2RandomID",
    visitTime: [],
    visitorId: [],
    visitorCookie: []
  }
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

module.exports={
  urlDatabase,
  users
}