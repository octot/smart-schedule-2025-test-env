const axios = require("axios");
const schedule = require("node-schedule");
let activeJobs = [];
const { initializeSettings } = require("../settings/settings.js");
const {
  saveScheduleToDB,
} = require("../controllers/sessionsScheduleController");
let globalTime;
let globalSchedule = true;
const schedules = [
  {
    useCommonSession: false,
    _id: "6778c438a88a3ddeb126029c",
    tuitionId: "659",
    tutorName: "Tutor 311",
    automate: true,
    totalDays: [
      {
        day: "sun",
        sessionStartTime: "10:00",
        sessionEndTime: "11:00",
        _id: "67821496db7bac6e98a80f01",
      },
      {
        day: "mon",
        sessionStartTime: "12:20",
        sessionEndTime: "22:21",
        _id: "67821496db7bac6e98a80f02",
      },
      {
        day: "tue",
        sessionStartTime: "14:00",
        sessionEndTime: "15:30",
        _id: "67821496db7bac6e98a80f03",
      },
      {
        day: "wed",
        sessionStartTime: "16:00",
        sessionEndTime: "17:30",
        _id: "67821496db7bac6e98a80f04",
      },
      {
        day: "thu",
        sessionStartTime: "18:00",
        sessionEndTime: "19:00",
        _id: "67821496db7bac6e98a80f05",
      },
      {
        day: "fri",
        sessionStartTime: "12:20",
        sessionEndTime: "12:21",
        _id: "67821496db7bac6e98a80f06",
      },
      {
        day: "sat",
        sessionStartTime: "08:00",
        sessionEndTime: "09:30",
        _id: "67821496db7bac6e98a80f07",
      },
    ],
    sessionDate: "2025-01-04",
    __v: 0,
  },
];
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
      activeJobs.push(job);
    });
  });
}
function cancelJobs() {
  activeJobs.forEach((job) => job.cancel());
  activeJobs = [];
}
function updateScheduler() {
  if (globalSchedule) {
    scheduleMessages();
  } else {
    cancelJobs();
  }
}
setTimeout(() => {
  updateScheduler();
}, 1000);
initializeSettings()
  .then(({ configuredTime, configuredScheduleYN }) => {
    globalTime = configuredTime;
    globalSchedule = configuredScheduleYN;
  })
  .catch((error) => {
    console.error("Failed to initialize settings:", error.message);
  });

module.exports = {
  scheduleMessages,
};
