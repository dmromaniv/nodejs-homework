const multer = require("multer");
const path = require("path");

const storagePath = path.join(__dirname, "../temp");

const multerConfig = multer.diskStorage({
  destination: storagePath,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadAvatar = multer({
  storage: multerConfig,
});

module.exports = uploadAvatar;
