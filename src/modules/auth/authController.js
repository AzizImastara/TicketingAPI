const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const helperWrapper = require("../../helpers/wrapper");
const modelAuth = require("./authModel");
const redis = require("../../config/redis");
const sendMail = require("../../helpers/email");

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
      const setDataEmail = {
        to: email,
        subject: "Email verification!",
        template: "email-verification",
        data: {
          firstname: "Syahrul AZ",
        },
      };
      await sendMail(setDataEmail);
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
      if (checkUser[0].status === "nonActive") {
        return helperWrapper.response(res, 400, "account must be active", null);
      }
      // PROSES UTAMA MEMBUAT TOKEN MENGGUNAKAN JWT (data yang mau diubah, kata kunci , lama token bisa digunakan)
      const payload = checkUser[0];
      delete payload.password;
      let token;
      if (email === "admin@gmail.com") {
        token = jwt.sign(
          { ...payload, roles: "admin" },
          process.env.SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );
        // const refreshToken = jwt.sign({ ...payload }, process.env.SECRET_KEY, {
        //   expiresIn: "24h",
      } else {
        token = jwt.sign({ ...payload }, process.env.SECRET_KEY, {
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
  // refreshToken: async (req, res) => {
  //   try {
  //     // console.log(req.body);
  //     const { refreshToken } = req.body;
  //     // PROSES PENGECEKAN REFRESH TOKEN APAKAH BISA DIGUNAKAN ATAU TIDAK
  //     redis.get(`refreshToken:${refreshToken}`, (error, result) => {
  //       if (!error && result !== null) {
  //         return helperWrapper.response(
  //           res,
  //           403,
  //           "Your refresh token cannot be use"
  //         );
  //       }
  //       jwt.verify(refreshToken, process.env.SECRET_KEY, (error, result) => {
  //         if (error) {
  //           return helperWrapper.response(res, 403, error.message);
  //         }
  //         delete result.iat;
  //         delete result.exp;
  //         const token = jwt.sign(result, process.env.SECRET_KEY, {
  //           expiresIn: "1h",
  //         });
  //         const newRefreshToken = jwt.sign(result, process.env.SECRET_KEY, {
  //           expiresIn: "24h",
  //         });
  //         redis.setex(`refreshToken:${refreshToken}`, 3600 * 24, refreshToken);
  //         return helperWrapper.response(res, 200, "Success Refresh Token !", {
  //           id: result.id,
  //           token,
  //           refreshToken: newRefreshToken,
  //         });
  //       });
  //     });
  //   } catch (error) {
  //     return helperWrapper.response(
  //       res,
  //       400,
  //       `Bad request (${error.message})`,
  //       null
  //     );
  //   }
  // },
};
