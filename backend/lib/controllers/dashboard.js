const Base64 = require("js-base64").Base64;
const userDb = require("../db/user.js");

class dashboardController {
  get(req, res) {
    const authoriztionHeader = req.header("Authorization");
    const token = JSON.parse(Base64.decode(authoriztionHeader));
    const userInDatabase = userDb.getById(token.userId);
    const userData = {
      name: userInDatabase.name,
      email: userInDatabase.email,
      phone: userInDatabase.phone
    };

    res.json(userData);
  }
}

module.exports = new dashboardController();
