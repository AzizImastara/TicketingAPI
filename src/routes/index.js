const express = require("express");

const Router = express.Router();
const helloRoutes = require("../modules/helloRoutes");
const movieRoutes = require("../modules/movie/movieRoutes");
const scheduleRoutes = require("../modules/schedule/scheduleRoutes");
const bookingRoutes = require("../modules/booking/bookingRoutes");

// const authRoutes = require(...)
// Router.get("/hello", (request, response) => {
//   response.send("Hello World");
// });
// Router.use("/auth", authRoutes)

Router.use("/hello", helloRoutes);
Router.use("/movie", movieRoutes);
Router.use("/schedule", scheduleRoutes);
Router.use("/booking", bookingRoutes);

module.exports = Router;
