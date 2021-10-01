const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const helperWrapper = require("../../helpers/wrapper");
const modelAuth = require("./authModel");
const redis = require("../../config/redis");
const authModel = require("./authModel");

module.exports = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      // PROSES PENGECEKAN EMAIL SUDAH PERNAH TERDAFTAR ATAU BELUM DIDATABASE
      // ENCRYPT PASSWORD
      const findEmail = await modelAuth.getUserByEmail(email);
      if (findEmail.length > 0) {
        return helperWrapper.response(res, 403, "Email already used");
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const setData = {
        id: uuidv4(),
        firstName,
        lastName,
        roles: "custommer",
        email,
        password: hash,
      };

      const result = await modelAuth.register(setData);
      return helperWrapper.response(res, 200, "Success register user", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await modelAuth.getUserByEmail(email);

      if (checkUser.length < 1) {
        return helperWrapper.response(res, 404, "Email not registered", null);
      }
      const comparePw = await bcrypt.compare(password, checkUser[0].password);

      if (!comparePw) {
        return helperWrapper.response(res, 400, "Wrong password", null);
      }
      // PROSES UTAMA MEMBUAT TOKEN MENGGUNAKAN JWT (data yang mau diubah, kata kunci , lama token bisa digunakan)
      const payload = checkUser[0];
      delete payload.password;
      let token;
      if (email === "admin@gmail.com") {
        token = jwt.sign({ ...payload, roles: "admin" }, "RAHASIA", {
          expiresIn: "24h",
        });
      } else {
        token = jwt.sign({ ...payload }, "RAHASIA", {
          expiresIn: "24h",
        });
      }
      return helperWrapper.response(res, 200, "Success login", {
        id: payload.id,
        token,
      });
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad request (${error.message})`,
        null
      );
    }
  },
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await authModel.getUserById(id);
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
        const result = await modelAuth.updatePassword(id, data);
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
      const checkId = await authModel.getUserById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const updateData = await authModel.updateProfile(
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
      const checkId = await authModel.getUserById(id);
      if (checkId.length < 1) {
        return helperWrapper.response(
          res,
          404,
          `Data by id ${id} not found`,
          null
        );
      }
      const updateData = await authModel.updateProfile(
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
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.split(" ")[1];
      redis.setex(`accessToken:${token}`, 3600 * 24, token);
      return helperWrapper.response(res, 200, "Success logout", null);
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
