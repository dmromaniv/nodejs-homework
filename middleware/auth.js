const jwt = require("jsonwebtoken");

const RequestError = require("../helpers/RequestError");
const User = require("../models/user");

const { TOKEN_PASS } = process.env;

const auth = async (req, _, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      throw RequestError(401, "Not authorized");
    }
    try {
      const { id } = jwt.verify(token, TOKEN_PASS);
      const user = await User.findById(id);
      // const isValidToken = token === user.token;

      if (!user || !user.token) {
        throw RequestError(401, "Not authorized");
      }
      req.user = user;
      next();
    } catch (error) {
      throw RequestError(401, "Not authorized");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
