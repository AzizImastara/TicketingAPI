const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadMovie");

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.getMovieRedis,
  movieController.getAllMovie
);
// =========
// Router.get("/", movieController.getAllMovie);
// =========
Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieByid
);
// ========
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearMovieRedis,
  middlewareUpload, // tambahkan middleware upload file
  movieController.postMovie
);
// ========
Router.patch("/:id", movieController.updateMovie);
// ========
Router.delete(
  "/:id",
  middlewareRedis.clearMovieRedis,
  movieController.deleteMovie
);

module.exports = Router;
