import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch } from "react-redux";
import {
  useSession,
  SessionProvider,
} from "./contextAPI/sessionManagementContext";
import { addSession } from "./store/scheduleSlice";
import { AutoAwesome, SmartToy } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Checkbox,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";
import "../componentcss/CreateScreen.css";
import { sessionTimes, selectedDaysTrue, daysInWeek } from "./constants";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { URL } from '../components/ConstantVariables'
import CloseButton from '../components/assests/icons/CloseButton'
const CreateScreen = () => {
  return (
    <SessionProvider>
      <CreateNewScreen />
    </SessionProvider>
  );
};
const CreateNewScreen = () => {
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, dispatch, setEditUser, editUser, updateUser } = useSession();
  const reduxDispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      if (id && id !== undefined) {
        try {

          const response = await axios.get(`${URL}/schedules/${id}`);
          if (response.status !== 200) {
            console.error("Error fetching response:", response.statusText);
            return;
          }
          setEditUser(response.data);
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      }
      else {
        console.error("Error in fetchData", id)
      }
    };
    fetchData();
  }, [id]);
  useEffect(() => {
    if (editUser) {
      const selectedDaysPayload = editUser?.totalDays?.reduce((acc, item) => {
        acc[item.day] = true;
        return acc;
      }, {});
      dispatch({ type: "SET_SELECTED_DAYS", payload: selectedDaysPayload });
    }
  }, [editUser, dispatch]);

  const toggleDaySelection = (day) => {
    dispatch({ type: "TOGGLE_DAY", payload: day });
    setIsDirty(true);
  };
  const handleSessionChange = (day, field, value) => {
    dispatch({
      type: "UPDATE_SESSION_TIME",
      payload: { day, field, value },
    });
    setIsDirty(true);
  };
  const handleSave = () => {
    console.log("workinghandleavse")
    toast.success("Schedule saved   successfully!", {
      position: "top-right",
      autoClose: 1000,
    });
    if (editUser) {
      setEditUser((prev) => {
        if (prev.useCommonSession) {
          return {
            ...prev,
            totalDays: [
              {
                day: "sun",
                sessionStartTime: prev.commonSession?.sessionStartTime,
                sessionEndTime: prev.commonSession?.sessionEndTime,
              },
              {
                day: "mon",
                sessionStartTime: prev.commonSession?.sessionStartTime,
                sessionEndTime: prev.commonSession?.sessionEndTime,
              },
              {
                day: "tue",
                sessionStartTime: prev.commonSession?.sessionStartTime,
                sessionEndTime: prev.commonSession?.sessionEndTime,
              },
              {
                day: "wed",
                sessionStartTime: prev.commonSession?.sessionStartTime,
                sessionEndTime: prev.commonSession?.sessionEndTime,
              },
              {
                day: "thu",
                sessionStartTime: prev.commonSession?.sessionStartTime,
                sessionEndTime: prev.commonSession?.sessionEndTime,
              },
              {
                day: "fri",
                sessionStartTime: prev.commonSession?.sessionStartTime,
                sessionEndTime: prev.commonSession?.sessionEndTime,
              },
              {
                day: "sat",
                sessionStartTime: prev.commonSession?.sessionStartTime,
                sessionEndTime: prev.commonSession?.sessionEndTime,
              },
            ],
          };
        } else {
          const updatedTotalDays = Object.keys(state.selectedDays)
            .filter((day) => state.selectedDays[day])
            .map((day) => {
              // Find matching entry in prev.totalDays
              const prevDayData = prev.totalDays.find((d) => d.day === day);
              const sessionData = state.sessionTimes[day];
              return {
                day,
                sessionStartTime:
                  (sessionData?.sessionStartTime ||
                    prevDayData?.sessionStartTime) ??
                  "",
                sessionEndTime:
                  (sessionData?.sessionEndTime ||
                    prevDayData?.sessionEndTime) ??
                  "",
                daySchedule: prevDayData?.daySchedule,
                automaticScheduleTime: prevDayData?.automaticScheduleTime
              };
            });
          return {
            ...prev,
            totalDays: updatedTotalDays,
          };
        }

      });
    }
    setIsDirty(false);
    dispatch({ type: "SAVE_DAYS" });
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (editUser) {
      setEditUser((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    dispatch({
      type: "UPDATE_FORM",
      payload: { name, value, type, checked },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {

        const response = await fetch(`${URL}/schedules/${editUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editUser),
        });
        if (!response.ok) {
          console.error(response);
          throw new Error("Network response was not ok");
        }
        updateUser(editUser);
        dispatch({ type: "RESET_FORM" });
        navigate("/");
      } else {
        const response = await fetch(`${URL}/schedules`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(state.formData),
        });

        if (!response.ok) {
          console.error(response);
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        toast.success("Schedule created   successfully!", {
          position: "top-right",
          autoClose: 1000,
        });
        reduxDispatch(addSession(state.formData));
        dispatch({ type: "RESET_FORM" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCheckboxChange = (checked) => {
    if (editUser) {
      setEditUser((prev) => ({
        ...prev,
        useCommonSession: checked,
        commonSession: checked
          ? {
            ...prev.commonSession,
            sessionStartTime: prev.commonSession?.sessionStartTime || "",
            sessionEndTime: prev.commonSession?.sessionEndTime || "",
          }
          : null,
      }));
    }
    setIsDirty(true);
    dispatch({
      type: "TOGGLE_COMMON_SESSION",
      payload: { checked, selectedDaysTrue },
    });
  };
  const handleCommonSession = (field) => (e) => {
    const value = e.target.value;
    if (editUser) {
      setEditUser((prev) => ({
        ...prev,
        commonSession: {
          ...prev?.commonSession,
          [field]: value,
        },
      }));
    }
    setIsDirty(true);
    dispatch({
      type: "UPDATE_COMMON_SESSION",
      payload: { field, value: e.target.value },
    });
  };
  const handleOpen = () => dispatch({ type: "TOGGLE_MODAL", payload: true });
  const handleClose = () => {
    if (isDirty) {
      alert("You have unsaved changes. Please click Save before closing.");
      return;
    }
    dispatch({ type: "TOGGLE_MODAL", payload: false });
  }
  return (
    <div>
      <Box className="schedule-main">
        {editUser ? (
          <Typography variant="h4" component="h2" gutterBottom>
            Update Schedule
          </Typography>
        ) : (
          <Typography variant="h4" component="h2" gutterBottom>
            Create Schedule
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4} className='schedule-list'>
            {/* Tuition ID */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tuition ID"
                name="tuitionId"
                value={editUser?.tuitionId || state.formData.tuitionId || ""}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Tutor Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tutor Name"
                name="tutorName"
                value={editUser?.tutorName || state.formData.tutorName || ""}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Session Date"
                name="sessionDate"
                value={
                  editUser?.sessionDate || state.formData.sessionDate || ""
                }
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Automate Checkbox */}
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                onClick={handleOpen}
                fullWidth
                sx={{
                  height: '56px',  // matches default TextField height
                }}
              >
                Select Days
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className="automate-checkbox-container">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="automate"
                      checked={editUser?.automate || state.formData.automate}
                      onChange={handleChange}
                      className="automate-checkbox"
                      icon={<div className="checkbox-icon unchecked" />}
                      checkedIcon={<div className="checkbox-icon checked"><AutoAwesome /></div>}
                    />
                  }
                  label={
                    <Box className="checkbox-label-container">
                      <Typography className="checkbox-label-text">
                        Automate
                      </Typography>
                      <Typography className="checkbox-label-subtitle">
                        Enable smart automation
                      </Typography>
                    </Box>
                  }
                  className="automate-form-control"
                />
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              {editUser ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Update Entry
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Create
                </Button>
              )}
            </Grid>
          </Grid>
          <Dialog open={state.open} onClose={handleClose}>
            <div className="days-dialog-main">
              <DialogTitle>Select Days for Scheduled Classes</DialogTitle>
              <DialogContent>
                <div className="days-grid-main">
                  <div className="days-grid-elements">
                    {daysInWeek.map((day) => {
                      const isSelected = state?.selectedDays?.[day] || false;
                      return (
                        <div
                          key={day}
                          className={`day-box ${isSelected ? "selected" : ""}`}
                          onClick={() => toggleDaySelection(day)}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                  <FormControlLabel
                    className="use-common-session-checkbox"
                    control={
                      <Checkbox
                        checked={
                          editUser?.useCommonSession ||
                          state.useCommonSession ||
                          false
                        }
                        onChange={(e) => handleCheckboxChange(e.target.checked)}
                      />
                    }
                    label="Same Time for All Days"
                  />
                  {editUser?.useCommonSession || state.useCommonSession ? (
                    <div>
                      <Box component="div" className="common-session">
                        <label>
                          <TextField
                            fullWidth
                            required
                            type="time"
                            label="CommonStartTime"
                            value={
                              editUser?.commonSession?.sessionStartTime ||
                              state.commonSession.sessionStartTime ||
                              ""
                            }
                            onChange={handleCommonSession("sessionStartTime")}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </label>
                        <label>
                          <TextField
                            fullWidth
                            required
                            label=" Common End Time"
                            type="time"
                            value={
                              editUser?.commonSession?.sessionEndTime ||
                              state.commonSession.sessionEndTime ||
                              ""
                            }
                            onChange={handleCommonSession("sessionEndTime")}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            error={
                              !!editUser?.errors?.sessionEndTime ||
                              !!state.errors.sessionEndTime
                            }
                            helperText={
                              editUser?.errors?.sessionEndTime ||
                              state.errors.sessionEndTime
                            }
                          />
                        </label>
                      </Box>
                    </div>
                  ) : (
                    <div className="session-times-container">
                      {daysInWeek.map((day) => {
                        const userSession = editUser?.totalDays?.find(
                          (item) => item.day === day
                        );
                        const sessionStartTime =
                          userSession?.sessionStartTime ||
                          state?.sessionTimes[day]?.sessionStartTime;
                        const sessionEndTime =
                          userSession?.sessionEndTime ||
                          state?.sessionTimes[day]?.sessionEndTime;
                        return (
                          state?.selectedDays?.[day] && (
                            <div key={day} className="session-card">
                              <h4 className="session-title">{day.toUpperCase()} Session Times</h4>
                              <div className="session-time-wrapper">
                                <div className="time-input-group">
                                  <label className="time-label">
                                    <TextField
                                      required
                                      label="Start Time"
                                      type="time"
                                      value={sessionStartTime}
                                      onChange={(e) =>
                                        handleSessionChange(
                                          day,
                                          "sessionStartTime",
                                          e.target.value
                                        )
                                      }
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      className="time-input"
                                    />
                                  </label>
                                </div>
                                <div className="time-input-group">
                                  <label className="time-label">
                                    <TextField
                                      required
                                      label="End Time"
                                      type="time"
                                      value={sessionEndTime}
                                      onChange={(e) =>
                                        handleSessionChange(
                                          day,
                                          "sessionEndTime",
                                          e.target.value
                                        )
                                      }
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                      error={!!state.errors[day]}
                                      helperText={state.errors[day]}
                                      className="time-input"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  )}
                  <Button
                    onClick={handleSave}
                    className="save-schedule-btn"
                    variant="contained"
                    startIcon={<SaveIcon />}
                  >
                    Save Schedule
                  </Button>
                </div>
              </DialogContent>
              <DialogActions>
                <CloseButton onClose={handleClose} text="Cancel" />
              </DialogActions>
            </div>
          </Dialog>
        </form>
      </Box>
    </div>
  );
};
export default CreateScreen;
