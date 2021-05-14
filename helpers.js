const { urlDatabase, users } = require('./database')
//look up given email in the users database
const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
};
//
const lookUpCookie = function(cookie, cookieDataBase) {
  for (let c of cookieDataBase) {
    if (cookie === c) {
      return true;
    }
  }
  return false;
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
//create url database for each user 
const urlsForUser = function(id) {
  const userDataBase = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].ID === id) {
      userDataBase[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  return userDataBase;
}
module.exports = {
  getUserByEmail,
  lookUpCookie,
  generateRandomString,
  urlsForUser
};
