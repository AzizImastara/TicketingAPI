const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.get("/:id", bookingController.getBookingById);
Router.get("/user/:idUser", bookingController.getBookingByIdUser);
Router.get("/:id", bookingController.getSeatBooking);
Router.post("/", bookingController.postBooking);

module.exports = Router;
