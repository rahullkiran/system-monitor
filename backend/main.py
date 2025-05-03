from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from monitor import check_stats, get_thresholds, update_thresholds, get_history
import os
import json

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clear history.json on startup
HISTORY_FILE = "history.json"
if os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)

@app.get("/stats")
def stats():
    return check_stats()

@app.get("/thresholds")
def thresholds():
    return get_thresholds()

@app.post("/thresholds")
async def update(request: Request):
    new_thresholds = await request.json()
    update_thresholds(new_thresholds)
    return {"message": "Thresholds updated successfully"}

@app.get("/history")
def history():
    return get_history()
