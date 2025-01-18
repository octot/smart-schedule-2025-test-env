import axios from "axios";
// Example schedule data
const schedules = [
  {
    useCommonSession: false,
    _id: "6778c438a88a3ddeb126029c",
    tuitionId: "111",
    tutorName: "Tutor 111",
    automate: true,
    totalDays: [
      {
        day: "sun",
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

// Configurable time (change this to set a custom time)
const configuredTime = "15:15"; // Example: 3:15 PM

// Helper function to calculate the next trigger time
function calculateTriggerTime(day, time) {
  const now = new Date();
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const targetDayIndex = daysOfWeek.indexOf(day);
  const currentDayIndex = now.getDay();
  const daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
  const triggerDate = new Date(now);
  triggerDate.setDate(now.getDate() + daysUntilTarget);

  // Set the configured time
  const [hours, minutes] = time.split(":").map(Number);
  triggerDate.setHours(hours, minutes, 0, 0);

  return triggerDate;
}

// Function to send the message to the API
async function sendMessageToAPI(message) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/schedules/send-whatsapp",
      message
    );
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

// Schedule messages
function scheduleMessages(schedule) {
  if (!schedule.automate) return;
  schedule.totalDays.forEach(({ day }) => {
    const triggerTime = calculateTriggerTime(day, configuredTime);
    const delay = triggerTime - new Date();

    if (delay > 0) {
      console.log(`Message for ${day} will trigger at ${triggerTime}`);

      setTimeout(() => {
        const message = {
          tuitionId: schedule.tuitionId,
          tutorName: schedule.tutorName,
          day: day,
          sessionStartTime: configuredTime,
          sessionDate: schedule.sessionDate,
        };  

        console.log(`Sending message for ${day} at ${new Date()}`);
        sendMessageToAPI(message);
      }, delay);
    }
  });
}

// Process all schedules
schedules.forEach(scheduleMessages);
