from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from monitor import check_stats, update_thresholds, get_thresholds, get_history


app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stats")
def get_stats():
    return check_stats()

@app.post("/thresholds")
async def update_thresholds_route(request: Request):
    data = await request.json()
    update_thresholds(data)
    return {"message": "Thresholds updated successfully"}

@app.get("/thresholds")
def thresholds():
    return get_thresholds()

@app.get("/history")
def history():
    return get_history()
