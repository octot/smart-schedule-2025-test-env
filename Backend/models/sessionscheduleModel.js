const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  tuitionId: {
    type: String,
    required: true,
    trim: true,
  },
  tutorName: {
    type: String,
    trim: true,
  },
  automate: {
    type: Boolean,
    default: false,
  },
  totalDays: {
    type: [
      {
        day: {
          type: String, // e.g., "Monday"
        },
        sessionStartTime: {
          type: String, // e.g., "09:00 AM"
        },
        sessionEndTime: {
          type: String, // e.g., "10:00 AM"
        },
      },
    ],
    default: [], // Default to an empty array
  },
  commonSession: {
    sessionStartTime: {
      type: String, // e.g., "09:00 AM"
    },
    sessionEndTime: {
      type: String, // e.g., "10:00 AM"
    },
  },
  sessionDate: {
    type: String, // Use ISO date format as a string
  },
  useCommonSession: {
    type: Boolean, 
    default: false,
  },
  selectedDays: {
    type: mongoose.Schema.Types.Mixed, // JSON object type
    default: {}, // Default to an empty object
  },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
