import React, { useEffect, useState } from "react";
import axios from "axios";
import "../componentcss/ViewScreen.css";
import {
  useSession,
  SessionProvider,
} from "./contextAPI/sessionManagementContext";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
const ViewScreen = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setEditUser } = useSession();
  const [openDialogForWhatsapp, setOpenDialogForWhatsapp] = useState(false);
  const handleOpenDialogForWhatsapp = () => setOpenDialogForWhatsapp(true);
  const handleCloseDialogForWhatsapp = () => setOpenDialogForWhatsapp(false);
  const navigate = useNavigate();
  const [sessionTimes, setSessionTimes] = useState({
    sessionStartTime: "",
    sessionEndTime: "",
  });
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("/api/schedules");
        setSchedules(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);
  const handleEdit = (_id) => {
    navigate(`/create/${_id}`);
  };
  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`/api/schedules/${id}`);
      setSchedules(schedules.filter((schedule) => schedule._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete schedule");
    }
  };
  const handleViaWhatsappDetails = (scheduleItem) => {
    console.log("scheduleItem", scheduleItem);
    const today = new Date()
      .toLocaleString("en-US", { weekday: "short" })
      .toLowerCase();
    const matchingDay = scheduleItem.totalDays.find((day) => day.day === today);
    if (matchingDay) {
      sendViaWhatsapp(scheduleItem, today);
    } else {
      setOpenDialogForWhatsapp(true);
      sendViaWhatsapp(scheduleItem, today);

      // sendViaWhatsapp(updatedScheduleItem, today);
    }
  };
  console.log("sessionTimes", sessionTimes);
  const sendViaWhatsapp = async (scheduleItem, today) => {
    const todaySchedule = scheduleItem?.totalDays.find(
      (item) => item.day === today
    );
    let sessionStartTime = todaySchedule?.sessionStartTime;
    let sessionEndTime = todaySchedule?.sessionEndTime;
    if (sessionTimes.sessionStartTime && sessionTimes.sessionEndTime) {
      sessionStartTime = sessionTimes.sessionStartTime;
      sessionEndTime = sessionTimes.sessionEndTime;
    }
    if (sessionStartTime && sessionEndTime) {
      const message = `Greetings from Smartpoint 😇
    Today your class is scheduled for
    Tuition ID : ${scheduleItem.tuitionId}
    Session Date : ${scheduleItem.sessionDate}
    Tutor Name : ${scheduleItem.tutorName}
    Time of Session: ${sessionStartTime} - ${sessionEndTime}`;
      try {
        await axios.post("/api/schedules/send-whatsapp", { message });
        setSessionTimes({ sessionStartTime: "", sessionEndTime: "" });
        alert("Message sent via WhatsApp");
      } catch (err) {
        console.error(err);
        setError("Failed to send message via WhatsApp");
      }
    }
  };

  const handleSessionForTodaysInterval = (field, value) => {
    setSessionTimes((prevTimes) => ({
      ...prevTimes,
      [field]: value,
    }));
  };
  return (
    <div className="schedule-details">
      <h1>Schedule Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Tuition ID</th>
              <th>Tutor Name</th>
              <th>Automate</th>
              <th>Session Date</th>
              <th>Total Days</th>
              <th>Actions</th>
              <th>Share Details</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule._id}>
                <td>{schedule.tuitionId}</td>
                <td>{schedule.tutorName}</td>
                <td>{schedule.automate ? "Yes" : "No"}</td>
                <td>{schedule.sessionDate}</td>
                <td>
                  <ul>
                    {schedule.totalDays.map((day, index) => (
                      <li key={index}>
                        {day.day} - {day.sessionStartTime} to{" "}
                        {day.sessionEndTime}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <Button onClick={() => handleEdit(schedule._id)}>Edit</Button>
                  <Button onClick={() => handleDeleteSchedule(schedule._id)}>
                    Delete
                  </Button>
                </td>
                <td>
                  <Button onClick={() => handleViaWhatsappDetails(schedule)}>
                    Send via WhatsApp
                  </Button>
                </td>
                <div>
                  {openDialogForWhatsapp && (
                    <div>
                      <Dialog
                        open={openDialogForWhatsapp}
                        onClose={handleCloseDialogForWhatsapp}
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{ style: { height: "30vh" } }}
                      >
                        <DialogTitle id="dialog-title">
                          Date not found for today. Please provide the session
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText
                            id="dialog-description"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                            }}
                          >
                            <div>
                              <Box component="div" className="session-time">
                                <label>
                                  <TextField
                                    required
                                    label="Start Time"
                                    type="time"
                                    value={sessionTimes.sessionStartTime}
                                    onChange={(e) =>
                                      handleSessionForTodaysInterval(
                                        "sessionStartTime",
                                        e.target.value
                                      )
                                    }
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                  />
                                </label>
                                <label>
                                  <TextField
                                    required
                                    label="End Time"
                                    type="time"
                                    value={sessionTimes.sessionEndTime}
                                    onChange={(e) =>
                                      handleSessionForTodaysInterval(
                                        "sessionEndTime",
                                        e.target.value
                                      )
                                    }
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                  />
                                </label>
                              </Box>
                            </div>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleCloseDialogForWhatsapp}
                            color="primary"
                          >
                            Close
                          </Button>
                          <Button
                            onClick={() => handleViaWhatsappDetails(schedule)}
                            color="primary"
                            autoFocus
                          >
                            SendMessage
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  )}
                </div>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default ViewScreen;
