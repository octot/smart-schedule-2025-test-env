const axios = require("axios");
const schedule = require("node-schedule");
let activeJobs = [];
const { initializeSettings } = require("../settings/settings.js");
const {
  saveScheduleToDB,
} = require("../controllers/sessionsScheduleController");
let globalTime;
let globalSchedule = true;
let schedules = [];
const { initializefetchSchedules } = require("../schedule/getAllSchedules.js");
function calculateNextTriggerTime(day, time) {
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayIndex = daysOfWeek.indexOf(day.toLowerCase());
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const todayIndex = now.getDay();
  const nextDate = new Date(now);
  nextDate.setHours(hours, minutes, 0, 0);
  if (dayIndex === todayIndex) {
    if (nextDate > now) {
      return nextDate;
    } else {
      nextDate.setDate(nextDate.getDate() + 7);
      return nextDate;
    }
  } else {
    const daysUntilNext = (7 + dayIndex - todayIndex) % 7 || 7;
    nextDate.setDate(nextDate.getDate() + daysUntilNext);
    return nextDate;
  }
}
function scheduleMessages() {
  if (!globalTime) {
    console.error("Global time is not defined. Cannot schedule messages.");
    return;
  }
  if (!globalSchedule) {
    return;
  }
  schedules.forEach((scheduleItem) => {
    if (!scheduleItem.automate) return;
    console.log("Schedule Manager schedules", scheduleItem);
    scheduleItem.totalDays.forEach((eachDay) => {
      const { day } = eachDay;
      const nextTriggerTime = calculateNextTriggerTime(day, globalTime);
      saveScheduleToDB(
        scheduleItem.tuitionId,
        nextTriggerTime,
        scheduleItem.sessionDate,
        scheduleItem.tutorName,
        eachDay.sessionStartTime,
        eachDay.sessionEndTime
      );
      console.log(
        "Next trigger time:",
        scheduleItem.tuitionId,
        nextTriggerTime
      );
      const job = schedule.scheduleJob(nextTriggerTime, async () => {
        try {
          const scheduleMessage = `
          Greetings from Smartpoint 😇
          Today your class is scheduled for:
          Tuition ID : ${scheduleItem.tuitionId}
          Session Date : ${scheduleItem.sessionDate}
          Tutor Name : ${scheduleItem.tutorName}
          Time of Session: ${eachDay.sessionStartTime} - ${eachDay.sessionEndTime} 
          
        `;
          await axios.post( 
            "http://localhost:5000/api/schedules/send-whatsapp",
            {
              message: scheduleMessage,
            }
          );
        } catch (error) {
          console.error(`Failed to send message for ${day}:`, error.message);
        }
      });
      if (!activeJobs.includes(job)) {
        activeJobs.push(job);
      }
    });
  });
}
function cancelJobs() {
  activeJobs.forEach((job) => {
    if (job) job.cancel();
  });
  activeJobs.length = 0;
}
function updateScheduler() {
  if (globalSchedule) {
    scheduleMessages();
  } else {
    cancelJobs();
  }
}
initializeSettings()
  .then(({ configuredTime, configuredScheduleYN }) => {
    globalTime = configuredTime;
    globalSchedule = configuredScheduleYN;
    updateScheduler();
    console.log("Schedule Manager globalTime", globalTime);
  })
  .catch((error) => {
    console.error("Failed to initialize settings:", error.message);
  });
initializefetchSchedules()
  .then((data) => {
    schedules = data.schedules; // Correct way to update the global variable
  })
  .catch((error) => {
    console.error("Failed to initialize settings:", error.message);
  });

module.exports = {
  scheduleMessages,
};
