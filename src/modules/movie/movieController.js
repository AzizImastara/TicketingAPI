/* eslint-disable no-console */
const movieModel = require("./movieModel");
const helperWrapper = require("../../helpers/wrapper");

module.exports = {
  getAllMovie: async (request, response) => {
    try {
      let { page, limit } = request.query;
      page = Number(page);
      limit = Number(limit);
      // OFFSET ?
      // TAMBAHKAN OFFSET PEMBERIAN NILAI DEFAULT VALUE
      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie();
      const totalPage = Math.ceil(totalData / limit);
      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getAllMovie(limit, offset);
      // response.status(200).send(result);
      return helperWrapper.response(
        response,
        200,
        "Success get data",
        result,
        pageInfo
      );
    } catch (error) {
      // response.status(400).send(error.message);
      return helperWrapper.response(
        response,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  getMovieByid: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await movieModel.getMovieByid(id);
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
  postMovie: async (req, res) => {
    try {
      const { name, category, releaseDate, synopsis } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        synopsis,
      };
      const result = await movieModel.postMovie(setData);
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
  updateMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieByid(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const { name, category, releaseDate, synopsis } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        synopsis,
        updateAt: new Date(Date.now()),
      };

      const result = await movieModel.updateMovie(setData, id);
      return helperWrapper.response(res, 200, "Success update data", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await movieModel.getMovieByid(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found !`,
          null
        );
      }
      // Proses delete
      // return res.status(200).json({
      //   status: true,
      //   message: "Delete Data Success",
      // });
      const result = await movieModel.deleteMovie(id);
      return helperWrapper.response(res, 200, "Success update data", result);
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
