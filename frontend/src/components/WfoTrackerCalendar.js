import React, { useState, useEffect, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  callApi,
  generateMonthlyDataArray,
  updateCalendarWithApiData,
} from "./util.js";
import "./WfoTrackerCalendar.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const Base_URL = `${API_URL}/api/attendance`;

function WfoTrackerCalendar({ user, setUser }) {
  const navigate = useNavigate();
  const todayDate = 16;
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [calendarData, setCalendarData] = useState(
    generateMonthlyDataArray(month)
  );

  const fetchAttendance = useCallback(async () => {
    if (!user) return;
    const obj = {
      method: "GET",
      url: `${Base_URL}/${user.uid}/${month}`,
    };
    const res = await callApi(obj);
    if (res && res.status) {
      const calendarData = generateMonthlyDataArray(month);
      if (res?.data?.length > 0)
        setCalendarData(updateCalendarWithApiData(calendarData, res.data));
      else setCalendarData(calendarData);
    } else {
      console.error("Error fetching records:", res.data);
    }
  }, [user, month]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  //   const handleDateMarking = async (dateStr, newStatus) => {
  //     const alreadyExists = records.some((r) => r.date === dateStr);
  //     let obj = {};
  //     if (newStatus === "REMOVE") {
  //       obj = {
  //         method: "DELETE",
  //         url: `${Base_URL}/remove`,
  //         data: {
  //           userId: user.uid,
  //           date: dateStr,
  //         },
  //       };
  //     } else if (newStatus === "WFO" && !alreadyExists) {

  //       obj = {
  //         method: "POST",
  //         url: `${Base_URL}/submit`,
  //         data: {
  //           userId: user.uid,
  //           userEmail: user.email,
  //           date: dateStr,
  //           status: newStatus,
  //         },
  //       };
  //     } else if (newStatus === "WFO" && alreadyExists) {
  //       // --- PUT Request to change status if it already exists (e.g., WFH -> WFO) ---
  //       // NOTE: Your original requirement only needed WFO marking, but your records might contain WFH.
  //       // We use a PUT/UPDATE here for completeness.
  //       obj = {
  //         method: "PUT",
  //         url: `${Base_URL}/update`,
  //         data: {
  //           userId: user.uid,
  //           date: dateStr,
  //           status: newStatus,
  //         },
  //       };
  //     } else {
  //       // Guard clause for unhandled status (e.g., trying to remove a date that doesn't exist)
  //       return;
  //     }
  //     const res = await callApi(obj);
  //     if (res && (res.status === 200 || res.status === 204)) {
  //       fetchAttendance(); // Refresh records
  //     } else {
  //       console.error("Error updating attendance:", res.data);
  //     }
  //   };

  const handleDateMarking = async (date) => {
    const alreadyExists = records.some((r) => r.date === date);
    if (alreadyExists) {
      alert("Attendance already submitted for this date!");
      return;
    }
    const res = await callApi({
      method: "POST",
      url: `${Base_URL}/submit`,
      data: {
        userId: user.uid,
        userEmail: user.email,
        date: date,
        status: "WFO",
      },
    });
    if (res && (res.status === 200 || res.status === 204)) {
      setCalendarData(updateCalendarWithApiData(calendarData, [res.data]));
      // fetchAttendance();
    } else {
      console.error("Error updating attendance:", res.data);
    }
  };
  const handleDateClick = (clickedDate) => {
    // Find the index of the clicked date
    const index = calendarData.days.findIndex(
      (day) => day && day.date === clickedDate
    );
    if (index === -1) return; // Not a valid date cell

    const newDays = [...calendarData.days];
    const currentStatus = newDays[index].status;

    // Toggle WFO status
    if (currentStatus === "WFO") {
      newDays[index] = { ...newDays[index], status: null }; // Unmark
    } else if (currentStatus === null) {
      newDays[index] = { ...newDays[index], status: "WFO" }; // Mark
    }

    // Recalculate total WFO days (simple count for mock data)
    const newTotalWfoDays = newDays.filter(
      (day) => day && day.status === "WFO"
    ).length;

    setCalendarData({
      ...calendarData,
      days: newDays,
      totalWfoDays: newTotalWfoDays,
    });
  };
  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate("/");
    });
  };

  return (
    <div className="wfo-tracker-app">
      <header className="app-header">
        <h1>WFO Tracker</h1>
        <div className="user-actions">
          <span>{user.displayName}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="calendar-card">
        <div className="selector-section">
          <label htmlFor="month-select">Select Month</label>
          <input
            type="month"
            id="month-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div className="legend">
          <span className="wfo-legend-box"></span> WFO Day
          <span className="today-legend-box"></span> Today
        </div>

        <div className="calendar-grid-container">
          <div className="day-name">Sun</div>
          <div className="day-name">Mon</div>
          <div className="day-name">Tue</div>
          <div className="day-name">Wed</div>
          <div className="day-name">Thu</div>
          <div className="day-name">Fri</div>
          <div className="day-name">Sat</div>
          {calendarData.days.map((day, index) => {
            const isWFO = day && day.status === "WFO";
            const isWeekend = day && day.status === "WEEKEND";
            const isToday = day && day.date === todayDate;

            let className = "day-cell";
            if (!day) className += " empty-cell";
            if (isWFO) className += " wfo-day";
            if (isWeekend) className += " weekend-day";
            // if (isToday) className += " today-highlight";

            return (
              <div
                key={index}
                className={className}
                onClick={() =>
                  day && !isWeekend && handleDateMarking(day.fullDate)
                }
                title={
                  day && !isWeekend
                    ? isWFO
                      ? "Click to unmark WFO"
                      : "Click to mark as WFO"
                    : ""
                }
              >
                {day && <span className="date-number">{day.date}</span>}
                {isWFO && <span className="wfo-icon">🏢</span>}
              </div>
            );
          })}
        </div>

        <div className="summary">
          Total WFO Days in October: **{calendarData.totalWfoDays}**
        </div>
      </div>
    </div>
  );
}
export default WfoTrackerCalendar;
