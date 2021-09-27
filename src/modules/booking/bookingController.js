const bookingModel = require("./bookingModel");
const helperWrapper = require("../../helpers/wrapper");

module.exports = {
  getBookingById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingModel.getBookingById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const newResult = result.map((item) => {
        const data = item.seat
          ? {
              ...item,
              seat: item.seat.split(","),
            }
          : item;
        return data;
      });
      return helperWrapper.response(
        res,
        200,
        "Success get data by id",
        newResult
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  getBookingByIdUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await bookingModel.getBookingByIdUser(userId);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${userId} not found`,
          null
        );
      }
      const newResult = result.map((item) => {
        const data = item.seat
          ? {
              ...item,
              seat: item.seat.split(","),
            }
          : item;
        return data;
      });
      return helperWrapper.response(
        res,
        200,
        "Success get data by idUser",
        newResult
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  getSeatBooking: async (req, res) => {
    try {
      const { movieId, scheduleId, dateBooking, timeBooking } = req.query;
      const result = await bookingModel.getSeatBooking(
        movieId,
        scheduleId,
        dateBooking,
        timeBooking
      );
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${
            (movieId, scheduleId, dateBooking, timeBooking)
          } not found`,
          null
        );
      }
      const newResult = result.map((item) => {
        const data = item.seat
          ? {
              ...item,
              seat: item.seat.split(","),
            }
          : item;
        return data;
      });
      return helperWrapper.response(
        res,
        200,
        "Success get data by id",
        newResult
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  postBooking: async (req, res) => {
    try {
      const {
        userId,
        scheduleId,
        movieId,
        dateBooking,
        timeBooking,
        totalPayment,
        paymentMethod,
        statusPayment,
        seat,
      } = req.body;
      const setData = {
        userId,
        scheduleId,
        movieId,
        dateBooking,
        timeBooking,
        totalTicket: seat.length,
        totalPayment,
        paymentMethod,
        statusPayment,
      };
      const result = await bookingModel.postBooking(setData);
      return helperWrapper.response(res, 200, "Success create data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
};
