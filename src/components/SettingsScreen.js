import { useEffect, useState } from "react";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Container,
} from "@mui/material";
const Settings = () => {
  const [settings, setSettings] = useState({
    scheduleTimeSet: "",
    scheduleYN: false,
  });

  useEffect(() => {
    fetch("/api/getSettings")
      .then((res) => res.json())
      .then((data) => setSettings(data[0]))
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/updateSettings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleTimeSet: settings.scheduleTimeSet,
          scheduleYN: settings.scheduleYN,
        }),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      alert("Settings updated successfully");
    } catch (error) {
      alert("Failed to update settings");
      console.error("Error updating settings:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <TextField
        label="Schedule Time"
        type="time"
        name="scheduleTimeSet"
        value={settings.scheduleTimeSet}
        onChange={handleChange}
        sx={{ width: "150px" }}
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="scheduleYN"
            checked={settings.scheduleYN}
            onChange={handleChange}
          />
        }
        label="Enable Schedule"
      />
      <br />
      <Button   sx={{ width: "150px" }} variant="contained" color="primary" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
};

export default Settings;
