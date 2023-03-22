const express = require("express");

const usersController = require("../../controllers/usersController");
const { registerSchema, loginSchema } = require("../../schemas/users");
const auth = require("../../middleware/auth");
const validateBody = require("../../middleware/validateData");

const router = express.Router();

router.post(
  "/register",
  validateBody(registerSchema),
  usersController.register
);
router.post("/login", validateBody(loginSchema), usersController.login);
router.post("/logout", auth, usersController.logout);
router.post("/current", auth, usersController.getCurrent);

module.exports = router;
