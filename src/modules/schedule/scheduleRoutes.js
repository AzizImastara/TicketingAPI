const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareAuth = require("../../middleware/auth");
// const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareAuth.authentication,
  // middlewareRedis.getScheduleRedis,
  scheduleController.getAllSchedule
);
// =====
Router.get(
  "/:id",
  middlewareAuth.authentication,
  // middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleByid
);
// =====
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.admin,
  // middlewareRedis.clearScheduleRedis,
  scheduleController.postSchedule
);
// =====
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.admin,
  // middlewareRedis.clearScheduleRedis,
  scheduleController.updateSchedule
);
// =====
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.admin,
  // middlewareRedis.clearScheduleRedis,
  scheduleController.deleteSchedule
);

module.exports = Router;
