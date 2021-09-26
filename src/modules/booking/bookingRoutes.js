const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

Router.get("/get_booking/:id", bookingController.getBookingById);
Router.get("/user/:userId", bookingController.getBookingByIdUser);
Router.get("/booking_seat", bookingController.getSeatBooking);
Router.post("/", bookingController.postBooking);

module.exports = Router;
