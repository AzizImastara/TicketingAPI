const bcrypt = require("bcryptjs");
const userModel = require("./userModel");
const helperWrapper = require("../../helpers/wrapper");
const deleteFile = require("../../helpers/uploads/deleteFile");

module.exports = {
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await userModel.getUserById(id);
      if (result.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      return helperWrapper.response(
        res,
        200,
        "Success get data by id user",
        result
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
  updatePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword, confirmPassword } = req.body;
      if (newPassword === confirmPassword) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(confirmPassword, salt);
        const data = { password: hash };
        const result = await userModel.updatePassword(id, data);
        if (result.affectedRows) {
          return helperWrapper.response(res, 200, "Success update password");
        }
        return helperWrapper.response(res, 200, "Nothing update");
      }
      return helperWrapper.response(res, 403, "Password not same");
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await userModel.getUserById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const updateData = await userModel.updateProfile(
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
  updateImage: async (req, res) => {
    try {
      const { id } = req.params;
      const checkId = await userModel.getUserById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      if (req.file.filename && checkId[0].image) {
        deleteFile(`public/uploads/movie/${checkId[0].image}`);
      }
      const updateData = await userModel.updateProfile(
        {
          ...req.body,
          image: req.file ? req.file.filename : null,
          updateAt: new Date(Date.now()),
        },
        id
      );
      return helperWrapper.response(
        res,
        200,
        "Success update image user",
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
  getActive: async (req, res) => {
    try {
      const { id } = req.params;
      const data = { status: "active" };
      const result = await userModel.updateProfile(data, id);
      if (result.length < 1) {
        return helperWrapper.response(res, 404, `Data user nor found`, null);
      }
      return helperWrapper.response(res, 200, "Success change status", result);
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
