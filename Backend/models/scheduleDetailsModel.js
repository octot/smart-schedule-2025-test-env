const mongoose = require("mongoose");
const ScheduleSchema = new mongoose.Schema({
  tuitionId: { type: String },
  triggerDate: { type: String },
  createdAt: { type: Date, default: Date.now },
  sessionDate: { type: String },
  tutorName: { type: String },
  sessionStartTime: { type: String },
  sessionEndTime: { type: String },
  recordSelected: { type: Boolean,default:false },
});

module.exports = mongoose.model("ScheduleDetails", ScheduleSchema);
