const connection = require("../../config/mysql");

module.exports = {
  getAllMovie: (search, sort, limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM movie WHERE name LIKE '%${search}%' ORDER BY releaseDate ${sort}, name ${sort} LIMIT ${offset}, ${limit}`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  getMovieByid: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movie WHERE id = ?",
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
  getCountMovie: (search) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM movie WHERE name LIKE '%${search}%'`,
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(`SQL : ${error.sqlMessage}`));
          }
        }
      );
    }),
  postMovie: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO movie SET ?", data, (error, result) => {
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
  updateMovie: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE movie SET ? WHERE id = ?",
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
  deleteMovie: (id) =>
    new Promise((resolve, reject) => {
      connection.query("DELETE FROM movie WHERE id = ?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(`SQL : ${error.sqlMessage}`));
        }
      });
    }),
};
