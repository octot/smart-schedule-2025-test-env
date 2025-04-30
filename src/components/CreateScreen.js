import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useSession,
  SessionProvider,
} from "./contextAPI/sessionManagementContext";
import { addSession } from "./store/scheduleSlice";
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CreateScreen = () => {
  return (
    <SessionProvider>
      <CreateNewScreen />
    </SessionProvider>
  );
};
const CreateNewScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, dispatch, setEditUser, editUser, updateUser } = useSession();
  const reduxDispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      if (id && id !== undefined) {
        try {
          console.log('id of fetchdata', id)
          const response = await axios.get(`http://localhost:8080/schedules/${id}`);
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
    console.log(
      "toggleDaySelectioneditUserstate",
      state.selectedDays,
      state.sessionTimes
    );
    dispatch({ type: "TOGGLE_DAY", payload: day });
  };
  const handleSessionChange = (day, field, value) => {
    dispatch({
      type: "UPDATE_SESSION_TIME",
      payload: { day, field, value },
    });
  };
  const handleSave = () => {
    if (editUser) {
      setEditUser((prev) => {
        console.log(
          "handleSaveeditUserstate",
          state.selectedDays,
          state.sessionTimes
        );
        console.log("prev.useCommonSession", prev.useCommonSession);
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
          console.log("prev.totalDays", prev.totalDays);
          console.log("updatedTotalDaysstateselectedDays", state.selectedDays);
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
              };
            });

          console.log(updatedTotalDays);

          console.log("updatedTotalDays", updatedTotalDays);
          return {
            ...prev,
            totalDays: updatedTotalDays,
          };
        }
      });
    }
    console.log("editUserhandleSave", editUser);
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
        console.log("editUserhandleSubmit", editUser);
        const response = await fetch(`http://localhost:8080/schedules/${editUser.id}`, {
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
        const response = await fetch("http://localhost:8080/schedules", {
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
    dispatch({
      type: "UPDATE_COMMON_SESSION",
      payload: { field, value: e.target.value },
    });
  };
  const handleOpen = () => dispatch({ type: "TOGGLE_MODAL", payload: true });
  const handleClose = () => dispatch({ type: "TOGGLE_MODAL", payload: false });
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
          <Grid container spacing={2}>
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
              <Button variant="outlined" onClick={handleOpen}>
                Select Days
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="automate"
                    checked={editUser?.automate || state.formData.automate}
                    onChange={handleChange}
                  />
                }
                label="Automate"
              />
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
          <ToastContainer />
          <Dialog open={state.open} onClose={handleClose}>
            <DialogTitle>Select Days</DialogTitle>
            <DialogContent>
              <div className="days-grid-main">
                <div className="days-grid-elements">
                  {daysInWeek.map((day) => {
                    const isSelected = state?.selectedDays?.[day] || false;
                    return (
                      <div
                        key={day}
                        onClick={() => toggleDaySelection(day)}
                        style={{
                          width: "50px",
                          height: "50px",
                          lineHeight: "50px",
                          textAlign: "center",
                          border: "1px solid black",
                          backgroundColor: isSelected ? "green" : "transparent",
                          color: isSelected ? "white" : "black",
                          cursor: "pointer",
                        }}
                      >
                        {day.toUpperCase()}
                      </div>
                    );
                  })}
                </div>
                <FormControlLabel
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
                  label="Use Common Session"
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
                  <div>
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
                          <div key={day}>
                            <h4>{day.toUpperCase()} Session Times</h4>
                            <Box component="div" className="session-time">
                              <label>
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
                                />
                              </label>
                              <label>
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
                                />
                              </label>
                            </Box>
                          </div>
                        )
                      );
                    })}
                  </div>
                )}
                <Button onClick={handleSave}>Save</Button>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </Box>
    </div>
  );
};
export default CreateScreen;
