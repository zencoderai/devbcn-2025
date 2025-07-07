from sqlalchemy.orm import Session
import models
import schemas

def get_talk(db: Session, talk_id: int):
    return db.query(models.Talk).filter(models.Talk.id == talk_id).first()

def get_talks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Talk).offset(skip).limit(limit).all()

def create_talk(db: Session, talk: schemas.TalkCreate):
    db_talk = models.Talk(**talk.dict())
    db.add(db_talk)
    db.commit()
    db.refresh(db_talk)
    return db_talk