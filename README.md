🖥️ System Resource Monitor

A lightweight tool that monitors real-time system resources (CPU, memory, disk usage) and sends an alert if user-defined thresholds are exceeded. Built using ReactJS(frontend) and python with FastAPI(backend).

🛠️
COMPONENTS: TECH USED:
Frontend ReactJS, Recharts, CSS
Backend FastAPI, psutil
Others JSON for config/history

AI Tools Used:
ChatGPT: Used for prototyping, debugging, frontend/backend enhancements, file structure

INSTALLATION INSTRUCTIONS:
Prerequisites:

- Python 3.8+
- Node.js (React)
- pip, npm

FOLDER STRUCTURE:
system-monitor/
├── backend/
│ ├── main.py
│ ├── monitor.py
│ ├── thresholds.json
│ ├── history.json
│ └── requirements.txt
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── App.js
└── docker-compose.yml (optional)

🛆 Setup Instructions

1. RUN WITHOUT DOCKER:

- Backend (FastAPI)
  cd backend
  python -m venv venv
  .\venv\Scripts\activate # or source venv/bin/activate on Unix
  pip install -r requirements.txt
  uvicorn main:app --reload

- Frontend (React)
  cd frontend
  npm install
  npm start

2. RUN WITH DOCKER

- Ensure Docker and Docker Compose are installed.
  docker-compose up --build

The app will be accessible at:
Frontend: http://localhost:3000
Backend API: http://localhost:8000

📚 APP FEATURES
Threshold Configuration: You can configure thresholds for each resource using the form in the UI. Alerts will display if usage exceeds the set threshold.

Historical Data: A graph at the bottom of the page provides historical data of resource usage, with the option to toggle thresholds to get a visual representation of resource consumption with respect to the desired thresholds. Graph refreshes every 10 seconds, and is reset each time the app runs.
