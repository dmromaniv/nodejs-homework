const express = require("express");

const usersController = require("../../controllers/usersController");
const {
  registerSchema,
  loginSchema,
  confirmSchema,
} = require("../../schemas/users");
const auth = require("../../middleware/auth");
const handleAvatar = require("../../middleware/handleAvatar");
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
router.patch(
  "/avatars",
  auth,
  handleAvatar.single("avatar"),
  usersController.updateAvatar
);
router.get("/verify/:verificationToken", usersController.confirmEmail);
router.post(
  "/verify",
  validateBody(confirmSchema),
  usersController.resendConfirmation
);

module.exports = router;
