const sendGrid = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_KEY, EMAIL } = process.env;

sendGrid.setApiKey(SENDGRID_KEY);

const sendConfirmEmail = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const mail = { ...data, from: EMAIL };
    await sendGrid.send(mail);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendConfirmEmail;
