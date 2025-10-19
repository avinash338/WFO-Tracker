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
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [calendarData, setCalendarData] = useState(
    generateMonthlyDataArray(month)
  );
  const [loader, setLoader] = useState(false);

  const fetchAttendance = useCallback(async () => {
    if (!user) return;
    setLoader(true);
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
      setLoader(false);
    } else {
      console.error("Error fetching records:", res.data);
    }
  }, [user, month]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleDateMarking = async (date) => {
    const wfoStatus = calendarData.days.find((d) => d && d.fullDate === date)?.status;
    const postAttendance = {
      method: "POST",
      url: `${Base_URL}/submit`,
      data: {
        userId: user.uid,
        userEmail: user.email,
        date: date,
        status: "WFO",
      }
    };
    const removeAttendance = {
      method: "PATCH",
      url: `${Base_URL}/update-status`,
      data: {
        userId: user.uid,
        date: date
      },
    };
    const res = await callApi(wfoStatus === "WFO" ? removeAttendance : postAttendance);
    if (res && (res.status === 200 || res.status === 204)) {
      fetchAttendance();
    } else {
      console.error("Error updating attendance:", res.data);
    }
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
          <div>
            <label htmlFor="month-select">Select Month</label>
            <input
              type="month"
              id="month-select"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <div>
            <div className="loader" style={{ display: loader ? 'block' : 'none' }}>
              Loading...
            </div>
          </div>
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

            let className = "day-cell";
            if (!day) className += " empty-cell";
            if (isWFO) className += " wfo-day";
            if (isWeekend) className += " weekend-day";

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
          Total WFO Days in {calendarData.monthValue}: <b>{calendarData.totalWfoDays}</b>
        </div>
      </div>
    </div>
  );
}
export default WfoTrackerCalendar;
