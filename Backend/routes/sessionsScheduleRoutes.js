const express = require("express");
const router = express.Router();

// Controller functions (to be implemented separately)
const {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  sendScheduleViaWhatsApp
} = require("../controllers/sessionsScheduleController");

// Create a new schedule
router.post("/api/schedules", createSchedule);
router.post("/api/schedules/send-whatsapp", sendScheduleViaWhatsApp);

// Get all schedules
router.get("/api/schedules", getAllSchedules);

// Get a specific schedule by ID
router.get("/api/schedules/:id", getScheduleById);

// Update a specific schedule by ID
router.put("/api/schedules/:id", updateSchedule);

// Delete a specific schedule by ID
router.delete("/api/schedules/:id", deleteSchedule);

module.exports = router;
