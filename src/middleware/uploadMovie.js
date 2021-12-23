const multer = require("multer");
const helperWrapper = require("../helpers/wrapper/index");

const storage = multer.diskStorage({
  destination(req, res, cb) {
    cb(null, `public/uploads/${req.query.type}`);
  },
  filename(req, file, cb) {
    console.log(file);
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${file.originalname}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter(req, file, callback) {
    if (file.originalname.match(/\.(jpg|jpeg|png)\b/)) {
      callback(null, true);
    } else {
      callback("File must be png/jpg/jpeg, max size 1mb", null);
    }
  },
}).single("image");

// single : untuk mengupload file tapi yang di upload cuman 1 file
// array : untuk mengupload file tapi yang di upload lebih dari 1 file
// field : untuk mengupload file lebih dari 1 field

const uploadFilter = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(
        res,
        401,
        err.message ? err.message : err,
        null
      );
    }
    if (err) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(
        res,
        401,
        err.message ? err.message : err,
        null
      );
    }

    // Everything went fine.
    next();
  });
};

module.exports = uploadFilter;
