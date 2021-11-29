const { jwtVerify } = require("../lib/jwt");
const Response = require("../lib/response");
const Error = require("../lib/error");
const validateUserToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let result;
    if (authHeader) {
      const token = req.headers.authorization.split(" ")[1];
      result = jwtVerify(token);
      if (!result) {
        throw Error("Invalid bearer token", "BAD REQUEST", 400);
      } else {
        req.decoded = result;
        next();
      }
    } else {
      throw Error("Authorization header is required", "BAD REQUEST", 400);
    }
  } catch (err) {
    Response(res).error(err, err.code);
  }
};

const validateAdmin = (req, res, next) => {
  try {
    const { role } = req.decoded;
    if (role === "Admin") {
      next();
    } else {
      throw Error("You are not authorised to access this route", "", 401);
    }
  } catch (err) {
    Response(res).error(err, err.code);
  }
};

module.exports = { validateUserToken, validateAdmin };
