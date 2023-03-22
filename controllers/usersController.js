const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RequestError = require("../helpers/RequestError");
const User = require("../models/user");

const { TOKEN_PASS } = process.env;

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw RequestError(409, `Email in use`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({ email, password: hashedPassword });

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

module.exports = {
  register,
  login,
  logout,
  getCurrent,
};
