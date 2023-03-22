const express = require("express");

const contactsController = require("../../controllers/contactsController");
const { updateStatusSchema } = require("../../schemas/contacts");
const auth = require("../../middleware/auth");
const validateBody = require("../../middleware/validateData");

const router = express.Router();

router.get("/", auth, contactsController.getContacts);

router.get("/:contactId", auth, contactsController.getById);

router.post("/", auth, contactsController.addContact);

router.put("/:contactId", auth, contactsController.updateById);

router.patch(
  "/:contactId/favorite",
  validateBody(updateStatusSchema),
  auth,
  contactsController.updateStatusContact
);

router.delete("/:contactId", auth, contactsController.removeById);

module.exports = router;
