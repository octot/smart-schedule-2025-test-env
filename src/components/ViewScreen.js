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
  Paper,
  Chip,
  IconButton,
  Typography,
  Card,
  CardContent,
  Grid,
  Fade,
  Slide,
} from "@mui/material";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from "./assests/loadingDiagram/loading";
import { URL } from '../components/ConstantVariables';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  WhatsApp as WhatsAppIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

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
        perDayScheduleUid: day?.perDayScheduleUid
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
      const response = await fetch(`${URL}/schedules/${selectedSchedule?.id}`, {
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
      toast.success("Schedule updated successfully!");
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule");
    }
    try {
      const responseOfBulk = await fetch(`${URL}/automatic-schedules/bulk-upload-schedules`, {
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
      console.log("Schedule automatic bulk updated successfully:", dataOfBulk);
    } catch (error) {
      console.error("Error automatic bulk updating schedule:", error);
    }
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`${URL}/schedules`);
        setSchedules(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch schedules");
        toast.error("Failed to fetch schedules");
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
      await axios.delete(`${URL}/schedules/${id}`);
      setSchedules(schedules.filter((schedule) => schedule._id !== id));
      toast.success("Schedule deleted successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to delete schedule");
      toast.error("Failed to delete schedule");
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
        await axios.post(`${URL}/schedules/send-whatsapp`, { message });
        setSessionTimes({ sessionStartTime: "", sessionEndTime: "" });
        toast.success("Message sent via WhatsApp!");
      } catch (err) {
        console.error(err);
        setError("Failed to send message via WhatsApp");
        toast.error("Failed to send message via WhatsApp");
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
    const tutorName = String(schedule.tutorName || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return tuitionId.includes(query) || tutorName.includes(query);
  });

  return (
    <div className="modern-schedule-container">
      {/* Header Section */}
      <div className="schedule-header">
        <div className="header-content">
          <Typography variant="h4" className="page-title gradient-text">
            <ScheduleIcon className="title-icon" />
            Schedule Management
          </Typography>
          <Typography variant="subtitle1" className="page-subtitle">
            Manage and organize your tutoring schedules
          </Typography>
        </div>
      </div>

      {/* Search Section */}
      <Card className="search-card glass-effect">
        <CardContent>
          <Box className="search-container">
            <SearchIcon className="search-icon" />
            <TextField
              label="Search by Tuition ID or Tutor Name"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-field"
              fullWidth
              placeholder="Type to search..."
            />
          </Box>
        </CardContent>
      </Card>

      {/* Content Section */}
      {loading ? (
        <div className="loading-container">
          <LoadingScreen />
        </div>
      ) : error ? (
        <Card className="error-card">
          <CardContent>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <div className="schedules-grid">
          {filteredSchedules.length === 0 ? (
            <Card className="no-data-card glass-effect">
              <CardContent className="no-data-content">
                <ScheduleIcon className="no-data-icon" />
                <Typography variant="h6">No schedules found</Typography>
                <Typography variant="body2" color="textSecondary">
                  {searchQuery ? "Try adjusting your search criteria" : "Create your first schedule to get started"}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredSchedules.map((schedule, index) => (
              <Fade in={true} timeout={300 + index * 100} key={schedule._id}>
                <Card className="schedule-card glass-effect hover-lift">
                  <CardContent>
                    {/* Card Header */}
                    <div className="card-header">
                      <div className="tuition-info">
                        <Typography variant="h6" className="tuition-id">
                          <SchoolIcon className="info-icon" />
                          ID: {schedule.tuitionId}
                        </Typography>
                        <Chip
                          label={schedule.automate ? "Automated" : "Manual"}
                          className={`status-chip ${schedule.automate ? 'automated' : 'manual'}`}
                          size="small"
                        />
                      </div>
                    </div>

                    {/* Tutor Information */}
                    <div className="tutor-section">
                      <Typography variant="h6" className="tutor-name">
                        <PersonIcon className="info-icon" />
                        {schedule.tutorName}
                      </Typography>
                      <Typography variant="body2" className="session-date">
                        <CalendarIcon className="info-icon" />
                        Session Date: {schedule.sessionDate}
                      </Typography>
                    </div>

                    {/* Schedule Days */}
                    <div className="days-section">
                      <Typography variant="subtitle2" className="section-title">
                        <TimeIcon className="info-icon" />
                        Weekly Schedule
                      </Typography>
                      <div className="days-list">
                        {schedule.totalDays.map((day, dayIndex) => (
                          <div key={dayIndex} className="day-item">
                            <span className="day-name">{day.day}</span>
                            <span className="day-time">
                              {day.sessionStartTime} - {day.sessionEndTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                      {/*
                      <Button
                        variant="outlined"
                        startIcon={<ScheduleIcon />}
                        onClick={() => handleDaySchedule(schedule)}
                        className="action-btn schedule-btn"
                        size="small"
                      >
                        Schedule
                      </Button>
                      */
                      }

                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(schedule.id)}
                        className="action-btn edit-btn"
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="action-btn delete-btn"
                        size="small"
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => {
                          handleViaWhatsappDetails(schedule);
                        }}
                        className="action-btn whatsapp-btn"
                        size="small"
                      >
                        WhatsApp
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Fade>
            ))
          )}
        </div>
      )}

      {/* Enhanced WhatsApp Dialog */}
      <Dialog
        open={openDialogForWhatsapp}
        onClose={handleCloseDialogForWhatsapp}
        maxWidth="sm"
        fullWidth
        className="enhanced-dialog"
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
      >
        <div className="modern-dialog-container">
          <IconButton
            onClick={handleCloseDialogForWhatsapp}
            className="dialog-close-btn"
            aria-label="Close dialog"
          >
            <CloseIcon />
          </IconButton>

          <DialogTitle className="modern-dialog-title">
            {/* <TimeIcon className="dialog-icon" /> */}
            Session Time Required
          </DialogTitle>

          <DialogContent className="modern-dialog-content">
            <DialogContentText className="dialog-description">
              No session found for today. Please provide the start and end times for your session.
            </DialogContentText>

            <div className="time-inputs-grid">
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
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="outlined"
                className="time-input-field"
              />

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
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="outlined"
                className="time-input-field"
              />
            </div>
          </DialogContent>

          <DialogActions className="modern-dialog-actions">
            <Button
              onClick={handleCloseDialogForWhatsapp}
              className="dialog-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleViaWhatsappDetails(schedules[0]); // Using first schedule as reference
                handleCloseDialogForWhatsapp();
              }}
              disabled={!sessionTimes.sessionStartTime || !sessionTimes.sessionEndTime}
              className="dialog-send-btn"
              variant="contained"
            >
              Send Message
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      {/* Enhanced Schedule Modal */}
      <Dialog
        open={openDaySchedule}
        onClose={handleSelectedDayClose}
        maxWidth="md"
        fullWidth
        className="schedule-modal"
        TransitionComponent={Fade}
      >
        <div className="schedule-modal-container">
          <IconButton
            onClick={handleSelectedDayClose}
            className="modal-close-btn"
            aria-label="Close modal"
          >
            <CloseIcon />
          </IconButton>

          <DialogTitle className="schedule-modal-title">
            <ScheduleIcon className="modal-icon" />
            Schedule Configuration
          </DialogTitle>

          <DialogContent className="schedule-modal-content">
            {selectedSchedule && (
              <div className="schedule-table-container">
                <div className="schedule-info-header">
                  <Typography variant="h6" className="schedule-tutor-name">
                    {selectedSchedule.tutorName}
                  </Typography>
                  <Typography variant="body2" className="schedule-tuition-id">
                    Tuition ID: {selectedSchedule.tuitionId}
                  </Typography>
                </div>

                <div className="schedule-days-grid">
                  {selectedSchedule?.totalDays?.map((day, index) => (
                    <Card key={index} className="day-schedule-card">
                      <CardContent>
                        <Typography variant="h6" className="day-title">
                          {day?.day.charAt(0).toUpperCase() + day?.day.slice(1)}
                        </Typography>
                        <Typography variant="body2" className="session-time">
                          Session: {day?.sessionStartTime} - {day?.sessionEndTime}
                        </Typography>
                        <TextField
                          required
                          type="time"
                          label="Scheduled Time"
                          value={day.automaticScheduleTime || ""}
                          onChange={(e) => handleScheduleDay(selectedSchedule, day, e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          variant="outlined"
                          className="schedule-time-input"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>

          <DialogActions className="schedule-modal-actions">
            <Button
              onClick={handleSelectedDayClose}
              className="modal-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSaveScheduleDetails(selectedSchedule);
                handleSelectedDayClose();
              }}
              className="modal-save-btn"
              variant="contained"
            >
              Save Schedule
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default ViewScreen;