//look up given email in the users database
const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
};
const lookUpCookie = function(cookie, cookieDataBase) {
  for (let c in cookieDataBase) {
    if (cookie === cookieDataBase[c]) {
      return true;
    }
  }
  return false;
};
module.exports = {
  getUserByEmail,
  lookUpCookie
};
