const axios = require("axios");
let schedules = [];
async function fetchSchedules() {
  try {
    const response = await axios.get("http://localhost:5000/api/schedules");
    schedules = response.data;
  } catch (error) {
    console.error("Failed to fetch schedules:", error.message);
  }
}
async function initializefetchSchedules() {
  await fetchSchedules();
  return { schedules };
}

module.exports = { initializefetchSchedules, schedules };
