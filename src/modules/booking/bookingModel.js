const connection = require("../../config/mysql");

module.exports = {
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM Booking WHERE Booking.id = ${id}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getBookingByIdUser: (idUser) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM Booking WHERE Booking.userId = ${idUser} `,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  // getSeatBooking: (id) =>
  //   new Promise((resolve, reject) => {
  //     connection.query(
  //       `SELECT * FROM Booking WHERE `
  //     )
  //   })

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
};
