const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const helperWrapper = require("../helpers/wrapper");
const redis = require("../config/redis");

module.exports = {
  authentication: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return helperWrapper.response(res, 403, "Please login first");
    }
    token = token.split(" ")[1];

    redis.get(`accessToken:${token}`, (error, result) => {
      if (!error && result !== null) {
        return helperWrapper.response(
          res,
          403,
          "Your token is destroyed please login again"
        );
      }
      jwt.verify(token, process.env.SECRET_KEY, (err, resultJwt) => {
        if (err) {
          return helperWrapper.response(res, 403, err.message);
        }
        req.decodeToken = resultJwt;
        // result = {
        //   id: 'fc3786be-7086-4348-b407-d79e008d0a45',
        //   email: 'bagustri15@gmail.com',
        //   createdAt: '2021-09-28T04:10:52.000Z',
        //   updatedAt: null,
        //   iat: 1632809494,
        //   exp: 1632895894
        // }
        next();
      });
    });
  },
  admin: (req, res, next) => {
    const { authorization } = req.headers;
    const decoded = jwtDecode(authorization.split(" ")[1]);
    if (decoded.roles === "admin") {
      return next();
    }

    return helperWrapper.response(res, 403, "Your not admin");
  },
};
