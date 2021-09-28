const redis = require("../config/redis");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  getMovieByIdRedis: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getMovie:${id}`, (error, result) => {
      if (!error && result !== null) {
        console.log("data ada di dalam redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(
          res,
          200,
          "Success get data by id",
          newResult
        );
      }
      console.log("data tidak ada di dalam redis");
      next();
    });
  },
  getMovieRedis: (req, res, next) => {
    redis.get(`getMovie:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result !== null) {
        console.log("data ada didalam redis");
        const newResult = JSON.parse(result);
        return helperWrapper.response(
          res,
          200,
          "Success get data",
          newResult.result,
          newResult.pageInfo
        );
      }
      console.log("data tidak ada didalam redis");
      next();
    });
  },
  clearMovieRedis: (req, res, next) => {
    redis.keys("getMovie:*", (error, result) => {
      // result = ["getMovie:{\"page\":\"1\",\"limit\":\"1\"}"]
      if (result.length > 0) {
        // PROSES DELETE KEYS
        result.forEach((item) => {
          redis.del(item);
        });
      }
      next();
    });
  },
};
