import React, { useState, useEffect, useCallback } from "react";
import { callApi } from './util.js'
import Navbar from "./Navbar";
import "./Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const Base_URL = `${API_URL}/api/attendance`;

function Dashboard({ user, setUser }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("WFO");
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchAttendance = useCallback(async () => {
    if (!user) return;
    const obj = {
      method: 'GET',
      url: `${Base_URL}/${user.uid}/${month}`
    };
    const res = await callApi(obj);
    if (res && res.status === 200) {
      setRecords(res.data || []);
    } else {
      console.error("Error fetching records:", res.data);
    }
  }, [user, month]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const submitAttendance = async (e) => {
    e.preventDefault();
    const alreadyExists = records.some((r) => r.date === date);
    if (alreadyExists) {
      alert("Attendance already submitted for this date!");
      return;
    }
    const obj = {
      method: 'POST',
      url: `${Base_URL}/submit`,
      data: {
        userId: user.uid,
        userEmail: user.email,
        date,
        status
      }
    };
    const res = await callApi(obj);
    if (res && res.status === 200) {
      setDate("");
      fetchAttendance();
    } else {
      console.error("Error fetching records:", res.data);
    }
  }

  return (
    <div className="dashboard">
      <Navbar user={user} setUser={setUser} />
      <form onSubmit={submitAttendance} className="attendance-form">
        <input type="date" value={date} max={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} required />
        <label>
          <input type="radio" value="WFO" checked={status === "WFO"} onChange={(e) => setStatus(e.target.value)} />
          WFO
        </label>
        <label>
          <input type="radio" value="WFH" checked={status === "WFH"} onChange={(e) => setStatus(e.target.value)} />
          WFH
        </label>
        <button type="submit">Submit</button>
      </form>

      <div className="attendance-table">
        <h3>Attendance Records</h3>

        <label>Select Month: </label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <p style={{ fontWeight: "bold", marginTop: "10px" }}>
          Total WFO Days: {records.filter((r) => r.status === "WFO").length}
        </p>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Dashboard;