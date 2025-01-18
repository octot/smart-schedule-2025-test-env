const axios = require("axios");
const schedule = require("node-schedule"); // For scheduling tasks
const schedules = [
  {
    useCommonSession: false,
    _id: "6778c438a88a3ddeb126029c",
    tuitionId: "111",
    tutorName: "Tutor 111",
    automate: true,
    totalDays: [
      {
        day: "sat",
        sessionStartTime: "12:20",
        sessionEndTime: "12:21",
        _id: "67821496db7bac6e98a80fb4",
      },
      {
        day: "wed",
        sessionStartTime: "12:20",
        sessionEndTime: "12:21",
        _id: "67821496db7bac6e98a80fb7",
      },
      {
        day: "sat",
        sessionStartTime: "12:20",
        sessionEndTime: "12:21",
        _id: "67821496db7bac6e98a80fba",
      },
    ],
    sessionDate: "2025-01-04",
    __v: 0,
  },
];
const configuredTime = "19:52"; // 12:20 PM
// Helper to calculate the next trigger time for a given day and time
function calculateNextTriggerTime(day, time) {
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayIndex = daysOfWeek.indexOf(day.toLowerCase());
  const [hours, minutes] = time.split(":").map(Number);
  //   const now = new Date();
  const now = new Date("2025-01-11T19:45:00"); // Setting today's date and time for testing
  const nextDate = new Date(now);
  nextDate.setHours(hours, minutes, 0, 0);
  // nextDate.setDate(now.getDate() + ((7 + dayIndex - now.getDay()) % 7 || 7));
  // if (nextDate < now) nextDate.setDate(nextDate.getDate() + 7);
  console.log(`Next trigger time for ${day}: ${nextDate}`);
  return nextDate;
}
function scheduleMessages() {
  schedules.forEach((scheduleItem) => {
    if (!scheduleItem.automate) return;
    scheduleItem.totalDays.forEach((eachDay) => {
      const { day } = eachDay;
      const nextTriggerTime = calculateNextTriggerTime(day, configuredTime);
      console.log(`Next trigger time for ${day}: ${nextTriggerTime}`);
      schedule.scheduleJob(nextTriggerTime, async () => {
        try {
          console.log(`Sending message for ${day} at ${configuredTime}`);
          const scheduleMessage = `
          Greetings from Smartpoint 😇
          Today your class is scheduled for
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
          console.log(`Message sent successfully for ${day}`);
        } catch (error) {
          console.error(`Failed to send message for ${day}:`, error.message);
        }
      });
      console.log(`Scheduled message for ${day} at ${configuredTime}`);
    });
  });
}
module.exports = scheduleMessages;
