const RequestError = require("../helpers/RequestError");
const Contact = require("../models/contact");

const getContacts = async (req, res, next) => {
  try {
    const result = await Contact.find();
    if (!result) {
      throw RequestError(404, "Not Found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw RequestError(404, "Not Found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contactData = req.body;
    if (!contactData) {
      throw RequestError(400, "Bad request");
    }
    const result = await Contact.create(contactData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(
      contactId,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!result) {
      throw RequestError(404, "Not found");
    }
    res.json({ result, message: "Contact was updated" });
  } catch (error) {
    next(error);
  }
};

const removeById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw RequestError(404, "Not Found");
    }
    res.json({ result, message: "contact was removed" });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const status = req.body;

    if (Object.keys(status).length === 0) {
      throw RequestError(400, "missing field favorite");
    }

    const result = await Contact.findByIdAndUpdate(
      contactId,
      { favorite: status.favorite },
      { new: true }
    );

    if (!result) {
      throw RequestError(404, "Not Found");
    }
    res.json({ result, message: "Contact status was updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getById,
  addContact,
  updateById,
  removeById,
  updateStatusContact,
};
