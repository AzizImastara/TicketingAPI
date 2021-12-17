const scheduleModel = require("./scheduleModel");
const helperWrapper = require("../../helpers/wrapper");
const redis = require("../../config/redis");

module.exports = {
  getAllSchedule: async (req, res) => {
    try {
      const searchBy = !req.query.searchBy ? "movieId" : req.query.searchBy;
      const search = !req.query.search ? "" : req.query.search;
      const sort = !req.query.sort ? "DESC" : req.query.sort;
      const dblimit = !req.query.dblimit ? "10" : Number(req.query.dblimit);
      const page = !req.query.page ? "1" : Number(req.query.page);
      const dateStart = !req.query.dateStart ? "" : req.query.dateStart;
      const dateEnd = !req.query.dateEnd ? "" : req.query.dateEnd;
      const offset = page === 1 ? "0" : (page - 1) * dblimit;
      const totalData = await scheduleModel.getCountSchedule(
        search,
        dateStart,
        dateEnd
      );
      const totalPage = Math.ceil(totalData / dblimit);
      const pageInfo = {
        page,
        totalPage,
        dblimit,
        totalData,
      };
      const result = await scheduleModel.getAllSchedule(
        searchBy,
        search,
        sort,
        dblimit,
        offset,
        dateStart,
        dateEnd
      );
      console.log(result.length);
      // proses  time
      const newResult = result.map((item) => {
        const data = {
          ...item,
          time: item.time.split(","),
        };
        return data;
      });
      redis.setex(
        `getSchedule:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify({ newResult, pageInfo })
      );

      return helperWrapper.response(
        res,
        200,
        "Success get data",
        newResult,
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
  getScheduleByid: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await scheduleModel.getScheduleByid(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      redis.setex(`getSchedule:${id}`, 3600, JSON.stringify(result));
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
  postSchedule: async (req, res) => {
    try {
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        req.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
      };
      const result = await scheduleModel.postSchedule(setData);
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
  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await scheduleModel.getScheduleByid(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      // const { movieId, premiere, price, location, dateStart, dateEnd } =
      //   req.body;
      // const setData = {
      //   movieId,
      //   premiere,
      //   price,
      //   location,
      //   dateStart,
      //   dateEnd,
      //   updateAt: new Date(Date.now()),
      // };

      const updateData = await scheduleModel.updateSchedule(
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
        404,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await scheduleModel.getScheduleByid(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const result = await scheduleModel.deleteSchedule(id);
      return helperWrapper.response(res, 200, "Success delete data", result);
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
