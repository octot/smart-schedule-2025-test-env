import React, { useEffect, useState } from "react";
import "./scheduleDetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from "@mui/material";
import ScheduleExcelReport from "./scheduleExcelReport";
const ScheduleTable = () => {
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState(null);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  useEffect(() => {
    fetch("api/getScheduleToDB")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }
        setSchedule(
          data.map((item) => ({
            ...item,
            recordSelected: item.recordSelected,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  }, []);
  const getSessionsForDay = (day) => {
    return schedule.filter((session) => {
      const sessionDay = new Date(session.triggerDate).getDay();
      // console.log("sessionDay", sessionDay);
      return daysOfWeek[sessionDay] === day;
    });
  };
  const handleSelectRecord = (id) => {
    setSchedule((prevSchedule) => {
      console.log("Previous schedule:", prevSchedule); // Log entire previous state
      const newSchedule = prevSchedule.map((session) => {
        if (session._id === id) {
          const updatedSession = {
            ...session,
            recordSelected: !session.recordSelected,
          };
          console.log("Updated session:", updatedSession); // Log the changed session
          return updatedSession;
        }
        return session;
      });

      console.log("New schedule:", newSchedule); // Log entire new state
      return newSchedule;
    });
  };
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSchedule(
      schedule.map((session) => ({ ...session, recordSelected: !selectAll }))
    );
  };
  const markAsSent = () => {
    console.log("Current schedule before marking:", schedule);
    fetch("api/schedules/updateScheduleToDB", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update records");
        }
        return response.json();
      })
      .then(() => {
        toast.success("Selected records marked as sent and updated in DB!");
      })
      .catch((error) => {
        console.error("Error updating records:", error);
        toast.error("Failed to update records");
      });
  };
  useEffect(() => {
    console.log("Updated schedule:", schedule);
  }, [schedule]);
  return (
    <div className="schedule-container">
      {error && <p className="error-text">Error: {error}</p>}
      <div className="schedule-excel-report">
        <ScheduleExcelReport schedule={schedule} />
      </div>
      <div className="search-container">
        <TextField
          variant="standard"
          type="text"
          placeholder="Search by Tuition ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>
      <ToastContainer />
      <button onClick={markAsSent} className="mark-send-btn">
        Mark as Sent
      </button>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            {daysOfWeek.map((day) => (
              <td key={day} className="schedule-cell">
                {getSessionsForDay(day)
                  ?.filter((session) =>
                    searchTerm ? session.tuitionId?.includes(searchTerm) : true
                  )
                  .map((session) => {
                    const formattedDate = new Date(
                      session.triggerDate
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={session._id}
                        className={`session-box ${
                          session.recordSelected ? "faded strike" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={session.recordSelected}
                          onChange={() => handleSelectRecord(session._id)}
                        />
                        <p>
                          <strong>Tuition ID:</strong> {session.tuitionId}
                        </p>
                        <p>
                          <strong>Tutor:</strong> {session.tutorName}
                        </p>
                        <p>
                          <strong>Time:</strong> {session.sessionStartTime} -{" "}
                          {session.sessionEndTime}
                        </p>
                        <p>
                          <strong>Scheduled Date:</strong> {formattedDate}
                        </p>
                      </div>
                    );
                  })}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default ScheduleTable;
