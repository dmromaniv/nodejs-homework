const RequestError = require("../helpers/RequestError");

const validateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw RequestError(400, error.message);
    }
    next();
  };

  return func;
};

module.exports = validateBody;
