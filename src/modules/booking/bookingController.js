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
          `Data by id ${id} not found !`,
          null
        );
      }

      const newResult = [{ ...result[0], seat: [] }];

      result.forEach((item) => {
        newResult[0].seat.push(item.seat);
      });

      return helperWrapper.response(
        res,
        200,
        `Success get data by id`,
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
          `Data by id ${userId} not found !`,
          null
        );
      }

      const newResult = [{ ...result[0], seat: [] }];

      result.forEach((item) => {
        newResult[0].seat.push(item.seat);
      });

      return helperWrapper.response(
        res,
        200,
        `Success get data by id`,
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
  getDashboard: async (req, res) => {
    const movieId = !req.query.movieId ? "" : req.query.movieId;
    const location = !req.query.location ? "" : req.query.location;
    const premiere = !req.query.premiere ? "" : req.query.premiere;
    try {
      const result = await bookingModel.getDashboard(
        Number(movieId),
        location,
        premiere
      );
      return helperWrapper.response(res, 200, "Success get dashboard", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  getQR: async (req, res) => {
    try {
      const { id } = req.params;
      const data = { statusUse: "notActive" };
      const result = await bookingModel.getQR(data, Number(id));
      if (result.length < 1) {
        return helperWrapper.response(res, 404, `Data QR not found `, null);
      }
      return helperWrapper.response(res, 200, "Success get QR", result);
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
      const { id } = result;
      seat.map(async (item) => {
        const data = {
          bookingId: id,
          movieId,
          scheduleId,
          dateBooking,
          timeBooking,
          seat: item,
        };
        await bookingModel.postSeatBooking(data);
      });
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
