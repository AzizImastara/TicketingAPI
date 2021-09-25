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
      return helperWrapper.response(res, 200, "Success get data by id", result);
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
      const { idUser } = req.params;
      const result = await bookingModel.getBookingByIdUser(idUser);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${idUser} not found`,
          null
        );
      }
      return helperWrapper.response(
        res,
        200,
        "Success get data by idUser",
        result
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
      const { id } = req.params;
      const result = await bookingModel.getSeatBooking(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by ${id} not found`,
          null
        );
      }
      return helperWrapper.response(res, 200, "Success get data by id", result);
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
