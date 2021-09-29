const connection = require("../../config/mysql");

module.exports = {
  getAllSchedule: (searchBy, search, sort, limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM Schedule WHERE ${searchBy} LIKE '%${search}%' ORDER BY price ${sort} LIMIT ${offset}, ${limit}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),

  getCountSchedule: (search) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM Schedule WHERE movieId LIKE '%${search}%'`,
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getScheduleByid: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM Schedule WHERE id = ?",
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
  postSchedule: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO Schedule SET ?",
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
      // eslint-disable-next-line no-console
      console.log(query.sql);
    }),
  updateSchedule: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE Schedule SET ? WHERE id = ?",
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
  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM Schedule WHERE id = ?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(`SQL : ${error.sqlMessage}`));
        }
      });
    }),
};
