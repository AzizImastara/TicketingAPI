const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/get_booking/:id",
  middlewareAuth.authentication,
  bookingController.getBookingById
);
Router.get(
  "/user/:userId",
  middlewareAuth.authentication,
  bookingController.getBookingByIdUser
);
Router.get(
  "/booking_seat",
  middlewareAuth.authentication,
  bookingController.getSeatBooking
);
Router.post("/", bookingController.postBooking);
Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.admin,
  bookingController.getDashboard
);
Router.get(
  "/qr/:id",
  middlewareAuth.authentication,
  middlewareAuth.admin,
  bookingController.getQR
);

module.exports = Router;
