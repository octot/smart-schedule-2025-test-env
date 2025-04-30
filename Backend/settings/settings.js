// settings.js
const axios = require("axios");

let configuredTime = "09:00"; // Default value
let configuredScheduleYN = true; // Default value

async function getSettingsData() {
  try {
    const response = await axios.get("http://localhost:5000/api/getSettings");
    const settingsArray = response.data; // Assuming this is an array
    if (Array.isArray(settingsArray) && settingsArray.length > 0) {
      if (
        settingsArray[0]?.scheduleTimeSet &&
        settingsArray[0]?.scheduleYN !== undefined
      ) {
        configuredTime = settingsArray[0]?.scheduleTimeSet;
        configuredScheduleYN = settingsArray[0]?.scheduleYN;
      }
    } else {
      console.error("No settings data found");
    }
  } catch (error) {
    console.error("Error fetching settings data:", error);
  }
}

async function initializeSettings() {
  await getSettingsData();
  return { configuredTime, configuredScheduleYN };
}

module.exports = { initializeSettings, configuredTime, configuredScheduleYN };
