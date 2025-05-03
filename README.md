A lightweight tool that monitors real-time system resources (CPU, memory, disk usage) and sends an alert if user-defined thresholds are exceeded. Built using ReactJS(frontend) and python with FastAPI(backend). 


COMPONENTS:             TECH USED: 
Frontend                ReactJS, Recharts, CSS
Backend                 FastAPI, psutil 
Others                  JSON for config/history

AI Tools Used: 
ChatGPT: Used for prototyping, debugging, frontend/backend enhancements

INSTALLATION INSTRUCTIONS:
Prerequisites: 
* Python 3.8+
* Node.js (React) 
* pip, npm

Backend Setup: 
cd backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload

Frontend Setup
cd frontend 
npm install 
npm start 
Visit the app at: http://localhost:3000

DOCKER SETUP: 
To run using Docker Compose: 
docker-compose up --build 

FOLDER STRUCTURE: 
system-monitor/
├── backend/
│   ├── main.py
│   ├── monitor.py
│   ├── thresholds.json
│   ├── history.json
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── App.js
└── docker-compose.yml (optional)