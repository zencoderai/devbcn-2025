from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from prometheus_fastapi_instrumentator import Instrumentator
import models
import schemas
import crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Conference API", version="1.0.0")

# Initialize Prometheus metrics
instrumentator = Instrumentator()
instrumentator.instrument(app).expose(app)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Conference API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "conference-api"}

@app.get("/conference-info")
def get_conference_info():
    return {
        "name": "DevBCN 2025",
        "date": "July 15-16, 2025",
        "location": "Barcelona, Spain",
        "description": "Join us for the premier developer conference in Barcelona! DevBCN 2025 brings together the brightest minds in technology for two days of inspiring talks, networking, and learning.",
        "theme": "Building the Future of Technology",
        "venue": "Palau de la Música Catalana",
        "capacity": 500,
        "call_for_papers_deadline": "March 31, 2025"
    }

@app.post("/talks/", response_model=schemas.Talk)
def create_talk(talk: schemas.TalkCreate, db: Session = Depends(get_db)):
    return crud.create_talk(db=db, talk=talk)

@app.get("/talks/", response_model=List[schemas.Talk])
def read_talks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    talks = crud.get_talks(db, skip=skip, limit=limit)
    return talks

@app.get("/talks/{talk_id}", response_model=schemas.Talk)
def read_talk(talk_id: int, db: Session = Depends(get_db)):
    db_talk = crud.get_talk(db, talk_id=talk_id)
    if db_talk is None:
        raise HTTPException(status_code=404, detail="Talk not found")
    return db_talk