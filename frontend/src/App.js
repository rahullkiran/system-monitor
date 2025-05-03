import React, { useState, useEffect } from "react";
import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function App() {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    alerts: [],
  });
  const [thresholdInput, setThresholdInput] = useState({
    cpu: "",
    memory: "",
    disk: "",
  });
  const [thresholdVisibility, setThresholdVisibility] = useState({
    cpu: false,
    memory: false,
    disk: false,
  });
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [thresholds, setThresholds] = useState({
    cpu: 100,
    memory: 100,
    disk: 100,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const fetchThresholds = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/thresholds");
      const data = await res.json();
      const parsed = {
        cpu: parseFloat(data.cpu),
        memory: parseFloat(data.memory),
        disk: parseFloat(data.disk),
      };
      setThresholds(parsed);
    } catch (err) {
      console.error("Failed to fetch thresholds:", err);
    }
  };

  const updateThresholds = async () => {
    try {
      const newThresholds = {
        cpu:
          thresholdInput.cpu === ""
            ? thresholds.cpu
            : parseFloat(thresholdInput.cpu),
        memory:
          thresholdInput.memory === ""
            ? thresholds.memory
            : parseFloat(thresholdInput.memory),
        disk:
          thresholdInput.disk === ""
            ? thresholds.disk
            : parseFloat(thresholdInput.disk),
      };

      const res = await fetch("http://127.0.0.1:8000/thresholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newThresholds),
      });

      const result = await res.json();
      setNotification({ type: "success", message: result.message });

      await fetchThresholds();
      await fetchStats();

      setThresholdInput({ cpu: "", memory: "", disk: "" }); // clear inputs
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: "error",
        message: "Failed to update thresholds",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchHistory();
    fetchThresholds();

    const interval = setInterval(() => {
      fetchStats();
      fetchHistory();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const isHigh = (value, type) => value > thresholds[type];

  return (
    <div className="App">
      <h1>System Resource Monitor</h1>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="stats-container">
        {["cpu", "memory", "disk"].map((key) => (
          <div
            key={key}
            className={`stat-card ${isHigh(stats[key], key) ? "high" : ""}`}
          >
            <h2>{key.toUpperCase()}</h2>
            <p>Usage: {stats[key]}%</p>
            <p
              style={{ fontSize: "0.8rem", color: "#666", marginTop: "+15px" }}
            >
              Threshold: {thresholds[key]}%
            </p>

            {isHigh(stats[key], key) && (
              <div className="inline-alert">
                ⚠️ High {key.toUpperCase()} usage
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="threshold-form">
        <h2>Update Thresholds</h2>
        {["cpu", "memory", "disk"].map((key) => (
          <label key={key}>
            {key.toUpperCase()} Threshold:
            <input
              type="number"
              value={thresholdInput[key]}
              onChange={(e) =>
                setThresholdInput({ ...thresholdInput, [key]: e.target.value })
              }
            />
          </label>
        ))}
        <button onClick={updateThresholds}>Update Thresholds</button>
      </div>

      <div className="charts">
        <h2>Historical Usage</h2>

        <div className="threshold-toggle">
          {["cpu", "memory", "disk"].map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={thresholdVisibility[key]}
                onChange={() =>
                  setThresholdVisibility({
                    ...thresholdVisibility,
                    [key]: !thresholdVisibility[key],
                  })
                }
              />
              Show {key.toUpperCase()} Threshold
            </label>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={history}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip
              content={({ label, payload }) => {
                if (!payload || payload.length === 0) return null;

                const date = new Date(label);
                const formattedDate = date.toISOString().split("T")[0];
                const formattedTime = date.toLocaleTimeString();

                return (
                  <div
                    className="custom-tooltip"
                    style={{
                      backgroundColor: "#fff",
                      padding: 10,
                      border: "1px solid #ccc",
                    }}
                  >
                    <p>
                      <strong>DATE:</strong> {formattedDate}
                    </p>
                    <p>
                      <strong>TIME:</strong> {formattedTime}
                    </p>
                    {payload.map((entry, index) => (
                      <p key={index} style={{ color: entry.stroke }}>
                        {entry.name} : {entry.value}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU" />
            <Line
              type="monotone"
              dataKey="memory"
              stroke="#82ca9d"
              name="Memory"
            />
            <Line type="monotone" dataKey="disk" stroke="#ffc658" name="Disk" />
            {["cpu", "memory", "disk"].map((key) =>
              thresholds[key] && thresholdVisibility[key] ? (
                <ReferenceLine
                  key={key}
                  y={parseFloat(thresholds[key])}
                  stroke="red"
                  strokeDasharray="5 5"
                  label={`${key.toUpperCase()} Threshold`}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
