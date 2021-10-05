const express = require("express");
const middlewareUpload = require("../../middleware/uploadMovie");

const Router = express.Router();

const authController = require("./authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.get("/user/:id", authController.getUserById);
Router.patch("/updatePassword/:id", authController.updatePassword);
Router.patch("/updateProfile/:id", authController.updateProfile);
Router.patch("/updateImage/:id", middlewareUpload, authController.updateImage);
Router.post("/logout", authController.logout);
Router.get("/active/:id", authController.getActive);

// Router.get("/", (resquest, response) => {
//   response.send("Hello World");
// });

module.exports = Router;
