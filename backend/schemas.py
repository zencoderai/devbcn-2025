from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class TalkBase(BaseModel):
    title: str
    description: str
    speaker_name: str
    speaker_email: EmailStr
    speaker_bio: Optional[str] = None
    speaker_company: Optional[str] = None
    talk_type: str  # keynote, talk, workshop, lightning
    duration: int  # in minutes
    level: str  # beginner, intermediate, advanced
    tags: Optional[str] = None

class TalkCreate(TalkBase):
    pass

class Talk(TalkBase):
    id: int
    is_approved: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True