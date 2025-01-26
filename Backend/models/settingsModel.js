const mongoose = require("mongoose");

const automaticTimeSettingsSchema = new mongoose.Schema({
  scheduleTimeSet: {
    type: String,
  },
  scheduleYN: {
    type: Boolean,
  },
});
const AutomaticTimeSettings = mongoose.model(
  "settings",
  automaticTimeSettingsSchema
);

module.exports = AutomaticTimeSettings;
