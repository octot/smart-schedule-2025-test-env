
require("dotenv").config();
module.exports = {
  accountSid: process.env.REACT_APP_TWILIO_ACCOUNT_SID,
  authToken: process.env.REACT_APP_TWILIO_AUTH_TOKEN,
  twilioNumber: process.env.REACT_APP_TWILIO_NUMBER,
  to: process.env.REACT_APP_TWILIO_TO,
};
