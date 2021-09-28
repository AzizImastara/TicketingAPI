const jwt = require("jsonwebtoken");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  authentication: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return helperWrapper.response(res, 403, "Please login first");
    }
    token = token.split(" ")[1];

    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(res, 403, error.message);
      }
      req.decodeToken = result;
      next();
    });
  },
};
