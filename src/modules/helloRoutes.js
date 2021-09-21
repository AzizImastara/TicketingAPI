const express = require("express");

const Router = express.Router();

const helloController = require("./helloController");

// Router.get("/", (resquest, response) => {
//   response.send("Hello World");
// });

Router.get("/", helloController.getHello);

module.exports = Router;
