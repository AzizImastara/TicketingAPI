const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const helperWrapper = require("../../helpers/wrapper");
const modelAuth = require("./authModel");
const redis = require("../../config/redis");

module.exports = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body;
      // PROSES PENGECEKAN EMAIL SUDAH PERNAH TERDAFTAR ATAU BELUM DIDATABASE

      // ENCRYPT PASSWORD

      const setData = {
        id: uuidv4(),
        email,
        password,
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

      if (password !== checkUser[0].password) {
        return helperWrapper.response(res, 400, "Wrong password", null);
      }

      // PROSES UTAMA MEMBUAT TOKEN MENGGUNAKAN JWT (data yang mau diubah, kata kunci , lama token bisa digunakan)
      const payload = checkUser[0];
      delete payload.password;
      const token = jwt.sign({ ...payload }, "RAHASIA", {
        expiresIn: "24h",
      });
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
