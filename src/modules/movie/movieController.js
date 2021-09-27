/* eslint-disable no-console */
const movieModel = require("./movieModel");
const helperWrapper = require("../../helpers/wrapper");

module.exports = {
  getAllMovie: async (req, res) => {
    const search = !req.query.search ? "" : req.query.search;
    const sort = !req.query.sort ? "DESC" : req.query.sort;
    const page = !req.query.page ? "1" : Number(req.query.page);
    const limit = !req.query.limit ? "10" : Number(req.query.limit);
    const offset = page === 1 ? "0" : (page - 1) * limit;
    const totalData = await movieModel.getCountMovie();
    const totalPage = Math.ceil(totalData / limit);
    const pageInfo = {
      page,
      totalPage,
      limit,
      totalData,
    };

    try {
      const result = await movieModel.getAllMovie(search, sort, limit, offset);
      return helperWrapper.response(
        res,
        200,
        "Success get data",
        result,
        pageInfo
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
      const {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
        synopsis,
      } = req.body;
      const setData = {
        name,
        category,
        releaseDate,
        cast,
        director,
        duration,
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
      const updateData = await movieModel.updateMovie(
        { ...req.body, updateAt: new Date(Date.now()) },
        id
      );
      return helperWrapper.response(
        res,
        200,
        "Success update data",
        updateData
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
