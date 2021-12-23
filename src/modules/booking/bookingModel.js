const connection = require("../../config/mysql");

module.exports = {
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT movie.name, b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.totalTicket, b.totalPayment, bs.seat FROM booking AS b LEFT JOIN bookingSeat AS bs ON b.id = bs.bookingId JOIN movie ON b.movieId = movie.id WHERE b.id=${id}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),

  getBooking: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT seat FROM bookingSeat WHERE bookingId=?`,
        id,
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
      const query = connection.query(
        `SELECT movie.name, schedule.premiere, b.id, b.userId, b.dateBooking, b.timeBooking, b.movieId, b.scheduleId, b.totalTicket, b.totalPayment, b.statusUse, b.statusPayment FROM booking AS b JOIN movie ON b.movieId = movie.id JOIN schedule ON b.scheduleId = schedule.id WHERE b.userId=?`,
        userId,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
      console.log(query.sql);
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
      connection.query("INSERT INTO booking SET ?", data, (error, result) => {
        // console.log(error);
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
  getDashboard: (movieId, location, premiere) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTHNAME(booking.createdAt) AS month, SUM(totalPayment) AS total FROM booking LEFT JOIN schedule ON booking.movieId = schedule.movieId WHERE booking.movieId = ${movieId} AND schedule.location = "${location}" AND schedule.premiere = "${premiere}" AND YEAR(booking.createdAt) = YEAR (NOW()) GROUP BY MONTH(booking.createdAt)`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getQR: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE booking SET ? WHERE id = ?`,
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
};
