const RequestError = require("../helpers/RequestError");
const Contact = require("../models/contact");

const getContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const result = await Contact.find({ owner });
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
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ _id: contactId, owner });
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
    const user = req.user;
    const contactData = req.body;
    if (!contactData) {
      throw RequestError(400, "Bad request");
    }
    const result = await Contact.create({ ...contactData, owner: user._id });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
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
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndRemove({ _id: contactId, owner });
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
    const { _id: owner } = req.user;

    if (Object.keys(status).length === 0) {
      throw RequestError(400, "missing field favorite");
    }

    const result = await Contact.findOneAndUpdate(
      { _id: contactId, owner },
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
