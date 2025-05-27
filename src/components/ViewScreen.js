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

import LoadingScreen from "./assests/loadingDiagram/loading";

const ViewScreen = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setEditUser } = useSession();
  const [openDialogForWhatsapp, setOpenDialogForWhatsapp] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const handleOpenDialogForWhatsapp = () => setOpenDialogForWhatsapp(true);
  const handleCloseDialogForWhatsapp = () => setOpenDialogForWhatsapp(false);
  const navigate = useNavigate();
  const [sessionTimes, setSessionTimes] = useState({
    sessionStartTime: "",
    sessionEndTime: "",
  });
  const [openDaySchedule, setDaySchedule] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  // totalDays

  const handleDaySchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setDaySchedule(true);
  };
  const handleScheduleDay = (selectedSchedule, selectedDay, time) => {
    const updatedSchedule = {
      ...selectedSchedule,
      totalDays: selectedSchedule.totalDays.map(day =>
        day.day === selectedDay.day
          ? { ...day, automaticScheduleTime: time }
          : day
      )
    };
    setSelectedSchedule(updatedSchedule);
  }
  console.log("selectedSchedule", selectedSchedule)
  const handleSelectedDayClose = () => {
    setDaySchedule(false);
    setSelectedSchedule(null);
  };
const transformDataForAutomaticSchedule = (selectedSchedule) => {
  let transformedData = [];

  if (selectedSchedule?.totalDays?.length > 0) {
    let automaticScheduleDetails = selectedSchedule.totalDays.map(day => ({
      day: day?.day,
      sessionStartTime: day?.sessionStartTime,
      sessionEndTime: day?.sessionEndTime,
      daySchedule: true,
      automaticScheduleTime: day?.automaticScheduleTime,
      perDayScheduleUid:day?.perDayScheduleUid
    }));

    transformedData.push({
      automaticScheduleDetails,
      id: selectedSchedule?.id,
      tuitionId: selectedSchedule?.tuitionId,
      tutorName: selectedSchedule?.tutorName
    });
  }

  console.log("transformDataForAutomaticSchedule transformedData", transformedData);
  return transformedData;
};


  const handleSaveScheduleDetails = async (selectedSchedule) => {
    console.log("handleSaveScheduleDetails", selectedSchedule);
    const automaticBulkData = transformDataForAutomaticSchedule(selectedSchedule);
    try {
      const response = await fetch(`http://localhost:8080/schedules/${selectedSchedule?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedSchedule),
      });

      if (!response.ok) {
        throw new Error(`Failed to update schedule: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Schedule updated successfully:", data);
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
    try {
      const responseOfBulk = await fetch(`http://localhost:8080/automatic-schedules/bulk-upload-schedules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(automaticBulkData),
      });

      if (!responseOfBulk.ok) {
        throw new Error(`Failed to update schedule: ${responseOfBulk.statusText}`);
      }

      const dataOfBulk = await responseOfBulk.json();
      console.log("Schedule automatic  bulk updated successfully:", dataOfBulk);
    } catch (error) {
      console.error("Error automatic  bulk updating schedule:", error);
    }
  };


  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:8080/schedules");
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
    console.log('handlemyedit', _id)
    navigate(`/create/${_id}`);
  };
  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/schedules/${id}`);
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
    }
  };

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
        await axios.post("http://localhost:8080/schedules/send-whatsapp", { message });
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

  const filteredSchedules = schedules.filter((schedule) => {
    const tuitionId = String(schedule.tuitionId || "").toLowerCase();
    return tuitionId.includes(searchQuery.toLowerCase());
  });
  return (
    <div className="schedule-details">
      <h1>Schedule Details</h1>
      <TextField
        label="Search by Tutor Name"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      {loading ? (
        <p>
          <LoadingScreen />
        </p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Tuition ID</th>
              <th>Tutor Name</th>
              <th>Automate</th>
              <th>schedule</th>
              <th>Session Date</th>
              <th>Total Days</th>
              <th>Actions</th>
              <th>Share Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((schedule) => (
              <tr key={schedule._id}>
                <td>{schedule.tuitionId}</td>
                <td>{schedule.tutorName}</td>
                <td>{schedule.automate ? "Yes" : "No"}</td>
                <td><Button onClick={() => handleDaySchedule(schedule)}>schedule</Button></td>
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
                  <Button onClick={() => handleEdit(schedule.id)}>Edit</Button>
                  <Button onClick={() => handleDeleteSchedule(schedule.id)}>
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
          <div>
            {/* Modal */}
            {openDaySchedule && selectedSchedule && (
              <div className="modal">
                <div className="modal-content">
                  <h2>Schedule Details</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Session Time</th>
                        <th>scheduledTime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSchedule?.totalDays?.map((day, index) => (
                        <tr key={index}>
                          <td>{day?.day}</td>
                          <td>
                            {day?.sessionStartTime} to {day?.sessionEndTime}
                          </td>
                          <td>
                            <TextField
                              required
                              type="time"
                              label="scheduleDayTime"
                              value={day.automaticScheduleTime}
                              onChange={(e) => handleScheduleDay(selectedSchedule, day, e.target.value)}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <button onClick={() => handleSaveScheduleDetails(selectedSchedule)}>
                          SaveScheduleDetails</button></tr>
                    </tbody>
                  </table>
                  <button onClick={handleSelectedDayClose}>Close</button>
                </div>

              </div>
            )}
          </div>
        </table>
      )}
    </div>
  );
};

export default ViewScreen;
