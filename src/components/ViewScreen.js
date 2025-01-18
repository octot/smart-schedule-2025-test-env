import React, { useEffect, useState } from "react";
import axios from "axios";
import "../componentcss/ViewScreen.css";
import {
  useSession,
  SessionProvider,
} from "./contextAPI/sessionManagementContext";
import { useNavigate } from "react-router-dom";
import {
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
    const today = new Date()
      .toLocaleString("en-US", { weekday: "short" })
      .toLowerCase();
    console.log("today", today);
    const matchingDay = scheduleItem.totalDays.find((day) => day.day === today);
    if (matchingDay) {
      sendViaWhatsapp(scheduleItem, today);
    } else {
      setOpenDialogForWhatsapp(true);
      alert("No matching schedule for today");
    }
  };

  const sendViaWhatsapp = async (scheduleItem, today) => {
    const todaySchedule = scheduleItem?.totalDays.find(
      (item) => item.day === today
    );
    const sessionStartTime = todaySchedule?.sessionStartTime;
    console.log("sendViaWhatsappsessionStartTime", sessionStartTime);
    const sessionEndTime = todaySchedule?.sessionEndTime;
    const message = `
    Greetings from Smartpoint 😇
    Today your class is scheduled for
    Tuition ID : ${scheduleItem.tuitionId}
    Session Date : ${scheduleItem.sessionDate}
    Tutor Name : ${scheduleItem.tutorName}
    Time of Session: ${sessionStartTime} - ${sessionEndTime}`;

    try {
      await axios.post("/api/schedules/send-whatsapp", { message });
      alert("Message sent via WhatsApp");
    } catch (err) {
      console.error(err);
      setError("Failed to send message via WhatsApp");
    }
  };
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
  return (
    <div>
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
              </tr>
            ))}
          </tbody>
          <div>
            {openDialogForWhatsapp && (
              <div>
              
                <Dialog
                  open={openDialogForWhatsapp}
                  onClose={handleCloseDialogForWhatsapp}
                  aria-labelledby="dialog-title"
                  aria-describedby="dialog-description"
                >
                  <DialogTitle id="dialog-title">Dialog Title</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="dialog-description">
                      This is a simple dialog example using Material-UI.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseDialogForWhatsapp}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCloseDialogForWhatsapp}
                      color="primary"
                      autoFocus
                    >
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
          </div>
        </table>
      )}
    </div>
  );
};
export default ViewScreen;
