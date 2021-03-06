const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.post("/logout", authController.logout);
Router.get("/active/:id", authController.getActive);
Router.post("/refresh", authController.refreshToken);

module.exports = Router;
