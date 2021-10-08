const express = require("express");

const Router = express.Router();

const userController = require("./userController");
// const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadMovie");

Router.get("/user/:id", userController.getUserById);
Router.patch("/updatePassword/:id", userController.updatePassword);
Router.patch("/updateProfile/:id", userController.updateProfile);
Router.patch("/updateImage/:id", middlewareUpload, userController.updateImage);

module.exports = Router;
