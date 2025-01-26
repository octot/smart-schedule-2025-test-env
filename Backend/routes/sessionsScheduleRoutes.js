const express = require("express");
const router = express.Router();
const {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  sendScheduleViaWhatsApp,
  getSettings,
  updateSettings,
} = require("../controllers/sessionsScheduleController");

// Create a new schedule
router.post("/api/schedules", createSchedule);
router.post("/api/schedules/send-whatsapp", sendScheduleViaWhatsApp);
router.get("/api/getSettings", getSettings);
router.get("/api/schedules", getAllSchedules);
router.get("/api/schedules/:id", getScheduleById);
router.put("/api/schedules/:id", updateSchedule);
router.put("/api/updateSettings", updateSettings);
router.delete("/api/schedules/:id", deleteSchedule);
module.exports = router;
