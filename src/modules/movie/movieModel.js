const connection = require("../../config/mysql");

module.exports = {
  getAllMovie: (seacrh, sort, limit, offset) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM Movie WHERE name LIKE '%${seacrh}%' ORDER BY name, releaseDate ${sort} LIMIT ${offset}, ${limit}`,
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
        "SELECT * FROM Movie WHERE id = ?",
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
  getCountMovie: () =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(*) AS total FROM Movie",
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
      const query = connection.query(
        "INSERT INTO Movie SET ?",
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
  updateMovie: (data, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE Movie SET ? WHERE id = ?",
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
      connection.query("DELETE FROM Movie WHERE id = ?", id, (error) => {
        if (!error) {
          resolve(id);
        } else {
          reject(new Error(`SQL : ${error.sqlMessage}`));
        }
      });
    }),
};
