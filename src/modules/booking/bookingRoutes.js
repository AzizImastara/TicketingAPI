const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.get("/get_booking/:id", bookingController.getBookingById);
Router.get("/user/:userId", bookingController.getBookingByIdUser);
Router.get("/booking_seat", bookingController.getSeatBooking);
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
