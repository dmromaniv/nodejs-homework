const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const path = require("path");
const fs = require("fs").promises;
const RequestError = require("../helpers/RequestError");
const User = require("../models/user");

const { TOKEN_PASS } = process.env;
const avatarsStoragePath = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw RequestError(409, `Email in use`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, {
      s: "200",
    });

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: createdUser.email,
        subscription: createdUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isPasswordValid) {
      throw RequestError(401, `Email or password is wrong`);
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, TOKEN_PASS, { expiresIn: "2h" });
    const updatedUser = await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { email, subscription } = await User.findById(_id);
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempAvatarPath, originalname } = req.file;
    const { _id: userId } = req.user;

    const avatar = await Jimp.read(tempAvatarPath);
    avatar.resize(250, 250).write(tempAvatarPath);

    const extension = path.extname(originalname);
    const updatedAvatarName = `${userId}${extension}`;
    const updatedStoragePath = path.join(avatarsStoragePath, updatedAvatarName);
    await fs.rename(tempAvatarPath, updatedStoragePath);

    const updatedAvatarURL = path.join("avatars", updatedAvatarName);
    await User.findByIdAndUpdate(userId, { avatarURL: updatedAvatarURL });
    res.status(200).json({ avatarURL: updatedAvatarURL });
  } catch (error) {
    await fs.unlink(req.file.path);
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
};
