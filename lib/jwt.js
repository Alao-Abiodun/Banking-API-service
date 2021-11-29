const jwt = require("jsonwebtoken");

const jwtSign = (payload) => {
  return jwt.sign(payload, process.env.TOKEN);
};

const jwtVerify = (token) => {
  try {
    return jwt.verify(token, process.env.TOKEN);
  } catch (err) {
    return false;
  }
};

module.exports = { jwtSign, jwtVerify };
