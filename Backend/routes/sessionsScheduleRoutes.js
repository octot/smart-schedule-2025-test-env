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
  saveScheduleToDB,
  getScheduleToDB,
  updateScheduleToDB
} = require("../controllers/sessionsScheduleController");
router.post("/api/schedules/saveScheduleToDB", saveScheduleToDB);
router.post("/api/schedules/updateScheduleToDB", updateScheduleToDB);
router.get("/api/getScheduleToDB", getScheduleToDB);
router.post("/api/schedules", createSchedule);
router.post("/api/schedules/send-whatsapp", sendScheduleViaWhatsApp);
router.get("/api/getSettings", getSettings);
router.get("/api/schedules", getAllSchedules);
router.get("/api/schedules/:id", getScheduleById);
router.put("/api/schedules/:id", updateSchedule);
router.put("/api/updateSettings", updateSettings);
router.delete("/api/schedules/:id", deleteSchedule);
module.exports = router;
