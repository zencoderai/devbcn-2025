from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Talk(Base):
    __tablename__ = "talks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    speaker_name = Column(String(100), nullable=False)
    speaker_email = Column(String(100), nullable=False)
    speaker_bio = Column(Text)
    speaker_company = Column(String(100))
    talk_type = Column(String(50), nullable=False)  # keynote, talk, workshop, lightning
    duration = Column(Integer, nullable=False)  # in minutes
    level = Column(String(20), nullable=False)  # beginner, intermediate, advanced
    tags = Column(String(500))  # comma-separated tags
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())