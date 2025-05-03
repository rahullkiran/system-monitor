import psutil
import json
import os
from datetime import datetime, timezone

THRESHOLDS_FILE = "thresholds.json"
HISTORY_FILE = "history.json"

def get_thresholds():
    if not os.path.exists(THRESHOLDS_FILE):
        default = {"cpu": 100, "memory": 100, "disk": 100}
        with open(THRESHOLDS_FILE, "w") as f:
            json.dump(default, f, indent=4)
        return default

    with open(THRESHOLDS_FILE, "r") as f:
        return json.load(f)

def update_thresholds(new_thresholds):
    with open(THRESHOLDS_FILE, "w") as f:
        json.dump(new_thresholds, f, indent=4)

def check_stats():
    thresholds = get_thresholds()

    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage("/").percent

    alerts = []

    if cpu > thresholds["cpu"]:
        alerts.append(f"High CPU usage: {cpu}% (Threshold: {thresholds['cpu']}%)")

    if memory > thresholds["memory"]:
        alerts.append(f"High Memory usage: {memory}% (Threshold: {thresholds['memory']}%)")

    if disk > thresholds["disk"]:
        alerts.append(f"High Disk usage: {disk}% (Threshold: {thresholds['disk']}%)")

    result = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "cpu": cpu,
        "memory": memory,
        "disk": disk,
        "alerts": alerts
    }

    # Save to history
    history_entry = {
        "timestamp": result["timestamp"],
        "cpu": cpu,
        "memory": memory,
        "disk": disk
    }

    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            history = json.load(f)
    else:
        history = []

    history.append(history_entry)
    history = history[-100:]

    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)

    return result

def get_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return []
