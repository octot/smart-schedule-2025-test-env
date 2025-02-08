require("dotenv").config();
const { accountSid, authToken, twilioNumber, to } = require("../config");
const twilio = require("twilio");
const Schedule = require("../models/sessionscheduleModel");
const settingsModel = require("../models/settingsModel");
const ScheduleDetailsModel = require("../models/scheduleDetailsModel");
const moment = require("moment");
const createSchedule = async (req, res) => {
  try {
    const { tuitionId, tutorName, automate, totalDays, sessionDate } = req.body;
    const newSchedule = new Schedule({
      tuitionId,
      tutorName,
      automate,
      totalDays,
      sessionDate,
    });
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateSchedule = async (req, res) => {
  try {
    const { tuitionId, tutorName, automate, totalDays, sessionDate } = req.body;

    // Find the schedule by ID and update
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { tuitionId, tutorName, automate, totalDays, sessionDate },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteSchedule = async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }
    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const sendScheduleViaWhatsApp = async (req, res) => {
  try {
    const { message } = req.body;
    const client = twilio(accountSid, authToken);
    client.messages
      .create({
        body: message,
        from: `whatsapp:${twilioNumber}`,
        to: `whatsapp:${to}`,
      })
      .then((message) => {
        console.log(`Message sent with SID: ${message.sid}`);
        res.status(200).json({
          success: true,
          message: `Message sent with SID: ${message.sid}`,
        });
      })
      .catch((error) => {
        console.log(`Error sending message: ${error.message}`);
        res.status(500).json({
          success: false,
          message: `Error sending message: ${error.message}`,
        });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getSettings = async (req, res) => {
  try {
    const settings = await settingsModel.find();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateSettings = async (req, res) => {
  try {
    const { scheduleYN, scheduleTimeSet } = req.body;
    console.log(scheduleYN, scheduleTimeSet);
    const updatedSettings = await settingsModel.findOneAndUpdate(
      {},
      { scheduleYN, scheduleTimeSet },
      { new: true, runValidators: true, upsert: true } // Return the updated document, create if not exists
    );

    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
let recordSelected;
async function saveScheduleToDB(
  tuitionId,
  triggerDate,
  sessionDate,
  tutorName,
  sessionStartTime,
  sessionEndTime
) {
  try {
    const existingEntry = await ScheduleDetailsModel.findOne({
      tuitionId,
      triggerDate,
    });
    if (existingEntry) {
      console.log("Entry already exists:", existingEntry);
    } else {
      const newSchedule = new ScheduleDetailsModel({
        tuitionId,
        triggerDate,
        sessionDate,
        tutorName,
        sessionStartTime,
        sessionEndTime,
        recordSelected,
      });
      await newSchedule.save();
      console.log("New schedule saved:", newSchedule);
    }
  } catch (error) {
    console.error("Error saving schedule:", error);
  }
}
const getScheduleToDB = async (req, res) => {
  try {
    const schedules = await ScheduleDetailsModel.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateScheduleToDB = async (req, res) => {
  try {
    const updates = req.body; // Expecting an array of JSON objects
    const updatePromises = updates.map(async (update) => {
      const {
        tuitionId,
        triggerDate,
        sessionDate,
        tutorName,
        sessionStartTime,
        sessionEndTime,
        recordSelected,
      } = update;
      return ScheduleDetailsModel.findOneAndUpdate(
        { tuitionId, triggerDate },
        {
          sessionDate,
          tutorName,
          sessionStartTime,
          sessionEndTime,
          recordSelected,
        },
        { new: true, runValidators: true }
      );
    });

    const updatedSchedules = await Promise.all(updatePromises);

    res.status(200).json(updatedSchedules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
async function cleanupExpiredTriggerTimes() {
  try {
    const currentTime = moment().toDate();
    const result = await ScheduleDetailsModel.deleteMany({
      triggerDate: { $lt: currentTime },
    });
    console.log(`Deleted ${result.deletedCount} expired trigger times.`);
  } catch (error) {
    console.error("Error cleaning up expired trigger times:", error);
  }
}
setInterval(cleanupExpiredTriggerTimes, 60 * 100000); // 1 minute interval
module.exports = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  sendScheduleViaWhatsApp,
  getSettings,
  updateSettings,
  saveScheduleToDB,
  getScheduleToDB,
  updateScheduleToDB,
};
