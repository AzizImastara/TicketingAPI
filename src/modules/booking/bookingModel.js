const connection = require("../../config/mysql");

module.exports = {
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.totalTicket, b.totalPayment, bs.seat FROM Booking AS b LEFT JOIN bookingSeat AS bs ON b.id = bs.bookingId WHERE b.id=${id}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getBookingByIdUser: (userId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.totalTicket, b.totalPayment, bs.seat FROM Booking AS b LEFT JOIN bookingSeat AS bs ON b.id = bs.bookingId WHERE b.userId=${userId}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getSeatBooking: (movieId, scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT bs.id, bs.seat FROM bookingSeat AS bs WHERE bs.movieId = ${movieId} && bs.scheduleId = ${scheduleId} && bs.dateBooking = '${dateBooking}' && bs.timeBooking = '${timeBooking}'`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),

  postBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO Booking SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(`SQL : ${error.sqlMessage}`));
        }
      });
    }),
  postSeatBooking: (data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO bookingSeat SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getDashboard: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTH(createdAt) AS month, SUM(totalPayment) AS total FROM Booking WHERE YEAR(createdAt) = YEAR(NOW()) GROUP BY MONTH(createdAt)`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
};
